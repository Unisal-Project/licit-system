from fastapi import APIRouter, Depends
from typing import Optional
from app.service import dashboard as dashboard_service
from app.utils.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_summary(current_user: Optional[dict] = Depends(get_current_user)):
    user_id = int(current_user["sub"]) if current_user else None
    return dashboard_service.get_dashboard_summary(user_id=user_id)

@router.get("/latest-biddings")
def get_latest(current_user: Optional[dict] = Depends(get_current_user)):
    user_id = int(current_user["sub"]) if current_user else None
    return dashboard_service.get_latest_biddings(user_id=user_id)
