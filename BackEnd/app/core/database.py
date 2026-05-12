import mysql.connector
from mysql.connector import Error
from app.core.config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

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
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None

def close_resources(cursor=None, connection=None):
    if cursor:
        try:
            cursor.close()
        except Exeception:
            pass
    if connection:
        try:
            connection.close()
        except Exeception:
            pass
