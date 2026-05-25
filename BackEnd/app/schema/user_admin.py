from pydantic import BaseModel, Field


class UserRoleUpdate(BaseModel):
    perfil: str = Field(..., pattern="^(suporte|admin|editor|visitante)$")


class UserPasswordUpdate(BaseModel):
    senha_atual: str = Field(..., min_length=1, max_length=128)
    nova_senha: str = Field(..., min_length=8, max_length=128)
