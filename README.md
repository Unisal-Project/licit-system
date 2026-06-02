<div align="center">

# 🏛️ LicitSys

### Plataforma de Gestão de Licitações para Órgãos Públicos

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)]()
[![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat-square)]()

<br>

> Sistema desenvolvido para modernizar e digitalizar o gerenciamento de licitações públicas,
> centralizando processos, documentos, usuários e indicadores em uma única plataforma.

💡 **Documentação da API:** `http://localhost:8000/docs`

</div>

---

# 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#️-tecnologias)
- [Arquitetura](#️-arquitetura)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração](#️-configuração)
- [Execução com Docker](#-execução-com-docker)
- [Execução Local](#-execução-local)
- [Controle de Acesso](#-controle-de-acesso)
- [Banco de Dados](#️-banco-de-dados)
- [API](#-api)
- [Frontend](#️-frontend)
- [Uploads](#-uploads)
- [Scripts Úteis](#-scripts-úteis)
- [Troubleshooting](#-troubleshooting)

---

# 🎯 Sobre o Projeto

O **LicitSys** é uma plataforma web desenvolvida para auxiliar órgãos públicos no gerenciamento de processos licitatórios.

O sistema surgiu como um projeto extensionista universitário em parceria com a Prefeitura Municipal de Cruzeiro-SP, com o objetivo de substituir processos manuais, documentos físicos e controles descentralizados por uma solução digital moderna e segura.

A plataforma permite:

- Centralização de informações;
- Gestão de processos licitatórios;
- Controle de usuários e permissões;
- Armazenamento de documentos;
- Indicadores gerenciais;
- Acompanhamento do ciclo completo das licitações.

---

# ✨ Funcionalidades

## 🔐 Segurança e Controle de Acesso

- Autenticação JWT
- Controle de permissões por perfil
- Recuperação de senha por token
- Sessões protegidas
- Controle de acessos remotos

## 📋 Gestão de Licitações

- Cadastro de licitações
- Edição de processos
- Exclusão de registros
- Visualização detalhada
- Histórico de alterações
- Controle de status

## 📂 Gestão de Documentos

- Upload de anexos
- Download de arquivos
- Organização documental
- Vinculação por processo

## 👥 Gestão de Usuários

- Cadastro de usuários
- Controle de perfis
- Administração de permissões
- Controle de acessos

## 📊 Dashboard Gerencial

- Estatísticas em tempo real
- Indicadores operacionais
- Últimas licitações cadastradas
- Resumo geral do sistema

---

# 🛠️ Tecnologias

## Backend

- Python 3.11
- FastAPI
- Uvicorn
- Pydantic
- JWT Authentication
- Passlib / Bcrypt
- MySQL Connector
- Python Multipart

## Frontend

- React 19
- Vite
- React Router
- React Select
- React Toastify
- Lucide React
- Bootstrap Icons

## Banco de Dados

- MySQL 8.0

## Infraestrutura

- Docker
- Docker Compose

---

# 🏗️ Arquitetura

O sistema segue uma arquitetura em camadas visando:

- Escalabilidade
- Manutenibilidade
- Separação de responsabilidades
- Facilidade de testes

```text
Frontend (React)
        │
        ▼
API REST (FastAPI)
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
Router Service Repository
        │
        ▼
      MySQL
```

## Fluxo de Autenticação

```text
Usuário
   │
   ▼
Login
   │
   ▼
FastAPI
   │
   ▼
JWT Token
   │
   ▼
Frontend armazena token
   │
   ▼
Authorization: Bearer <token>
```

---

# 📁 Estrutura do Projeto

```text
.
├── BackEnd/
│   ├── app/
│   │   ├── core/
│   │   ├── repository/
│   │   ├── router/
│   │   ├── schema/
│   │   ├── service/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── init-db/
│   │   └── init.sql
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── FrontEnd/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── uploads/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 📦 Pré-requisitos

## Docker

- Docker
- Docker Compose

## Ambiente Local

- Python 3.11+
- Node.js 20+
- npm
- MySQL 8+

---

# ⚙️ Configuração

Clone o repositório:

```bash
git clone https://github.com/Unisal-Project/licit-system.git

cd licit-system
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Exemplo:

```env
DB_HOST=db
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=licit_system

SECRET_KEY=sua_chave_jwt

ACCESS_TOKEN_EXPIRE_MINUTES=480

FRONTEND_URL=http://localhost:5173

VITE_API_BASE_URL=http://localhost:8000/v1
```

---

# 🐳 Execução com Docker

Subir ambiente completo:

```bash
docker compose up --build
```

Serviços disponíveis:

| Serviço | URL |
|----------|----------|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000 |
| Swagger | http://localhost:8000/docs |
| MySQL | localhost:3307 |

Parar ambiente:

```bash
docker compose down
```

Recriar banco:

```bash
docker compose down -v

docker compose up --build
```

---

# 💻 Execução Local

## Banco de Dados

```bash
mysql -u root -p < BackEnd/init-db/init.sql
```

---

## Backend

```bash
cd BackEnd

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --reload
```

---

## Frontend

```bash
cd FrontEnd

npm install

npm run dev
```

---

# 👥 Controle de Acesso

O sistema trabalha com quatro níveis de permissão.

| Perfil | Permissões |
|----------|----------|
| suporte | Controle total do sistema |
| admin | Gestão administrativa |
| editor | Gerenciamento de licitações |
| visitante | Apenas visualização |

---

# 🗄️ Banco de Dados

Banco padrão:

```text
licit_system
```

## Principais Tabelas

| Tabela | Finalidade |
|----------|----------|
| usuarios | Usuários do sistema |
| licitacoes | Processos licitatórios |
| categorias | Categorias |
| secretarias | Secretarias |
| anexos | Arquivos anexados |
| licitacao_logs | Histórico |
| convites | Acessos remotos |
| password_reset_tokens | Recuperação de senha |

---

# 📡 API

Todos os endpoints utilizam:

```text
/v1
```

## Principais Módulos

```text
/v1/auth
/v1/users
/v1/biddings
/v1/attachments
/v1/departments
/v1/categories
/v1/dashboard
```

Documentação interativa:

```text
http://localhost:8000/docs
```

---

# 🖥️ Frontend

## Rotas Principais

| Rota | Descrição |
|----------|----------|
| /login | Login |
| /register | Cadastro |
| /forgot-password | Recuperação de senha |
| /dashboard | Dashboard |
| /procurements | Lista de licitações |
| /procurements/create | Nova licitação |
| /procurements/edit/:id | Editar licitação |
| /procurements/:id | Detalhes |
| /remote-access | Acesso remoto |
| /users | Gestão de usuários |

---

# 📂 Uploads

Os arquivos são armazenados em:

```text
/uploads
```

Download:

```text
/v1/attachments/{attachment_id}/download
```

---

# 🚀 Scripts Úteis

## Frontend

```bash
npm run dev

npm run build

npm run lint

npm run preview
```

## Backend

```bash
uvicorn app.main:app --reload
```

## Docker

```bash
docker compose up --build

docker compose down

docker compose logs -f api

docker compose logs -f frontend

docker compose logs -f db
```

---

# 🔧 Troubleshooting

## API não conecta ao banco

Verifique:

```env
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
```

Docker:

```env
DB_HOST=db
DB_PORT=3306
```

Local:

```env
DB_HOST=localhost
DB_PORT=3307
```

---

## Frontend não encontra API

Verifique:

```env
VITE_API_BASE_URL
```

Exemplo:

```env
VITE_API_BASE_URL=http://localhost:8000/v1
```

---

## Recuperação de senha não envia e-mail

Configure:

```env
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
SMTP_USE_TLS
```

---

## Alterei o init.sql e nada mudou

O script roda apenas na criação do volume.

Recrie o banco:

```bash
docker compose down -v

docker compose up --build
```

---

<div align="center">

### 🏛️ LicitSys

Sistema desenvolvido para modernizar e digitalizar a gestão de licitações públicas.

**Projeto Extensionista • UNISAL • Prefeitura Municipal de Cruzeiro**

</div>

## Funcionalidades

- Autenticação com JWT.
- Cadastro e login de usuários.
- Redefinição de senha por token, com envio por SMTP quando configurado.
- Controle de perfis: `suporte`, `admin`, `editor` e `visitante`.
- Listagem, criação, edição, exclusão e detalhamento de licitações.
- Filtros de licitação por número, ano, secretaria, categoria, status e busca textual.
- Dashboard com resumo e últimas licitações.
- Gestão de secretarias e categorias.
- Upload, listagem, download e remoção de anexos por licitação.
- Geração de acesso remoto para usuários `editor` ou `visitante`.
- Bloqueio de uso em telas pequenas ou dispositivos com ponteiro touch.

## Tecnologias

Backend:

- Python 3.11
- FastAPI
- Uvicorn
- MySQL Connector
- Pydantic
- Passlib/bcrypt
- JWT
- python-multipart

Frontend:

- React 19
- Vite
- React Router
- React Select
- React Toastify
- Lucide React
- Bootstrap Icons

Infraestrutura:

- Docker
- Docker Compose
- MySQL 8.0

## Arquitetura

O frontend consome a API pelo prefixo `/v1`. A API se conecta ao MySQL usando as variáveis `DB_*` e expõe arquivos enviados pelo caminho `/uploads`.

Fluxo principal:

1. O usuário autentica em `/v1/auth/login`.
2. A API retorna um token JWT e os dados do usuário.
3. O frontend salva o token em `localStorage`.
4. As chamadas posteriores enviam `Authorization: Bearer <token>`.
5. Rotas protegidas validam o token e checam o perfil do usuário.

Camadas do backend:

- `router`: entrada HTTP, valida dependências e delega para serviços.
- `service`: regras de negócio, transações e composição de respostas.
- `repository`: consultas SQL e persistência.
- `schema`: contratos Pydantic de entrada e saída.
- `utils`: autenticação, resposta, paginação e arquivos.
- `core`: configuração e conexão com o banco.

## Pré-requisitos

Para execução com Docker:

- Docker
- Docker Compose

Para execução local:

- Python 3.11+
- Node.js 20+
- MySQL 8.0+
- npm

## Configuração

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Principais variáveis:

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DB_HOST` | Host do MySQL | `db` no Docker, `localhost` local |
| `DB_PORT` | Porta do MySQL | `3306` no Docker, `3307` pelo host do Compose |
| `DB_USER` | Usuário do banco | `user` |
| `DB_PASSWORD` | Senha do banco | `licitpass123` |
| `DB_NAME` | Nome do banco | `licit_system` |
| `SECRET_KEY` | Chave de assinatura JWT | chave longa e aleatória |
| `ALGORITHM` | Algoritmo JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiração do token de login | `480` |
| `PASSWORD_RESET_EXPIRE_MINUTES` | Expiração do token de redefinição | `30` |
| `PASSWORD_RESET_DEBUG` | Retorna link de reset na resposta quando `true` | `true` em desenvolvimento |
| `SMTP_HOST` | Servidor SMTP | vazio para não enviar e-mail |
| `SMTP_PORT` | Porta SMTP | `587` |
| `SMTP_USER` | Usuário SMTP | conforme provedor |
| `SMTP_PASSWORD` | Senha SMTP | conforme provedor |
| `SMTP_FROM` | Remetente do e-mail | `no-reply@dominio.com` |
| `SMTP_USE_TLS` | Usa TLS no SMTP | `true` |
| `FRONTEND_URL` | URL pública do frontend | `http://localhost:5173` |
| `CORS_ORIGINS` | Origens liberadas no CORS | `http://localhost:5173,http://localhost:3000` |
| `CORS_ORIGIN_REGEX` | Regex adicional de CORS | ver `.env.example` |
| `VITE_API_BASE_URL` | URL da API usada pelo frontend | vazio para detectar automaticamente |

Em produção, altere `SECRET_KEY`, senhas do banco e desative `PASSWORD_RESET_DEBUG`.

## Execução com Docker

Suba o ambiente completo:

```bash
docker compose up --build
```

Serviços:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- Swagger/OpenAPI: `http://localhost:8000/docs`
- MySQL no host: `localhost:3307`

O banco é inicializado com o script `BackEnd/init-db/init.sql` na primeira criação do volume `mysql_data`.

Para parar:

```bash
docker compose down
```

Para recriar o banco do zero, removendo os dados persistidos:

```bash
docker compose down -v
docker compose up --build
```

## Execução local

### Banco

Crie o banco usando o script:

```bash
mysql -u root -p < BackEnd/init-db/init.sql
```

Se estiver usando o MySQL do Docker Compose, a porta exposta no host é `3307`.

### Backend

```bash
cd BackEnd
python -m venv .venv
source .venv/bin/activate
pip install -r requirements
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Antes de iniciar, garanta que as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` estejam definidas no ambiente ou no arquivo `.env` da raiz.

### Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

O Vite inicia, por padrão, em `http://localhost:5173`.

## Acessos e permissões

Perfis existentes:

| Perfil | Permissões principais |
| --- | --- |
| `suporte` | Acesso administrativo completo, incluindo informações privadas de usuários. |
| `admin` | Gerencia usuários, acessos remotos, secretarias, categorias e licitações. |
| `editor` | Cria, edita e exclui licitações e anexos. |
| `visitante` | Visualiza dashboard, lista e detalhes de licitações. |

Rotas administrativas do backend usam:

- `check_admin`: permite `suporte` e `admin`.
- `check_bidding_manager`: permite `suporte`, `admin` e `editor`.
- `get_current_user`: exige token válido.

O script inicial cria um usuário de suporte com e-mail `suporte@licitsystem.local`. A senha está armazenada como hash bcrypt no SQL inicial; em um ambiente real, defina ou redefina a senha antes do uso.

## Estrutura do projeto

```text
.
├── BackEnd/
│   ├── app/
│   │   ├── core/
│   │   ├── repository/
│   │   ├── router/
│   │   ├── schema/
│   │   ├── service/
│   │   ├── utils/
│   │   └── main.py
│   ├── init-db/
│   │   └── init.sql
│   ├── Dockerfile
│   ├── Swagger.json
│   └── requirements
├── FrontEnd/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Banco de dados

Banco padrão: `licit_system`.

Tabelas principais:

- `usuarios`: usuários locais e acessos remotos.
- `secretarias`: secretarias vinculadas às licitações.
- `categorias`: categorias/classificações de licitação.
- `licitacoes`: registros de licitações.
- `licitacao_logs`: histórico de ações em licitações.
- `anexos`: arquivos vinculados às licitações.
- `convites`: estrutura para convites/acessos.
- `password_reset_tokens`: tokens de redefinição de senha.

Veja mais detalhes em [docs/DATABASE.md](docs/DATABASE.md).

## API

A API usa o prefixo `/v1` para os módulos de negócio.

Grupos principais:

- `/v1/auth`
- `/v1/users`
- `/v1/biddings`
- `/v1/attachments`
- `/v1/departments`
- `/v1/categories`
- `/v1/dashboard`

A referência resumida está em [docs/API.md](docs/API.md).

Com o backend rodando, a documentação interativa fica disponível em:

```text
http://localhost:8000/docs
```

## Frontend

Principais rotas:

| Rota | Descrição |
| --- | --- |
| `/login` | Login |
| `/register` | Cadastro |
| `/forgot-password` | Solicitação de redefinição |
| `/reset-password` | Redefinição de senha |
| `/dashboard` | Resumo geral |
| `/procurements` | Lista de licitações |
| `/procurements/create` | Nova licitação |
| `/procurements/edit/:id` | Editar licitação |
| `/procurements/:id` | Detalhes da licitação |
| `/remote-access` | Geração de acesso remoto |
| `/users` | Gestão de usuários |
| `/settings` | Configurações |

O frontend considera plataformas não suportadas quando a tela tem largura até `1180px` ou ponteiro coarse/touch.

## Uploads

Anexos são gravados no diretório `uploads` da API.

No Docker Compose, a raiz do projeto monta:

```text
./uploads:/app/uploads
```

A API expõe arquivos estáticos pelo caminho:

```text
/uploads
```

Os endpoints de download passam por `/v1/attachments/{attachment_id}/download`.

## Scripts úteis

Frontend:

```bash
cd FrontEnd
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
cd BackEnd
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Docker:

```bash
docker compose up --build
docker compose down
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f db
```

## Troubleshooting

### A API não conecta no banco

Confira `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`.

No Docker, a API deve usar `DB_HOST=db` e `DB_PORT=3306`. Pelo host da máquina, o MySQL do Compose fica em `localhost:3307`.

### O frontend chama a API errada

Se `VITE_API_BASE_URL` estiver vazio, o frontend monta a URL dinamicamente usando o host atual e porta `8000`, com prefixo `/v1`.

Exemplo:

```text
http://localhost:8000/v1
```

### Redefinição de senha não envia e-mail

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` e `SMTP_USE_TLS`.

Sem SMTP, o backend imprime o link no log. Em desenvolvimento, se `PASSWORD_RESET_DEBUG=true`, o link também aparece na resposta da API.

### Alterei o SQL inicial, mas o banco não mudou

O script `init.sql` só roda automaticamente quando o volume do MySQL é criado. Para recriar:

```bash
docker compose down -v
docker compose up --build
```

Isso apaga os dados locais do banco.
