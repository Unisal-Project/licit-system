<div align="center">

# 🚀 LicitSys API

### API REST para Gerenciamento de Licitações Públicas

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)]()
[![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat-square)]()
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)]()

<br>

> API responsável pelo gerenciamento de usuários, autenticação, licitações,
> anexos, categorias, secretarias e indicadores do sistema LicitSys.

💡 **Swagger UI**

`http://localhost:8000/docs`

</div>

---

# 📋 Sumário

- [Sobre a API](#sobre-a-api)
- [Arquitetura](#arquitetura)
- [Autenticação](#autenticação)
- [Perfis de Acesso](#perfis-de-acesso)
- [Módulos da API](#módulos-da-api)
- [Auth](#auth)
- [Users](#users)
- [Biddings](#biddings)
- [Attachments](#attachments)
- [Departments](#departments)
- [Categories](#categories)
- [Dashboard](#dashboard)
- [Códigos de Erro](#códigos-de-erro)
- [Swagger](#swagger)

---

# Sobre a API

A API do LicitSys foi desenvolvida utilizando FastAPI e segue os princípios REST para fornecer acesso aos recursos da plataforma.

Todos os endpoints são disponibilizados através do prefixo:

```text
/v1
```

Base local padrão:

```text
http://localhost:8000/v1
```

---

# Arquitetura

A API segue uma arquitetura em camadas.

```text
Cliente HTTP
      │
      ▼
   Router
      │
      ▼
   Service
      │
      ▼
 Repository
      │
      ▼
    MySQL
```

## Responsabilidades

### Router

- Recebe requisições HTTP
- Valida autenticação
- Faz validação inicial dos dados

### Service

- Implementa regras de negócio
- Realiza validações
- Orquestra operações

### Repository

- Executa consultas SQL
- Manipula persistência dos dados

### Database

- MySQL
- Armazenamento permanente

---

# Autenticação

As rotas protegidas utilizam JWT.

Cabeçalho obrigatório:

```http
Authorization: Bearer <token>
```

Fluxo:

```text
Login
   │
   ▼
JWT
   │
   ▼
Bearer Token
   │
   ▼
Endpoints Protegidos
```

---

# Perfis de Acesso

O sistema possui quatro níveis de acesso.

| Perfil | Permissões |
|----------|----------|
| suporte | Controle total do sistema |
| admin | Administração geral |
| editor | Gestão de licitações |
| visitante | Apenas visualização |

---

# Módulos da API

| Módulo | Prefixo |
|----------|----------|
| Auth | `/auth` |
| Users | `/users` |
| Biddings | `/biddings` |
| Attachments | `/attachments` |
| Departments | `/departments` |
| Categories | `/categories` |
| Dashboard | `/dashboard` |

---

# Auth

Prefixo:

```text
/auth
```

## Endpoints

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | `/login` | Login |
| POST | `/register` | Cadastro |
| POST | `/forgot-password` | Solicitar redefinição |
| POST | `/reset-password` | Redefinir senha |
| POST | `/visitor-access` | Gerar acesso visitante |
| POST | `/remote-access` | Criar acesso remoto |

---

## Login

### Request

```json
{
  "email": "usuario@email.com",
  "password": "senha"
}
```

### Response

```json
{
  "access_token": "jwt",
  "token_type": "bearer",
  "user": {}
}
```

---

## Registro

### Request

```json
{
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

Perfil padrão:

```text
visitante
```

---

# Users

Prefixo:

```text
/users
```

## Endpoints

| Método | Endpoint | Descrição |
|----------|----------|----------|
| GET | `/` | Listar usuários |
| GET | `/me` | Usuário autenticado |
| PATCH | `/me/password` | Alterar senha |
| PATCH | `/{user_id}/role` | Alterar perfil |
| DELETE | `/{user_id}` | Remover usuário |

---

## Alterar Senha

```json
{
  "senha_atual": "senha123",
  "nova_senha": "novaSenha123"
}
```

---

## Alterar Perfil

```json
{
  "perfil": "admin"
}
```

Valores válidos:

```text
suporte
admin
editor
visitante
```

---

# Biddings

Prefixo:

```text
/biddings
```

Gerente de Licitações:

```text
suporte
admin
editor
```

## Endpoints

| Método | Endpoint |
|----------|----------|
| GET | `/` |
| GET | `/{bidding_id}` |
| POST | `/` |
| PATCH | `/{bidding_id}` |
| DELETE | `/{bidding_id}` |

---

## Filtros Disponíveis

| Parâmetro | Tipo |
|----------|----------|
| page | integer |
| limit | integer |
| number | integer |
| year | integer |
| department_id | integer |
| category_id | integer |
| status | string |
| search | string |

---

## Criar Licitação

```json
{
  "department_id": 1,
  "category_id": 1,
  "number": 10,
  "year": 2026,
  "bidding_type": "Pregão Eletrônico",
  "status": "Aguardando Abertura",
  "classification": "Global",
  "object_name": "Aquisição de Equipamentos",
  "object_description": "Descrição detalhada",
  "estimated_value": 15000.50,
  "publication_date": "2026-05-25",
  "opening_date": "2026-06-10"
}
```

---

## Tipos de Licitação

```text
Pregão Eletrônico
Concorrência Pública
Chamada Pública
Concorrência Presencial
Credenciamento
Dispensa Eletrônica
Inexigibilidade
Pregão Presencial
```

---

## Status

```text
Aguardando Abertura
Aberto
Em Andamento
Suspenso
Revogado
Finalizado
```

---

## Classificações

```text
Global
Item
Lote
```

---

# Attachments

Prefixo:

```text
/attachments
```

## Endpoints

| Método | Endpoint |
|----------|----------|
| POST | `/{bidding_id}` |
| GET | `/{bidding_id}` |
| GET | `/{attachment_id}/download` |
| DELETE | `/{attachment_id}` |

---

## Upload

Content-Type:

```text
multipart/form-data
```

Campo:

```text
file
```

---

# Departments

Prefixo:

```text
/departments
```

## Endpoints

| Método | Endpoint |
|----------|----------|
| GET | `/` |
| GET | `/{department_id}` |
| POST | `/` |
| PATCH | `/{department_id}` |
| DELETE | `/{department_id}` |

---

## Criar Secretaria

```json
{
  "sigla": "SEAD",
  "nome": "Secretaria Municipal de Administração"
}
```

---

# Categories

Prefixo:

```text
/categories
```

## Endpoints

| Método | Endpoint |
|----------|----------|
| GET | `/` |
| GET | `/{category_id}` |
| POST | `/` |
| PATCH | `/{category_id}` |
| DELETE | `/{category_id}` |

---

## Criar Categoria

```json
{
  "nome": "Por Item",
  "tipo": "Item"
}
```

---

# Dashboard

Prefixo:

```text
/dashboard
```

## Endpoints

| Método | Endpoint |
|----------|----------|
| GET | `/summary` |
| GET | `/latest-biddings` |

---

# Códigos de Erro

| Código | Significado |
|----------|----------|
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 409 | Conflito de dados |
| 500 | Erro interno |

---

# Swagger

A documentação interativa pode ser acessada através de:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

---

<div align="center">

### 🚀 LicitSys API

API REST construída com FastAPI para gerenciamento completo de licitações públicas.

</div>