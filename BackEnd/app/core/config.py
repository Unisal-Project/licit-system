from dotenv import load_dotenv
import os

load_dotenv()

# Variáveis obrigatórias
REQUIRED_ENV_VARS = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"]

for var in REQUIRED_ENV_VARS:
    value = os.getenv(var)
    if not value:
        raise ValueError(f"Variável de ambiente obrigatória não definida: {var}")

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT"))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

