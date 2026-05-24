from pydantic import BaseModel, Field
from datetime import datetime

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict = None

class VisitorTokenRequest(BaseModel):
    expiracao_horas: int = Field(24, ge=1, le=168) # Default 24h, max 1 semana

class VisitorTokenResponse(BaseModel):
    link_acesso: str
    access_token: str
    expira_em: datetime
