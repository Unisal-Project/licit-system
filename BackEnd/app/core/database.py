import mysql.connector
from mysql.connector import Error
import logging
from app.core.config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

logger = logging.getLogger(__name__)

def get_connection():
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT
        )
        if connection.is_connected():
            return connection
    except Error as e:
        logger.error(f"error connecting reason: {e}", exc_info=True)
        return None

def close_resources(cursor=None, connection=None):
    if cursor:
        try:
            cursor.close()
        except Exception:
            pass
    if connection:
        try:
            connection.close()
        except Exception:
            pass
