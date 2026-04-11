from datetime import date
from pydantic import BaseModel

class HeatmapPoint(BaseModel):
    lat: float
    lng: float
    weight: float

class AnalyticsSummary(BaseModel):
    total_needs: int
    open_needs: int
    fulfilled_needs: int
    active_volunteers: int
    completed_dispatches: int
