def find_by_email(email: str, cursor):
    sql = """
        SELECT id, nome, email, usuario_acesso, senha, perfil, ativo, acesso_expira_em, acesso_permanente
        FROM usuarios
        WHERE email = %s
    """
    cursor.execute(sql, (email,))
    return cursor.fetchone()

def find_by_login(login: str, cursor):
    sql = """
        SELECT id, nome, email, usuario_acesso, senha, perfil, ativo, acesso_expira_em, acesso_permanente
        FROM usuarios
        WHERE email = %s OR usuario_acesso = %s
    """
    cursor.execute(sql, (login, login))
    return cursor.fetchone()

def find_by_id(user_id: int, cursor):
    sql = "SELECT id, nome, email, usuario_acesso, perfil, ativo, criado_em, ultimo_login, acesso_expira_em, acesso_permanente FROM usuarios WHERE id = %s"
    cursor.execute(sql, (user_id,))
    return cursor.fetchone()

def find_credentials_by_id(user_id: int, cursor):
    sql = """
        SELECT id, senha, ativo
        FROM usuarios
        WHERE id = %s
    """
    cursor.execute(sql, (user_id,))
    return cursor.fetchone()

def list_all(cursor, include_support: bool = False):
    sql = """
        SELECT id, nome, email, perfil, ativo, criado_em, ultimo_login
        FROM usuarios
    """
    params = []

    if not include_support:
        sql += " WHERE perfil <> %s"
        params.append("suporte")

    sql += " ORDER BY nome ASC"
    cursor.execute(sql, tuple(params))
    return cursor.fetchall()

def update_last_login(user_id: int, cursor):
    sql = "UPDATE usuarios SET ultimo_login = NOW() WHERE id = %s"
    cursor.execute(sql, (user_id,))

def update_password(user_id: int, password_hash: str, cursor):
    sql = "UPDATE usuarios SET senha = %s WHERE id = %s"
    cursor.execute(sql, (password_hash, user_id))

def ensure_remote_access_columns(cursor):
    columns = {
        "usuario_acesso": "ALTER TABLE usuarios ADD COLUMN usuario_acesso varchar(100) DEFAULT NULL AFTER email",
        "acesso_remoto": "ALTER TABLE usuarios ADD COLUMN acesso_remoto tinyint(1) NOT NULL DEFAULT 0 AFTER ativo",
        "acesso_expira_em": "ALTER TABLE usuarios ADD COLUMN acesso_expira_em datetime DEFAULT NULL AFTER acesso_remoto",
        "acesso_permanente": "ALTER TABLE usuarios ADD COLUMN acesso_permanente tinyint(1) NOT NULL DEFAULT 0 AFTER acesso_expira_em",
    }

    cursor.execute(
        """
        SELECT COLUMN_NAME
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'usuarios'
        """
    )
    existing_columns = {row["COLUMN_NAME"] for row in cursor.fetchall()}

    for column_name, alter_sql in columns.items():
        if column_name not in existing_columns:
            cursor.execute(alter_sql)

    cursor.execute(
        """
        SELECT COUNT(*) AS total
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'usuarios'
          AND INDEX_NAME = 'uq_usuario_acesso'
        """
    )
    if cursor.fetchone()["total"] == 0:
        cursor.execute("ALTER TABLE usuarios ADD UNIQUE KEY uq_usuario_acesso (usuario_acesso)")

def create_remote_access_user(data: dict, cursor):
    sql = """
        INSERT INTO usuarios (
            nome, email, usuario_acesso, senha, perfil, ativo,
            acesso_remoto, acesso_expira_em, acesso_permanente
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        data["nome"],
        data["email"],
        data["usuario_acesso"],
        data["senha"],
        data["perfil"],
        data.get("ativo", 1),
        1,
        data.get("acesso_expira_em"),
        data.get("acesso_permanente", 0),
    )
    cursor.execute(sql, values)
    return cursor.lastrowid

def ensure_password_reset_table(cursor):
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT NOT NULL AUTO_INCREMENT,
            usuario_id INT NOT NULL,
            token_hash VARCHAR(64) NOT NULL,
            expira_em DATETIME NOT NULL,
            usado TINYINT(1) NOT NULL DEFAULT 0,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            usado_em DATETIME DEFAULT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY uq_password_reset_token_hash (token_hash),
            KEY idx_password_reset_usuario_id (usuario_id),
            CONSTRAINT password_reset_tokens_usuario_fk
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                ON DELETE CASCADE
        )
        """
    )

def create_password_reset_token(user_id: int, token_hash: str, expires_at, cursor):
    sql = """
        INSERT INTO password_reset_tokens (usuario_id, token_hash, expira_em)
        VALUES (%s, %s, %s)
    """
    cursor.execute(sql, (user_id, token_hash, expires_at))

def find_valid_password_reset_token(token_hash: str, cursor):
    sql = """
        SELECT id, usuario_id
        FROM password_reset_tokens
        WHERE token_hash = %s
          AND usado = 0
          AND expira_em > UTC_TIMESTAMP()
    """
    cursor.execute(sql, (token_hash,))
    return cursor.fetchone()

def mark_password_reset_token_used(token_id: int, cursor):
    sql = "UPDATE password_reset_tokens SET usado = 1, usado_em = UTC_TIMESTAMP() WHERE id = %s"
    cursor.execute(sql, (token_id,))

def update_role(user_id: int, perfil: str, cursor):
    sql = "UPDATE usuarios SET perfil = %s WHERE id = %s"
    cursor.execute(sql, (perfil, user_id))

def delete(user_id: int, cursor):
    sql = "DELETE FROM usuarios WHERE id = %s"
    cursor.execute(sql, (user_id,))

def deactivate(user_id: int, cursor):
    sql = "UPDATE usuarios SET ativo = 0 WHERE id = %s"
    cursor.execute(sql, (user_id,))

def create(data: dict, cursor):
    sql = """
        INSERT INTO usuarios (nome, email, senha, perfil, ativo)
        VALUES (%s, %s, %s, %s, %s)
    """
    values = (
        data["nome"],
        data["email"],
        data["senha"],
        data.get("perfil", "visitante"),
        data.get("ativo", 1)
    )
    cursor.execute(sql, values)
    return cursor.lastrowid
