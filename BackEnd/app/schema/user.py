from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    perfil: Optional[str] = "visitante"

class UserCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    senha: str = Field(..., min_length=8, max_length=128)

class UserResponse(UserBase):
    id: int
    ativo: bool
    criado_em: datetime
    ultimo_login: Optional[datetime] = None

    class Config:
        from_attributes = True
