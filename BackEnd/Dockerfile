# Use a imagem oficial do Python como base
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Define variáveis de ambiente para o Python
# PYTHONDONTWRITEBYTECODE: Impede que o Python escreva arquivos .pyc no disco
# PYTHONUNBUFFERED: Garante que os logs do console sejam exibidos em tempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala dependências do sistema necessárias para o mysql-connector e outras libs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copia o arquivo de requisitos primeiro (otimização de cache do Docker)
COPY requirements .

# Instala as dependências do Python
RUN pip install --no-cache-dir -r requirements

# Copia o restante do código da aplicação
COPY . .

# Cria o diretório de uploads se não existir
RUN mkdir -p uploads/licitacoes

# Expõe a porta que o FastAPI usa
EXPOSE 8000

# Comando para rodar a aplicação
# Usamos o host 0.0.0.0 para que a API seja acessível fora do container
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
