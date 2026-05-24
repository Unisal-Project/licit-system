import os
import shutil
from datetime import date
from fastapi import HTTPException
from mysql.connector import Error
from app.core.database import get_connection, close_resources
from app.repository import bidding as bidding_repo
from app.repository import attachment as attachment_repo
from app.schema.bidding import BiddingCreate, BiddingUpdate, GetAllBiddings
from app.utils.pagination import get_pagination

AUTOMATIC_STATUSES = {"Aguardando Abertura", "Aberto", None, ""}


def _get_date_based_status(opening_date, current_status=None):
    if current_status not in AUTOMATIC_STATUSES:
        return current_status

    if opening_date and opening_date > date.today():
        return "Aguardando Abertura"

    return "Aberto"


def _raise_duplicate_bidding_error(error):
    if isinstance(error, Error) and error.errno == 1062:
        raise HTTPException(
            status_code=409,
            detail="Já existe uma licitação com este número, ano e tipo."
        )


def list_all_biddings(data: GetAllBiddings, user_id: int = None):

    filters = {
        "number": data.number,
        "year": data.year,
        "department_id": data.department_id,
        "category_id": data.category_id,
        "status": data.status,
        "search": data.search
    }

    pagination = get_pagination(data.page, data.limit)

    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        # Se for um visitante (ID 0), não filtramos por usuário para ele ver o sistema
        filter_user_id = user_id if user_id != 0 else None
        
        items = bidding_repo.find_all(cursor, filters, pagination, user_id=filter_user_id)
        total = bidding_repo.count_all(cursor, filters, user_id=filter_user_id)
        
        return {
            "items": items,
            "total": total,
            "page": pagination["page"] if pagination else 1,
            "limit": pagination["limit"] if pagination else total
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def get_bidding_details(bidding_id: int, user_id: int = None):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        filter_user_id = user_id if user_id != 0 else None
        bidding = bidding_repo.find_by_id(bidding_id, cursor, user_id=filter_user_id)
        if not bidding:
            raise HTTPException(status_code=404, detail="Bidding not found")

        bidding["attachments"] = attachment_repo.find_all_attachments_by_bidding_id(bidding_id, cursor)
        return bidding
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def create_new_bidding(data: BiddingCreate):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        bidding_repo.ensure_status_enum_supports_waiting(cursor)
        bidding_repo.ensure_unique_constraint_includes_type(cursor)

        bidding_repo.ensure_user_exists(data.user_id, cursor)

        data.status = _get_date_based_status(data.opening_date, data.status)

        bidding_id = bidding_repo.create(data, cursor)
        connection.commit()

        return {"message": "Bidding created successfully", "bidding_id": bidding_id}

    except Exception as e:
        if connection: connection.rollback()
        _raise_duplicate_bidding_error(e)
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        close_resources(cursor, connection)

def update_existing_bidding(bidding_id: int, data: BiddingUpdate, user_id: int = None):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        bidding_repo.ensure_status_enum_supports_waiting(cursor)
        bidding_repo.ensure_unique_constraint_includes_type(cursor)
        
        filter_user_id = user_id if user_id != 0 else None
        bidding = bidding_repo.find_by_id(bidding_id, cursor, user_id=filter_user_id)
        if not bidding:
            raise HTTPException(status_code=404, detail="Bidding not found")

        data_dict = data.model_dump(exclude_unset=True)
        opening_date = data_dict.get("opening_date", bidding.get("data_abertura"))
        current_status = data_dict.get("status", bidding.get("status"))

        if current_status in AUTOMATIC_STATUSES:
            data_dict["status"] = _get_date_based_status(opening_date, current_status)

        field_mapping = {
            "department_id": "secretaria_id",
            "category_id": "categoria_id",
            "number": "numero",
            "year": "ano",
            "bidding_type": "tipo",
            "status": "status",
            "classification": "classificacao",
            "object_name": "objeto",
            "object_description": "descricao_objeto",
            "estimated_value": "valor_estimado",
            "publication_date": "data_publicacao",
            "opening_date": "data_abertura",
        }

        fields = []
        values = []
        for field_name, field_value in data_dict.items():
            column_name = field_mapping.get(field_name)
            if column_name:
                fields.append(f"{column_name} = %s")
                values.append(field_value)

        if not fields:
            raise HTTPException(status_code=400, detail="No valid fields to update")

        bidding_repo.update(bidding_id, fields, values, cursor, user_id=filter_user_id)
        connection.commit()
        return bidding_repo.find_by_id(bidding_id, cursor, user_id=filter_user_id)
    except HTTPException:
        if connection:
            connection.rollback()
        raise
    except Exception as e:
        if connection:
            connection.rollback()
        _raise_duplicate_bidding_error(e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def delete_bidding_and_files(bidding_id: int, user_id: int = None):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        filter_user_id = user_id if user_id != 0 else None
        bidding = bidding_repo.find_by_id(bidding_id, cursor, user_id=filter_user_id)
        if not bidding:
            raise HTTPException(status_code=404, detail="Bidding not found")

        # Deleta anexos do banco primeiro (se não houver CASCADE)
        attachment_repo.delete_attachments_by_bidding_id(bidding_id, cursor)
        
        # Deleta licitação
        bidding_repo.delete(bidding_id, cursor, user_id=filter_user_id)
        
        # COMMIT bem-sucedido do banco ANTES de deletar arquivos físicos
        connection.commit()

        # Agora sim, limpeza física (após commit bem-sucedido)
        upload_dir = "uploads/licitacoes"
        bidding_folder = os.path.join(upload_dir, str(bidding_id))
        try:
            if os.path.exists(bidding_folder):
                shutil.rmtree(bidding_folder)
        except Exception as file_error:
            # Log do erro mas não falha a operação (banco já foi deletado com sucesso)
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Erro ao deletar arquivos da licitação {bidding_id}: {file_error}")

        return {"message": f"Bidding {bidding_id} and its files deleted successfully"}
    except HTTPException:
        if connection:
            connection.rollback()
        raise
    except Exception as e:
        if connection:
            connection.rollback()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    finally:
        close_resources(cursor, connection)
