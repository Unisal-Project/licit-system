from fastapi import HTTPException

from app.core.database import get_connection
from app.repository import dashboard as dashboard_repository


def get_dashboard_summary():

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        return dashboard_repository.get_summary(cursor)

    except Exception as err:
        raise HTTPException(
            status_code=500,
            detail=str(err)
        )

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


def get_latest_biddings():

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        return dashboard_repository.get_latest_biddings(cursor)

    except Exception as err:
        raise HTTPException(
            status_code=500,
            detail=str(err)
        )

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()