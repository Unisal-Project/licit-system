from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from app.router import bidding, department, category, attachment, dashboard, auth, user

app = FastAPI(
    title="LicitSystem API",
    description="API para gerenciamento de licitações e anexos",
    version="1.0.0"
)

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    if origin.strip()
]
cors_origin_regex = os.getenv(
    "CORS_ORIGIN_REGEX",
    r"https?://(localhost|127\.0\.0\.1|0\.0\.0\.0|[\w.-]+)(?::\d+)?"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=cors_origin_regex,
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
app.include_router(auth.router, prefix="/v1")
app.include_router(user.router, prefix="/v1")
app.include_router(department.router, prefix="/v1")
app.include_router(category.router, prefix="/v1")
app.include_router(bidding.router, prefix="/v1")
app.include_router(attachment.router, prefix="/v1")
app.include_router(dashboard.router, prefix="/v1")

@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "LicitSystem API is running",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
