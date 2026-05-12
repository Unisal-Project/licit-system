from app.repository import department as department_repo
from app.core.database import get_connection, close_resources
from fastapi import HTTPException
from app.schema.department import DepartmentCreate, DepartmentUpdate

def list_departments():
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        return department_repo.find_all(cursor)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing departments: {str(e)}")
    finally:
        close_resources(cursor, connection)

def get_department_details(department_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        department = department_repo.find_by_id(department_id, cursor)
        if not department:
            raise HTTPException(status_code=404, detail="Department not found")
        return department
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving department: {str(e)}")
    finally:
        close_resources(cursor, connection)

def create_department(data: DepartmentCreate):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        department_id = department_repo.create(data, cursor)
        connection.commit()
        return {"id": department_id, "message": "Department created successfully"}
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def update_department(department_id: int, data: DepartmentUpdate):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        department = department_repo.find_by_id(department_id, cursor)
        if not department:
            raise HTTPException(status_code=404, detail="Department not found")

        data_dict = data.model_dump(exclude_unset=True)
        if not data_dict:
            raise HTTPException(status_code=400, detail="No fields to update")

        fields = [f"{k} = %s" for k in data_dict.keys()]
        values = list(data_dict.values())

        department_repo.update(department_id, fields, values, cursor)
        connection.commit()
        return {"message": "Department updated successfully"}
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def delete_department(department_id: int):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        department = department_repo.find_by_id(department_id, cursor)
        if not department:
            raise HTTPException(status_code=404, detail="Department not found")

        department_repo.delete(department_id, cursor)
        connection.commit()
        return {"message": "Department deleted successfully"}
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)
