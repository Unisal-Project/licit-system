import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException
from fastapi.responses import FileResponse
from app.core.database import get_connection, close_resources
from app.repository import attachment as attachment_repo

UPLOAD_DIR = "uploads/licitacoes"

def save_bidding_attachment(bidding_id: int, file: UploadFile):
    allowed_extensions = [".pdf", ".xlsx", ".xls", ".doc", ".docx"]
    file_ext = os.path.splitext(file.filename)[1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="File extension not allowed.")

    target_dir = os.path.join(UPLOAD_DIR, str(bidding_id))
    os.makedirs(target_dir, exist_ok=True)

    unique_name = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(target_dir, unique_name)

    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size_kb = os.path.getsize(file_path) // 1024

        attachment_data = {
            "licitacao_id": bidding_id,
            "nome": file.filename,
            "caminho": file_path,
            "tipo": file_ext.replace(".", ""),
            "categoria": "documento",
            "tamanho_kb": file_size_kb
        }
        
        attachment_id = attachment_repo.create_attachment(attachment_data, cursor)
        connection.commit()
        return {"id": attachment_id, "message": "Attachment uploaded successfully"}

    except Exception as e:
        if connection: connection.rollback()
        if os.path.exists(file_path): os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    finally:
        close_resources(cursor, connection)

def remove_attachment(attachment_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        attachment = attachment_repo.find_attachment_by_id(attachment_id, cursor)
        if not attachment:
            raise HTTPException(status_code=404, detail="Attachment not found.")

        if os.path.exists(attachment['caminho']):
            os.remove(attachment['caminho'])

        attachment_repo.delete_attachment(attachment_id, cursor)
        connection.commit()
        return {"message": "Attachment deleted successfully"}
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting attachment: {str(e)}")
    finally:
        close_resources(cursor, connection)

def get_attachment_file(attachment_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        attachment = attachment_repo.find_attachment_by_id(attachment_id, cursor)
        if not attachment or not os.path.exists(attachment['caminho']):
            raise HTTPException(status_code=404, detail="File not found.")

        return FileResponse(
            path=attachment['caminho'],
            filename=attachment['nome'],
            media_type='application/octet-stream'
        )
    finally:
        close_resources(cursor, connection)

def get_attachments_by_bidding(bidding_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        return attachment_repo.find_all_attachments_by_bidding_id(bidding_id, cursor)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)
