from app.schema.bidding import BiddingCreate


def _build_where_clause(filters: dict = None):
    """
    Função auxiliar para construir dinamicamente a cláusula WHERE
    """
    conditions = []
    params = []

    if not filters:
        return "", []

    # Mapeamento de filtros simples (chave_filtro: coluna_sql)
    mapping = {
        "number": "l.numero = %s",
        "year": "l.ano = %s",
        "department_id": "l.secretaria_id = %s",
        "category_id": "l.categoria_id = %s",
        "status": "l.status = %s"
    }

    for key, condition in mapping.items():
        if filters.get(key):
            conditions.append(condition)
            params.append(filters[key])

    if filters.get("search"):
        conditions.append("(l.objeto LIKE %s OR l.descricao_objeto LIKE %s)")
        search_val = f"%{filters['search']}%"
        params.extend([search_val, search_val])

    # Une todas as condições com AND se houver alguma
    where_sql = " AND " + " AND ".join(conditions) if conditions else ""
    return where_sql, params


def find_all(cursor, filters: dict = None, pagination: dict = None):
    where_sql, params = _build_where_clause(filters)

    sql = f"""
        SELECT
            l.id, l.numero, l.ano, l.tipo, l.status, l.classificacao,
            l.objeto, l.valor_estimado, l.data_publicacao, l.data_abertura,
            l.criado_em, l.atualizado_em,
            s.nome AS secretaria, s.sigla AS secretaria_sigla,
            c.nome AS categoria, c.tipo AS categoria_tipo
        FROM licitacoes l
        INNER JOIN secretarias s ON s.id = l.secretaria_id
        INNER JOIN categorias c ON c.id = l.categoria_id
        WHERE 1=1 {where_sql}
        ORDER BY l.id DESC
    """

    if pagination:
        sql += " LIMIT %s OFFSET %s"
        params.extend([pagination["limit"], pagination["offset"]])

    cursor.execute(sql, params)
    return cursor.fetchall()


def count_all(cursor, filters: dict = None):
    where_sql, params = _build_where_clause(filters)

    sql = f"SELECT COUNT(*) as total FROM licitacoes l WHERE 1=1 {where_sql}"

    cursor.execute(sql, params)
    result = cursor.fetchone()
    return result["total"] if result else 0


def find_by_id(bidding_id: int, cursor):
    sql = """
          SELECT l.id, \
                 l.usuario_id, \
                 l.secretaria_id, \
                 l.categoria_id, \
                 l.numero, \
                 l.ano, \
                 l.tipo, \
                 l.status, \
                 l.classificacao, \
                 l.objeto, \
                 l.descricao_objeto, \
                 l.valor_estimado, \
                 l.data_publicacao, \
                 l.data_abertura, \
                 l.criado_em, \
                 l.atualizado_em, \
                 s.nome  AS secretaria, \
                 s.sigla AS secretaria_sigla, \
                 c.nome  AS categoria, \
                 c.tipo  AS categoria_tipo
          FROM licitacoes l
                   INNER JOIN secretarias s ON s.id = l.secretaria_id
                   INNER JOIN categorias c ON c.id = l.categoria_id
          WHERE l.id = %s \
          """
    cursor.execute(sql, (bidding_id,))
    return cursor.fetchone()


def create(data: BiddingCreate, cursor):
    sql = """
          INSERT INTO licitacoes (usuario_id, secretaria_id, categoria_id, numero, ano, \
                                  tipo, status, classificacao, objeto, descricao_objeto, \
                                  valor_estimado, data_publicacao, data_abertura)
          VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) \
          """
    values = (
        data.user_id, data.department_id, data.category_id, data.number,
        data.year, data.bidding_type, data.status, data.classification,
        data.object_name, data.object_description, data.estimated_value,
        data.publication_date, data.opening_date,
    )
    cursor.execute(sql, values)
    return cursor.lastrowid


def update(bidding_id: int, fields: list[str], values: list, cursor):
    # fields deve ser uma lista de strings formatadas como "coluna = %s"
    sql = f"""
        UPDATE licitacoes
        SET {", ".join(fields)}
        WHERE id = %s
    """
    params = values + [bidding_id]
    cursor.execute(sql, params)
    return cursor.rowcount


def delete(bidding_id: int, cursor):
    sql = "DELETE FROM licitacoes WHERE id = %s"
    cursor.execute(sql, (bidding_id,))
    return cursor.rowcount