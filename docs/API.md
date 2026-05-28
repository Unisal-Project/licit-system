# Referência da API

A API roda em FastAPI e registra as rotas de negócio com o prefixo `/v1`.

Base local padrão:

```text
http://localhost:8000/v1
```

Documentação interativa:

```text
http://localhost:8000/docs
```

## Autenticação

As rotas protegidas usam token JWT no cabeçalho:

```http
Authorization: Bearer <token>
```

Perfis:

- `suporte`
- `admin`
- `editor`
- `visitante`

Regras comuns:

- `suporte` e `admin`: permissões administrativas.
- `suporte`, `admin` e `editor`: criação/edição de licitações e anexos.
- `visitante`: visualização.

## Auth

Prefixo: `/auth`

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| `POST` | `/login` | Pública | Autentica usuário e retorna token. |
| `POST` | `/register` | Pública | Cadastra usuário visitante. |
| `POST` | `/forgot-password` | Pública | Solicita redefinição de senha. |
| `POST` | `/reset-password` | Pública | Redefine senha com token. |
| `POST` | `/visitor-access` | Admin | Gera token temporário de visitante. |
| `POST` | `/remote-access` | Admin | Cria usuário de acesso remoto. |

### POST `/auth/login`

Entrada:

```json
{
  "email": "usuario@email.com",
  "password": "senha"
}
```

Saída:

```json
{
  "access_token": "jwt",
  "token_type": "bearer",
  "user": {}
}
```

### POST `/auth/register`

Entrada:

```json
{
  "nome": "Nome do Usuario",
  "email": "usuario@email.com",
  "senha": "senha-com-8-ou-mais-caracteres"
}
```

O usuário criado recebe perfil `visitante`.

### POST `/auth/forgot-password`

Entrada:

```json
{
  "email": "usuario@email.com"
}
```

Quando SMTP não está configurado, o link é exibido no log da API. Com `PASSWORD_RESET_DEBUG=true`, o link também pode aparecer na resposta.

### POST `/auth/reset-password`

Entrada:

```json
{
  "token": "token-de-reset",
  "nova_senha": "nova-senha-com-8-ou-mais-caracteres"
}
```

### POST `/auth/remote-access`

Proteção: `suporte` ou `admin`.

Entrada:

```json
{
  "perfil": "editor",
  "usuario": "acesso.editor",
  "senha": "senha123",
  "validade_dias": 7,
  "permanente": false
}
```

Observações:

- `perfil` aceita `editor` ou `visitante`.
- Visitantes expiram em 24 horas.
- Acesso permanente só é considerado para perfil `editor`.

## Users

Prefixo: `/users`

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | Token | Lista usuários conforme permissões do usuário atual. |
| `GET` | `/me` | Token | Retorna perfil do usuário autenticado. |
| `PATCH` | `/me/password` | Token | Altera a própria senha. |
| `PATCH` | `/{user_id}/role` | Token | Altera perfil de um usuário. |
| `DELETE` | `/{user_id}` | Token | Remove/desativa usuário conforme regra do serviço. |

### PATCH `/users/me/password`

Entrada:

```json
{
  "senha_atual": "senha-atual",
  "nova_senha": "nova-senha-com-8-ou-mais-caracteres"
}
```

### PATCH `/users/{user_id}/role`

Entrada:

```json
{
  "perfil": "admin"
}
```

Valores aceitos: `suporte`, `admin`, `editor`, `visitante`.

## Biddings

Prefixo: `/biddings`

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | Token | Lista licitações com filtros e paginação. |
| `GET` | `/{bidding_id}` | Token | Detalha uma licitação. |
| `POST` | `/` | Gerente de licitações | Cria licitação. |
| `PATCH` | `/{bidding_id}` | Gerente de licitações | Atualiza licitação. |
| `DELETE` | `/{bidding_id}` | Gerente de licitações | Exclui licitação e arquivos relacionados. |

