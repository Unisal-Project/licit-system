import os
import shutil
from fastapi import HTTPException
from app.core.database import get_connection, close_resources
from app.repository import bidding as bidding_repo
from app.repository import attachment as attachment_repo
from app.schema.bidding import BiddingCreate, BiddingUpdate

def list_all_biddings(filters: dict = None, pagination: dict = None):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        items = bidding_repo.find_all(cursor, filters, pagination)
        total = bidding_repo.count_all(cursor, filters)
        
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

def get_bidding_details(bidding_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        bidding = bidding_repo.find_by_id(bidding_id, cursor)
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
        bidding_id = bidding_repo.create(data, cursor)
        connection.commit()
        return {"message": "Bidding created successfully", "bidding_id": bidding_id}
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def update_existing_bidding(bidding_id: int, data: BiddingUpdate):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        bidding = bidding_repo.find_by_id(bidding_id, cursor)
        if not bidding:
            raise HTTPException(status_code=404, detail="Bidding not found")

        data_dict = data.model_dump(exclude_unset=True)
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

        bidding_repo.update(bidding_id, fields, values, cursor)
        connection.commit()
        return bidding_repo.find_by_id(bidding_id, cursor)
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def delete_bidding_and_files(bidding_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        bidding = bidding_repo.find_by_id(bidding_id, cursor)
        if not bidding:
            raise HTTPException(status_code=404, detail="Bidding not found")

        # Deleta anexos do banco primeiro (se não houver CASCADE)
        attachment_repo.delete_attachments_by_bidding_id(bidding_id, cursor)
        
        # Deleta licitação
        bidding_repo.delete(bidding_id, cursor)
        connection.commit()

        # Limpeza física
        upload_dir = "uploads/licitacoes"
        bidding_folder = os.path.join(upload_dir, str(bidding_id))
        if os.path.exists(bidding_folder):
            shutil.rmtree(bidding_folder)

        return {"message": f"Bidding {bidding_id} and its files deleted successfully"}
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    finally:
        close_resources(cursor, connection)
