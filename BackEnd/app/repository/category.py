def find_all(cursor):
    sql = """
        SELECT
            id,
            nome,
            tipo
        FROM categorias
        ORDER BY nome ASC
    """

    cursor.execute(sql)
    return cursor.fetchall()


def find_by_id(category_id: int, cursor):
    sql = """
        SELECT
            id,
            nome,
            tipo
        FROM categorias
        WHERE id = %s
    """

    cursor.execute(sql, (category_id,))
    return cursor.fetchone()

def create(data, cursor):
    sql = "INSERT INTO categorias (nome, tipo) VALUES (%s, %s)"
    cursor.execute(sql, (data.nome, data.tipo))
    return cursor.lastrowid

def update(category_id, fields, values, cursor):
    sql = f"UPDATE categorias SET {', '.join(fields)} WHERE id = %s"
    cursor.execute(sql, values + [category_id])
    return cursor.rowcount

def delete(category_id, cursor):
    sql = "DELETE FROM categorias WHERE id = %s"
    cursor.execute(sql, (category_id,))
    return cursor.rowcount