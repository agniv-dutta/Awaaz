from pydantic import BaseModel


class AnalyzeReportRequest(BaseModel):
    raw_text: str


class AnalyzeReportResponse(BaseModel):
    category: str
    urgency: str
    summary: str
    keyNeeds: list[str]


class DispatchSuggestionRequest(BaseModel):
    need: dict
    top_volunteers: list[dict]


class DispatchSuggestionResponse(BaseModel):
    suggestion: str


class VolunteerInsightRequest(BaseModel):
    volunteer: dict
    open_needs: list[dict]


class VolunteerInsightResponse(BaseModel):
    insight: str
