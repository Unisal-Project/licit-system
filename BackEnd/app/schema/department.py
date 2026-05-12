from typing import Optional
from pydantic import BaseModel

class DepartmentCreate(BaseModel):
    sigla: str
    nome: str

class DepartmentUpdate(BaseModel):
    sigla: Optional[str] = None
    nome: Optional[str] = None
