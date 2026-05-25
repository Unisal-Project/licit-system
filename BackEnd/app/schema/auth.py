from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    nova_senha: str = Field(..., min_length=8, max_length=128)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict = None

class VisitorTokenRequest(BaseModel):
    expiracao_horas: int = Field(24, ge=1, le=168) # Default 24h, max 1 semana

class VisitorTokenResponse(BaseModel):
    link_acesso: str
    access_token: str
    expira_em: Optional[datetime] = None

class RemoteAccessRequest(BaseModel):
    perfil: str = Field(..., pattern="^(editor|visitante)$")
    usuario: str = Field(..., min_length=3, max_length=100)
    senha: str = Field(..., min_length=6, max_length=128)
    validade_dias: Optional[int] = Field(None, ge=1, le=365)
    permanente: bool = False

class RemoteAccessResponse(BaseModel):
    link_acesso: str
    usuario: str
    senha: str
    perfil: str
    expira_em: Optional[datetime] = None
    permanente: bool = False
