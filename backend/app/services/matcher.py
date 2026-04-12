import uuid
from datetime import datetime, timezone
import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.volunteer import Volunteer, SkillEnum
from app.models.need import Need, NeedCategory
from app.models.dispatch import Dispatch, DispatchStatus
from app.utils.geo import haversine

logger = logging.getLogger(__name__)

def need_category_to_skill(category: NeedCategory) -> SkillEnum | None:
    mapping = {
        NeedCategory.FOOD: SkillEnum.COOKING,
        NeedCategory.MEDICAL: SkillEnum.MEDICAL,
        NeedCategory.SHELTER: SkillEnum.LOGISTICS,
        NeedCategory.EDUCATION: SkillEnum.TEACHING,
        NeedCategory.LEGAL: SkillEnum.LEGAL,
        NeedCategory.MENTAL_HEALTH: SkillEnum.COUNSELING,
        NeedCategory.ELDERLY_CARE: SkillEnum.MEDICAL,
        NeedCategory.DISABILITY: SkillEnum.MEDICAL,
        NeedCategory.OTHER: SkillEnum.LOGISTICS,
    }
    return mapping.get(category)

def check_availability(schedule: dict, requested_time: datetime) -> float:
    day_str = requested_time.strftime('%a').lower()
    slots = schedule.get(day_str, [])
    if not slots:
        return 0.0
        
    req_time = requested_time.time()
    for slot in slots:
        try:
            start_str, end_str = slot.split('-')
            start_time = datetime.strptime(start_str.strip(), "%H:%M").time()
            end_time = datetime.strptime(end_str.strip(), "%H:%M").time()
            if start_time <= req_time <= end_time:
                return 1.0
        except Exception:
            continue
    return 0.0

async def get_ward_primary_language(db: AsyncSession, ward_id: uuid.UUID) -> str:
    # For now, a stub. You could query Ward demographics
    return "Hindi"

async def compute_match_score(volunteer: Volunteer, need: Need, requested_time: datetime, db: AsyncSession) -> float:
    req_skill = need_category_to_skill(need.category)
    skill_match = 1.0 if req_skill and req_skill.value in volunteer.skills else 0.0
    
    if volunteer.current_lat is not None and need.location_lat is not None:
        dist_km = haversine(volunteer.current_lat, volunteer.current_lng,
                            need.location_lat, need.location_lng)
        if dist_km > volunteer.max_radius_km:
            proximity_score = 0.0
        else:
            proximity_score = max(0, 1 - (dist_km / volunteer.max_radius_km))
    else:
        proximity_score = 0.5
    
    availability_score = check_availability(volunteer.availability_schedule, requested_time)
    
    ward_language = await get_ward_primary_language(db, need.ward_id)
    language_match = 1.0 if ward_language in volunteer.languages else 0.0
    
    score = (
        0.35 * skill_match +
        0.25 * proximity_score +
        0.20 * volunteer.reliability_score +
        0.15 * availability_score +
        0.05 * language_match
    )
    return round(score, 4)

async def get_top_matches(db: AsyncSession, need_id: uuid.UUID, n: int = 5) -> list[tuple[Volunteer, float]]:
    need_result = await db.execute(select(Need).where(Need.id == str(need_id)))
    need = need_result.scalar_one_or_none()
    
    if not need:
        return []
        
    requested_time = datetime.now(timezone.utc)
    
    # Exclude volunteers who already declined this exact need
    declined_result = await db.execute(
        select(Dispatch.volunteer_id)
        .where(Dispatch.need_id == str(need_id), Dispatch.status == DispatchStatus.DECLINED)
    )
    declined_volunteer_ids = set(declined_result.scalars().all())

    volunteers_result = await db.execute(select(Volunteer).where(Volunteer.is_active == True))
    volunteers = volunteers_result.scalars().all()
    
    scored_volunteers = []
    for vol in volunteers:
        if vol.reliability_score == 0:
            continue
        if vol.id in declined_volunteer_ids:
            continue
            
        score = await compute_match_score(vol, need, requested_time, db)
        scored_volunteers.append((vol, score))
        
    # Sort descending by score. In case of tie, volunteer reliability score acts as tie-breaker implicitly via logic above,
    # or we can explicitly do: key=lambda x: (x[1], x[0].reliability_score)
    scored_volunteers.sort(key=lambda x: (x[1], x[0].reliability_score), reverse=True)
    
    top_matches = scored_volunteers[:n]
    
    return top_matches
