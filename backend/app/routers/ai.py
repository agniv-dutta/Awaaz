from fastapi import APIRouter

from app.schemas.ai import (
    AnalyzeReportRequest,
    AnalyzeReportResponse,
    DispatchSuggestionRequest,
    DispatchSuggestionResponse,
    VolunteerInsightRequest,
    VolunteerInsightResponse,
)
from app.services.ai_service import (
    analyze_report_text,
    generate_dispatch_suggestion,
    get_volunteer_insight,
)

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/analyze-report", response_model=AnalyzeReportResponse)
async def analyze_report(payload: AnalyzeReportRequest):
    parsed = await analyze_report_text(payload.raw_text)
    return AnalyzeReportResponse(**parsed)


@router.post("/dispatch-suggestion", response_model=DispatchSuggestionResponse)
async def dispatch_suggestion(payload: DispatchSuggestionRequest):
    suggestion = await generate_dispatch_suggestion(payload.need, payload.top_volunteers)
    return DispatchSuggestionResponse(suggestion=suggestion or "")


@router.post("/volunteer-insight", response_model=VolunteerInsightResponse)
async def volunteer_insight(payload: VolunteerInsightRequest):
    insight = await get_volunteer_insight(payload.volunteer, payload.open_needs)
    return VolunteerInsightResponse(insight=insight or "")
