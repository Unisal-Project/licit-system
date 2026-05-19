from typing import Optional
from pydantic import BaseModel

class CategoryCreate(BaseModel):
    nome: str
    tipo: Optional[str] = "Global"

class CategoryUpdate(BaseModel):
    nome: Optional[str] = None
    tipo: Optional[str] = None
