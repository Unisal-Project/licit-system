def get_summary(cursor, user_id: int = None):
    where_clause = ""
    params = []

    if user_id is not None and user_id != 0:
        where_clause = "WHERE usuario_id = %s"
        params.append(user_id)

    sql = f"""
        SELECT
            COUNT(*) AS total,
            COALESCE(SUM(status = 'Aberto'), 0) AS open,
            COALESCE(SUM(status = 'Em Andamento'), 0) AS in_progress,
            COALESCE(SUM(status = 'Suspenso'), 0) AS suspended,
            COALESCE(SUM(status = 'Revogado'), 0) AS revoked,
            COALESCE(SUM(status = 'Finalizado'), 0) AS finished
        FROM licitacoes
        {where_clause}
    """

    cursor.execute(sql, params)
    return cursor.fetchone()


def get_latest_biddings(cursor, user_id: int = None):
    where_clause = ""
    params = []

    if user_id is not None and user_id != 0:
        where_clause = "WHERE l.usuario_id = %s"
        params.append(user_id)

    sql = f"""
        SELECT
            l.id,
            l.numero,
            l.ano,
            l.tipo,
            l.status,
            l.objeto,
            l.data_abertura,
            l.criado_em,
            s.nome AS secretaria,
            s.sigla AS secretaria_sigla
        FROM licitacoes l
        INNER JOIN secretarias s
            ON s.id = l.secretaria_id
        {where_clause}
        ORDER BY l.criado_em DESC
        LIMIT 10
    """

    cursor.execute(sql, params)
    return cursor.fetchall()