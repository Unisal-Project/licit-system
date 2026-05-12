def find_all_attachments_by_bidding_id(bidding_id: int, cursor):
    query = "SELECT * FROM anexos WHERE licitacao_id = %s"
    cursor.execute(query, (bidding_id,))
    return cursor.fetchall()

def find_attachment_by_id(attachment_id: int, cursor):
    query = "SELECT * FROM anexos WHERE id = %s"
    cursor.execute(query, (attachment_id,))
    return cursor.fetchone()

def create_attachment(data: dict, cursor):
    query = """
        INSERT INTO anexos (licitacao_id, nome, caminho, tipo, categoria, tamanho_kb)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    values = (
        data['licitacao_id'], data['nome'], data['caminho'],
        data.get('tipo'), data.get('categoria', 'documento'),
        data.get('tamanho_kb')
    )
    cursor.execute(query, values)
    return cursor.lastrowid

def delete_attachment(attachment_id: int, cursor):
    query = "DELETE FROM anexos WHERE id = %s"
    cursor.execute(query, (attachment_id,))
    return cursor.rowcount > 0

def delete_attachments_by_bidding_id(bidding_id: int, cursor):
    query = "DELETE FROM anexos WHERE licitacao_id = %s"
    cursor.execute(query, (bidding_id,))
    return cursor.rowcount
