from fastapi import APIRouter

from app.service import dashboard as dashboard_service


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_summary():
    return dashboard_service.get_dashboard_summary()


@router.get("/biddings")
def get_latest_biddings():
    return dashboard_service.get_latest_biddings()