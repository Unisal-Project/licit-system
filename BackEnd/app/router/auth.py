from fastapi import APIRouter, Depends
from app.schema.auth import LoginRequest, TokenResponse, VisitorTokenRequest, VisitorTokenResponse
from app.schema.user import UserCreate
from app.service import auth as auth_service
from app.utils.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    return auth_service.authenticate_user(data)

@router.post("/register")
def register(data: UserCreate):
    return auth_service.register_user(data)

@router.post("/visitor-access", response_model=VisitorTokenResponse)
def generate_visitor_access(data: VisitorTokenRequest, current_user: dict = Depends(get_current_user)):
    return auth_service.generate_visitor_token(data, current_user)
