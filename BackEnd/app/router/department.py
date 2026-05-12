from fastapi import APIRouter
from app.service import department as department_service
from app.schema.department import DepartmentCreate, DepartmentUpdate

router = APIRouter(
    prefix="/departments",
    tags=["Departments"]
)

@router.get("/")
def get_all_departments():
    return department_service.list_departments()

@router.get("/{department_id}")
def get_department_by_id(department_id: int):
    return department_service.get_department_details(department_id)

@router.post("/")
def create_department(data: DepartmentCreate):
    return department_service.create_department(data)

@router.patch("/{department_id}")
def update_department(department_id: int, data: DepartmentUpdate):
    return department_service.update_department(department_id, data)

@router.delete("/{department_id}")
def delete_department(department_id: int):
    return department_service.delete_department(department_id)
