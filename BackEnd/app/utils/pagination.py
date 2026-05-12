def get_pagination(page: int = 1, limit: int = 10):
    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    if limit > 100:
        limit = 100

    offset = (page - 1) * limit

    return {
        "page": page,
        "limit": limit,
        "offset": offset
    }