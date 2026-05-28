from fastapi import APIRouter, Depends, Request, Response
from app.schema.auth import ForgotPasswordRequest, LoginRequest, RemoteAccessRequest, RemoteAccessResponse, ResetPasswordRequest, TokenResponse, VisitorTokenRequest, VisitorTokenResponse
from app.schema.user import UserCreate
from app.service import auth as auth_service
from app.utils.auth import AUTH_COOKIE_NAME, check_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, response: Response):
    result = auth_service.authenticate_user(data)
    token = result.pop("access_token")
    result.pop("token_type", None)

    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=1800,
        path="/",
    )

    return result

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key=AUTH_COOKIE_NAME,
        path="/",
        secure=True,
        httponly=True,
        samesite="strict",
    )
    return {"message": "Logout realizado com sucesso"}

@router.post("/register")
def register(data: UserCreate):
    return auth_service.register_user(data)

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, request: Request):
    return auth_service.request_password_reset(data, request.headers.get("origin"))

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    return auth_service.reset_password(data)

@router.post("/visitor-access", response_model=VisitorTokenResponse)
def generate_visitor_access(data: VisitorTokenRequest, current_user: dict = Depends(check_admin)):
    return auth_service.generate_visitor_token(data, current_user)

@router.post("/remote-access", response_model=RemoteAccessResponse)
def generate_remote_access(
    data: RemoteAccessRequest,
    request: Request,
    current_user: dict = Depends(check_admin)
):
    return auth_service.generate_remote_access(data, current_user, request.headers.get("origin"))
