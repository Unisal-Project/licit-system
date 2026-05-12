from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class AttachmentCreate(BaseModel):
    licitacao_id: int
    nome: str
    caminho: str
    tipo: Optional[str] = None
    categoria: str = "documento"
    tamanho_kb: Optional[int] = None

class AttachmentUpdate(BaseModel):
    categoria: Optional[str] = None

class AttachmentResponse(BaseModel):
    id: int
    licitacao_id: int
    nome: str
    caminho: str
    tipo: Optional[str] = None
    categoria: str
    tamanho_kb: Optional[int] = None
    criado_em: Optional[datetime] = None


    model_config = ConfigDict(from_attributes=True)

