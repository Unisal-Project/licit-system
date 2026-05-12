from app.repository import category as category_repo
from app.core.database import get_connection, close_resources
from fastapi import HTTPException
from app.schema.category import CategoryCreate, CategoryUpdate

def list_categories():
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        return category_repo.find_all(cursor)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing categories: {str(e)}")
    finally:
        close_resources(cursor, connection)

def get_category_details(category_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        category = category_repo.find_by_id(category_id, cursor)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving category: {str(e)}")
    finally:
        close_resources(cursor, connection)

def create_category(data: CategoryCreate):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        category_id = category_repo.create(data, cursor)
        connection.commit()
        return {"id": category_id, "message": "Category created successfully"}
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def update_category(category_id: int, data: CategoryUpdate):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        category = category_repo.find_by_id(category_id, cursor)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        data_dict = data.model_dump(exclude_unset=True)
        if not data_dict:
            raise HTTPException(status_code=400, detail="No fields to update")

        fields = [f"{k} = %s" for k in data_dict.keys()]
        values = list(data_dict.values())

        category_repo.update(category_id, fields, values, cursor)
        connection.commit()
        return {"message": "Category updated successfully"}
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def delete_category(category_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        category = category_repo.find_by_id(category_id, cursor)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        category_repo.delete(category_id, cursor)
        connection.commit()
        return {"message": "Category deleted successfully"}
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)
