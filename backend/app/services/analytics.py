import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.need import Need, NeedStatus
from app.models.volunteer import Volunteer
from app.models.dispatch import Dispatch, DispatchStatus
from app.schemas.analytics import AnalyticsSummary, HeatmapPoint

async def get_analytics_summary(db: AsyncSession, ward_id: uuid.UUID | None = None) -> AnalyticsSummary:
    needs_query = select(Need)
    volunteers_query = select(Volunteer).filter(Volunteer.is_active == True)
    dispatches_query = select(Dispatch).filter(Dispatch.status == DispatchStatus.COMPLETED)

    if ward_id:
        needs_query = needs_query.filter(Need.ward_id == ward_id)
        volunteers_query = volunteers_query.filter(Volunteer.home_ward_id == ward_id)
        dispatches_query = dispatches_query.join(Need, Dispatch.need_id == Need.id).filter(Need.ward_id == ward_id)

    needs = (await db.execute(needs_query)).scalars().all()
    volunteers = (await db.execute(volunteers_query)).scalars().all()
    dispatches = (await db.execute(dispatches_query)).scalars().all()

    total_needs = len(needs)
    open_needs = sum(1 for n in needs if n.status == NeedStatus.OPEN)
    fulfilled_needs = sum(1 for n in needs if n.status == NeedStatus.FULFILLED)
    
    return AnalyticsSummary(
        total_needs=total_needs,
        open_needs=open_needs,
        fulfilled_needs=fulfilled_needs,
        active_volunteers=len(volunteers),
        completed_dispatches=len(dispatches)
    )

async def get_heatmap_data(db: AsyncSession, ward_id: uuid.UUID | None = None) -> list[HeatmapPoint]:
    query = select(Need).filter(Need.status == NeedStatus.OPEN)
    if ward_id:
        query = query.filter(Need.ward_id == ward_id)
    
    needs = (await db.execute(query)).scalars().all()
    points = []
    for need in needs:
        if need.location_lat and need.location_lng:
            points.append(HeatmapPoint(
                lat=need.location_lat,
                lng=need.location_lng,
                weight=need.urgency_score * need.report_count
            ))
    return points
