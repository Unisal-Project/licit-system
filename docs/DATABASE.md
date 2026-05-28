# Banco de Dados

O banco padrão do projeto é `licit_system`, usando MySQL 8.0 com charset `utf8mb4`.

O script principal está em:

```text
BackEnd/init-db/init.sql
```

No Docker Compose, esse diretório é montado em `/docker-entrypoint-initdb.d`, então o script roda automaticamente na primeira criação do volume do MySQL.

## Tabelas

### `usuarios`

Armazena usuários do sistema e usuários de acesso remoto.

Campos principais:

| Campo | Descrição |
| --- | --- |
| `id` | Identificador. |
| `nome` | Nome do usuário. |
| `email` | E-mail único. |
| `usuario_acesso` | Login alternativo para acesso remoto. |
| `senha` | Hash da senha. |
| `perfil` | `suporte`, `admin`, `editor` ou `visitante`. |
| `ativo` | Indica se o usuário pode autenticar. |
| `ultimo_login` | Último login. |
| `acesso_remoto` | Indica usuário de acesso remoto. |
| `acesso_expira_em` | Expiração do acesso remoto. |
| `acesso_permanente` | Acesso remoto permanente. |

O script inicial cria o usuário `suporte@licitsystem.local` com perfil `suporte`.

### `secretarias`

Cadastro de secretarias usadas nas licitações.

Campos:

- `id`
- `sigla`
- `nome`

O script inicial carrega secretarias padrão como `SEAD`, `GAB`, `SEGOV`, `SEDU`, `SEMUS` e outras.

### `categorias`

Classificações de licitação.

Campos:

- `id`
- `nome`
- `tipo`

Valores iniciais:

| ID | Nome | Tipo |
| --- | --- | --- |
| `1` | `Global` | `Global` |
| `2` | `Por Item` | `Item` |
| `3` | `Por Lote` | `Lote` |

### `licitacoes`

Tabela central de licitações.

Campos principais:

| Campo | Descrição |
| --- | --- |
| `id` | Identificador. |
| `usuario_id` | Usuário criador. |
| `secretaria_id` | Secretaria responsável. |
| `categoria_id` | Categoria/classificação. |
| `numero` | Número da licitação. |
| `ano` | Ano. |
| `tipo` | Modalidade. |
| `status` | Situação atual. |
| `classificacao` | `Global`, `Item` ou `Lote`. |
| `objeto` | Objeto resumido. |
| `descricao_objeto` | Descrição detalhada. |
| `valor_estimado` | Valor estimado. |
| `data_publicacao` | Data de publicação. |
| `data_abertura` | Data de abertura. |
| `criado_em` | Criação. |
| `atualizado_em` | Última atualização. |

Restrições:

- Chave única `numero`, `ano` e `tipo`.
- FK para `usuarios`.
- FK para `secretarias`.
- FK para `categorias`.

Tipos aceitos:

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

### `licitacao_logs`

Histórico de ações relacionadas às licitações.

Campos:

- `id`
- `licitacao_id`
- `usuario_id`
- `acao`
- `detalhes`
- `criado_em`

### `anexos`

Arquivos vinculados às licitações.

Campos:

| Campo | Descrição |
| --- | --- |
| `id` | Identificador. |
| `licitacao_id` | Licitação vinculada. |
| `nome` | Nome do arquivo. |
| `caminho` | Caminho no filesystem. |
| `tipo` | Extensão/tipo curto. |
| `categoria` | Categoria do anexo, padrão `documento`. |
| `tamanho_kb` | Tamanho em KB. |
| `criado_em` | Data de envio. |

A FK usa `ON DELETE CASCADE`, então anexos são removidos do banco quando a licitação é excluída.

### `convites`

Estrutura para tokens e credenciais de convite/acesso.

Campos:

- `id`
- `usuario_id`
- `token`
- `usuario_acesso`
- `senha_acesso`
- `perfil_acesso`
- `validade_dias`
- `usado`
- `criado_em`
- `expira_em`

### `password_reset_tokens`

Tokens de redefinição de senha.

Campos:

- `id`
- `usuario_id`
- `token_hash`
- `expira_em`
- `usado`
- `criado_em`
- `usado_em`

O token puro não é salvo; o sistema grava o hash SHA-256 em `token_hash`.

## Relacionamentos

```text
usuarios 1:N licitacoes
secretarias 1:N licitacoes
categorias 1:N licitacoes
licitacoes 1:N anexos
licitacoes 1:N licitacao_logs
usuarios 1:N licitacao_logs
usuarios 1:N convites
usuarios 1:N password_reset_tokens
```

## Recriação em desenvolvimento

Com Docker:

```bash
docker compose down -v
docker compose up --build
```

Sem Docker:

```bash
mysql -u root -p < BackEnd/init-db/init.sql
```

O comando com `down -v` remove o volume `mysql_data`, apagando os dados locais.