Gerente de licitações: `suporte`, `admin` ou `editor`.

### GET `/biddings/`

Query params:

| Parâmetro | Tipo | Descrição |
| --- | --- | --- |
| `page` | inteiro | Página, padrão `1`. |
| `limit` | inteiro | Itens por página, de `1` a `100`. |
| `number` | inteiro | Número da licitação. |
| `year` | inteiro | Ano da licitação. |
| `department_id` | inteiro | Secretaria. |
| `category_id` | inteiro | Categoria. |
| `status` | texto | Status. |
| `search` | texto | Busca em objeto e descrição. |

### POST `/biddings/`

Entrada:

```json
{
  "department_id": 1,
  "category_id": 1,
  "number": 10,
  "year": 2026,
  "bidding_type": "Pregão Eletrônico",
  "status": "Aguardando Abertura",
  "classification": "Global",
  "object_name": "Aquisição de equipamentos",
  "object_description": "Descrição detalhada do objeto",
  "estimated_value": 15000.5,
  "publication_date": "2026-05-25",
  "opening_date": "2026-06-10"
}
```

O backend ignora `user_id` enviado no corpo e usa o ID do usuário autenticado.

Tipos aceitos pelo banco:

- `Pregão Eletrônico`
- `Concorrência Pública`
- `Chamada Pública`
- `Concorrência Presencial`
- `Credenciamento`
- `Dispensa Eletrônica`
- `Inexigibilidade`
- `Pregão Presencial`

Status aceitos:

- `Aguardando Abertura`
- `Aberto`
- `Em Andamento`
- `Suspenso`
- `Revogado`
- `Finalizado`

Classificações:

- `Global`
- `Item`
- `Lote`

## Attachments

Prefixo: `/attachments`

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| `POST` | `/{bidding_id}` | Gerente de licitações | Envia arquivo para uma licitação. |
| `GET` | `/{bidding_id}` | Pública na rota atual | Lista anexos da licitação. |
| `GET` | `/{attachment_id}/download` | Pública na rota atual | Baixa anexo. |
| `DELETE` | `/{attachment_id}` | Gerente de licitações | Remove anexo. |

Upload usa `multipart/form-data` com o campo:

```text
file
```

## Departments

Prefixo: `/departments`

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | Pública na rota atual | Lista secretarias. |
| `GET` | `/{department_id}` | Pública na rota atual | Detalha secretaria. |
| `POST` | `/` | Admin | Cria secretaria. |
| `PATCH` | `/{department_id}` | Admin | Atualiza secretaria. |
| `DELETE` | `/{department_id}` | Admin | Remove secretaria. |

Entrada de criação:

```json
{
  "sigla": "SEAD",
  "nome": "Secretaria Municipal de Administracao"
}
```

## Categories

Prefixo: `/categories`

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | Pública na rota atual | Lista categorias. |
| `GET` | `/{category_id}` | Pública na rota atual | Detalha categoria. |
| `POST` | `/` | Admin | Cria categoria. |
| `PATCH` | `/{category_id}` | Admin | Atualiza categoria. |
| `DELETE` | `/{category_id}` | Admin | Remove categoria. |

Entrada de criação:

```json
{
  "nome": "Por Item",
  "tipo": "Item"
}
```

## Dashboard

Prefixo: `/dashboard`

| Método | Rota | Proteção | Descrição |
| --- | --- | --- | --- |
| `GET` | `/summary` | Token | Retorna resumo do dashboard. |
| `GET` | `/latest-biddings` | Token | Retorna últimas licitações. |

## Códigos de erro comuns

| Código | Situação |
| --- | --- |
| `400` | Dados inválidos ou regra de negócio não atendida. |
| `401` | Token inválido, expirado ou credenciais incorretas. |
| `403` | Usuário sem permissão ou inativo. |
| `404` | Registro não encontrado. |
| `409` | Conflito, como e-mail ou usuário já existente. |
| `500` | Erro interno ou falha de conexão com banco. |
