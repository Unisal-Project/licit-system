from fastapi import APIRouter
from app.service import category as category_service
from app.schema.category import CategoryCreate, CategoryUpdate

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

@router.get("/")
def get_all_categories():
    return category_service.list_categories()

@router.get("/{category_id}")
def get_category_by_id(category_id: int):
    return category_service.get_category_details(category_id)

@router.post("/")
def create_category(data: CategoryCreate):
    return category_service.create_category(data)

@router.patch("/{category_id}")
def update_category(category_id: int, data: CategoryUpdate):
    return category_service.update_category(category_id, data)

@router.delete("/{category_id}")
def delete_category(category_id: int):
    return category_service.delete_category(category_id)
