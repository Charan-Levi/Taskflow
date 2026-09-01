from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AnalyticsSummary, InsightsResponse
from app.services import get_summary, get_insights

router = APIRouter()

@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def summary(db: Session = Depends(get_db)):
    return get_summary(db)

@router.get("/analytics/insights", response_model=InsightsResponse)
async def insights(db: Session = Depends(get_db)):
    return InsightsResponse(insights=get_insights(db))
