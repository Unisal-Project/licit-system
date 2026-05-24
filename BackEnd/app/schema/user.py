from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    nome: str
    email: EmailStr
    perfil: Optional[str] = "fornecedor"

class UserCreate(UserBase):
    senha: str = Field(..., min_length=6)

class UserResponse(UserBase):
    id: int
    ativo: bool
    criado_em: datetime
    ultimo_login: Optional[datetime] = None

    class Config:
        from_attributes = True
