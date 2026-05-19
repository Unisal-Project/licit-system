def find_all(cursor):
    sql = """
        SELECT
            id,
            sigla,
            nome
        FROM secretarias
        ORDER BY nome ASC
    """

    cursor.execute(sql)
    return cursor.fetchall()


def find_by_id(department_id: int, cursor):
    sql = """
        SELECT
            id,
            sigla,
            nome
        FROM secretarias
        WHERE id = %s
    """

    cursor.execute(sql, (department_id,))
    return cursor.fetchone()

def create(data, cursor):
    sql = "INSERT INTO secretarias (sigla, nome) VALUES (%s, %s)"
    cursor.execute(sql, (data.sigla, data.nome))
    return cursor.lastrowid

def update(department_id, fields, values, cursor):
    # Whitelist de campos permitidos
    ALLOWED_FIELDS = {"sigla", "nome"}
    
    # Validar campos
    for field in fields:
        if field not in ALLOWED_FIELDS:
            raise ValueError(f"Campo não permitido: {field}")
    
    # Construir SET clause com placeholders
    set_clause = ", ".join([f"{field} = %s" for field in fields])
    sql = f"UPDATE secretarias SET {set_clause} WHERE id = %s"
    cursor.execute(sql, values + [department_id])
    return cursor.rowcount

def delete(department_id, cursor):
    sql = "DELETE FROM secretarias WHERE id = %s"
    cursor.execute(sql, (department_id,))
    return cursor.rowcount