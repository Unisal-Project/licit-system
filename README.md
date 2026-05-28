# LicitSystem

Sistema web para gerenciamento de licitações, usuários, permissões, anexos e acessos remotos.

O projeto é dividido em:

- `BackEnd`: API REST em FastAPI com MySQL.
- `FrontEnd`: aplicação React com Vite.
- `BackEnd/init-db`: script SQL de criação e carga inicial do banco.
- `docker-compose.yml`: ambiente completo com banco, API e frontend.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Execução com Docker](#execução-com-docker)
- [Execução local](#execução-local)
- [Acessos e permissões](#acessos-e-permissões)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Banco de dados](#banco-de-dados)
- [API](#api)
- [Frontend](#frontend)
- [Uploads](#uploads)
- [Troubleshooting](#troubleshooting)

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
