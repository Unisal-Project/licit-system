<div align="center">

# 🗄️ LicitSys Database

### Estrutura do Banco de Dados do Sistema de Gestão de Licitações

[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)]()
[![UTF8MB4](https://img.shields.io/badge/Charset-utf8mb4-blue?style=flat-square)]()
[![Docker](https://img.shields.io/badge/Docker-Compatible-2496ED?style=flat-square&logo=docker&logoColor=white)]()

<br>

> Documentação da estrutura do banco de dados do LicitSys,
> incluindo tabelas, relacionamentos e regras de negócio.

</div>

---

# 📋 Sumário

- [Visão Geral](#visão-geral)
- [Inicialização do Banco](#inicialização-do-banco)
- [Modelo Relacional](#modelo-relacional)
- [Tabelas](#tabelas)
  - [Usuários](#usuários)
  - [Secretarias](#secretarias)
  - [Categorias](#categorias)
  - [Licitações](#licitações)
  - [Logs de Licitação](#logs-de-licitação)
  - [Anexos](#anexos)
  - [Convites](#convites)
  - [Tokens de Recuperação](#tokens-de-recuperação)
- [Relacionamentos](#relacionamentos)
- [Recriação do Banco](#recriação-do-banco)

---

# Visão Geral

O banco de dados do LicitSys utiliza:

```text
MySQL 8.0
Charset: utf8mb4
Collation: utf8mb4_unicode_ci
```

Banco padrão:

```text
licit_system
```

O objetivo da modelagem é centralizar todas as informações relacionadas ao gerenciamento de licitações públicas, usuários, documentos e auditoria do sistema.

---

# Inicialização do Banco

O script principal encontra-se em:

```text
BackEnd/init-db/init.sql
```

Durante a execução via Docker Compose, o script é carregado automaticamente através do diretório:

```text
/docker-entrypoint-initdb.d
```

A inicialização ocorre apenas na primeira criação do volume do MySQL.

---

# Modelo Relacional

```text
usuarios
    │
    ├── licitacoes
    │       │
    │       ├── anexos
    │       │
    │       └── licitacao_logs
    │
    ├── convites
    │
    └── password_reset_tokens

secretarias
      │
      └── licitacoes

categorias
      │
      └── licitacoes
```

---

# Tabelas

# Usuários

Tabela responsável pelo controle de autenticação e autorização do sistema.

```sql
usuarios
```

## Principais Campos

| Campo | Descrição |
|---------|------------|
| id | Identificador único |
| nome | Nome completo |
| email | E-mail único |
| usuario_acesso | Login alternativo |
| senha | Hash BCrypt |
| perfil | Nível de acesso |
| ativo | Status do usuário |
| ultimo_login | Último acesso |
| acesso_remoto | Indica acesso remoto |
| acesso_expira_em | Data de expiração |
| acesso_permanente | Controle de validade |

## Perfis

```text
suporte
admin
editor
visitante
```

## Usuário Inicial

```text
suporte@licitsystem.local
```

Perfil:

```text
suporte
```

---

# Secretarias

Representa os órgãos responsáveis pelas licitações.

```sql
secretarias
```

## Campos

| Campo |
|---------|
| id |
| sigla |
| nome |

## Registros Iniciais

```text
SEAD
GAB
SEGOV
SEDU
SEMUS
```

entre outras secretarias cadastradas no script inicial.

---

# Categorias

Classificações utilizadas pelas licitações.

```sql
categorias
```

## Campos

| Campo |
|---------|
| id |
| nome |
| tipo |

## Dados Iniciais

| ID | Nome | Tipo |
|----|--------|--------|
| 1 | Global | Global |
| 2 | Por Item | Item |
| 3 | Por Lote | Lote |

---

# Licitações

Tabela principal do sistema.

```sql
licitacoes
```

## Principais Campos

| Campo | Descrição |
|---------|------------|
| id | Identificador |
| usuario_id | Criador |
| secretaria_id | Secretaria responsável |
| categoria_id | Categoria |
| numero | Número da licitação |
| ano | Ano |
| tipo | Modalidade |
| status | Situação atual |
| classificacao | Tipo de classificação |
| objeto | Resumo |
| descricao_objeto | Descrição completa |
| valor_estimado | Valor previsto |
| data_publicacao | Data de publicação |
| data_abertura | Data de abertura |
| criado_em | Data de criação |
| atualizado_em | Última alteração |

---

## Restrições

### Chave Única

```sql
(numero, ano, tipo)
```

Evita duplicidade de processos.

### Chaves Estrangeiras

```text
usuario_id → usuarios.id
secretaria_id → secretarias.id
categoria_id → categorias.id
```

---

## Modalidades Aceitas

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

## Status Aceitos

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

# Logs de Licitação

Responsável pela auditoria do sistema.

```sql
licitacao_logs
```

## Campos

| Campo |
|---------|
| id |
| licitacao_id |
| usuario_id |
| acao |
| detalhes |
| criado_em |

## Objetivo

Registrar:

- Criações
- Alterações
- Exclusões
- Mudanças de status
- Ações administrativas

---

# Anexos

Arquivos vinculados aos processos licitatórios.

```sql
anexos
```

## Campos

| Campo | Descrição |
|---------|------------|
| id | Identificador |
| licitacao_id | Licitação vinculada |
| nome | Nome do arquivo |
| caminho | Local de armazenamento |
| tipo | Extensão |
| categoria | Categoria documental |
| tamanho_kb | Tamanho |
| criado_em | Data de upload |

---

## Exclusão em Cascata

```sql
ON DELETE CASCADE
```

Ao excluir uma licitação, todos os anexos relacionados são removidos automaticamente.

---

# Convites

Estrutura responsável pelos acessos temporários e remotos.

```sql
convites
```

## Campos

| Campo |
|---------|
| id |
| usuario_id |
| token |
| usuario_acesso |
| senha_acesso |
| perfil_acesso |
| validade_dias |
| usado |
| criado_em |
| expira_em |

---

# Tokens de Recuperação

Controle de redefinição de senha.

```sql
password_reset_tokens
```

## Campos

| Campo |
|---------|
| id |
| usuario_id |
| token_hash |
| expira_em |
| usado |
| criado_em |
| usado_em |

---

## Segurança

Os tokens não são armazenados em texto puro.

O sistema salva apenas:

```text
SHA-256(token)
```

através do campo:

```text
token_hash
```

---

# Relacionamentos

```text
usuarios                 1:N licitacoes

secretarias              1:N licitacoes

categorias               1:N licitacoes

licitacoes               1:N anexos

licitacoes               1:N licitacao_logs

usuarios                 1:N licitacao_logs

usuarios                 1:N convites

usuarios                 1:N password_reset_tokens
```

---

# Recriação do Banco

## Docker

```bash
docker compose down -v

docker compose up --build
```

⚠️ Atenção:

```text
down -v remove completamente o volume mysql_data
e todos os dados armazenados localmente.
```

---

## Ambiente Local

```bash
mysql -u root -p < BackEnd/init-db/init.sql
```

---

<div align="center">

### 🗄️ LicitSys Database

Modelagem desenvolvida para garantir integridade, rastreabilidade e segurança no gerenciamento de licitações públicas.

</div>