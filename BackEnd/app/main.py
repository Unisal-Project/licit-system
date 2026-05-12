from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from app.router import bidding_router, department, category, attachment, dashboard

app = FastAPI(
    title="LicitSystem API",
    description="API para gerenciamento de licitações e anexos",
    version="1.0.0"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Garantir que o diretório de uploads existe
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Montar diretório de arquivos estáticos para acesso aos anexos
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Registro de Rotas
app.include_router(department.router)
app.include_router(category.router)
app.include_router(bidding_router.router)
app.include_router(attachment.router)
app.include_router(dashboard.router)

@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "LicitSystem API is running",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
