import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException
from fastapi.responses import FileResponse
from app.core.database import get_connection, close_resources
from app.repository import attachment as attachment_repo
from app.repository import bidding as bidding_repo

UPLOAD_DIR = "uploads/licitacoes"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def save_bidding_attachment(bidding_id: int, file: UploadFile, user_id: int = None):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        # Verifica se o usuário é dono da licitação
        filter_user_id = user_id if user_id != 0 else None
        bidding = bidding_repo.find_by_id(bidding_id, cursor, user_id=filter_user_id)
        if not bidding:
            raise HTTPException(status_code=404, detail="Licitação não encontrada ou acesso negado")

        allowed_extensions = [".pdf", ".xlsx", ".xls", ".doc", ".docx"]
        file_ext = os.path.splitext(file.filename)[1].lower()

        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Extensão de arquivo não permitida.")

        if file.size and file.size > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Arquivo muito grande (máximo 10MB)")

        target_dir = os.path.join(UPLOAD_DIR, str(bidding_id))
        os.makedirs(target_dir, exist_ok=True)

        unique_name = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(target_dir, unique_name)
        
        normalized_path = os.path.normpath(os.path.abspath(file_path))
        
        with open(normalized_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size_kb = os.path.getsize(normalized_path) // 1024
        relative_path = f"licitacoes/{bidding_id}/{unique_name}"

        attachment_data = {
            "licitacao_id": bidding_id,
            "nome": file.filename,
            "caminho": relative_path,
            "tipo": file_ext.replace(".", ""),
            "categoria": "documento",
            "tamanho_kb": file_size_kb
        }
        
        attachment_id = attachment_repo.create_attachment(attachment_data, cursor)
        connection.commit()
        return {"id": attachment_id, "message": "Anexo enviado com sucesso"}

    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao salvar arquivo: {str(e)}")
    finally:
        close_resources(cursor, connection)

def remove_attachment(attachment_id: int, user_id: int = None):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        attachment = attachment_repo.find_attachment_by_id(attachment_id, cursor)
        if not attachment:
            raise HTTPException(status_code=404, detail="Anexo não encontrado")

        # Verifica se o usuário é dono da licitação vinculada ao anexo
        filter_user_id = user_id if user_id != 0 else None
        bidding = bidding_repo.find_by_id(attachment["licitacao_id"], cursor, user_id=filter_user_id)
        if not bidding:
            raise HTTPException(status_code=403, detail="Acesso negado")

        # Deleta arquivo físico (opcional: você pode querer manter ou gerenciar caminhos relativos/absolutos melhor)
        # Aqui assumimos que attachment['caminho'] é relativo a uploads/
        full_path = os.path.join("uploads", attachment['caminho'])
        if os.path.exists(full_path):
            os.remove(full_path)

        attachment_repo.delete_attachment(attachment_id, cursor)
        connection.commit()
        return {"message": "Anexo removido com sucesso"}
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao deletar anexo: {str(e)}")
    finally:
        close_resources(cursor, connection)

def get_attachment_file(attachment_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        attachment = attachment_repo.find_attachment_by_id(attachment_id, cursor)
        full_path = os.path.join("uploads", attachment['caminho']) if attachment else ""
        if not attachment or not os.path.exists(full_path):
            raise HTTPException(status_code=404, detail="Arquivo não encontrado")

        return FileResponse(
            path=full_path,
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
