def find_by_email(email: str, cursor):
    sql = "SELECT id, nome, email, senha, perfil, ativo FROM usuarios WHERE email = %s"
    cursor.execute(sql, (email,))
    return cursor.fetchone()

def update_last_login(user_id: int, cursor):
    sql = "UPDATE usuarios SET ultimo_login = NOW() WHERE id = %s"
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
        data.get("perfil", "fornecedor"),
        data.get("ativo", 1)
    )
    cursor.execute(sql, values)
    return cursor.lastrowid
