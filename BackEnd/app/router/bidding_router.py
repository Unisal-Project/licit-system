from fastapi import APIRouter, Query, Depends
from typing import Optional
from app.schema.bidding import BiddingCreate, BiddingUpdate
from app.service import bidding as bidding_service
from app.utils.pagination import get_pagination

router = APIRouter(
    prefix="/biddings",
    tags=["Biddings"]
)

@router.get("/")
def get_all_biddings(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    number: Optional[int] = None,
    year: Optional[int] = None,
    department_id: Optional[int] = None,
    category_id: Optional[int] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    pagination = get_pagination(page, limit)
    filters = {
        "number": number,
        "year": year,
        "department_id": department_id,
        "category_id": category_id,
        "status": status,
        "search": search
    }
    return bidding_service.list_all_biddings(filters, pagination)

@router.get("/{bidding_id}")
def get_bidding_by_id(bidding_id: int):
    return bidding_service.get_bidding_details(bidding_id)

@router.post("/")
def create_bidding(data: BiddingCreate):
    return bidding_service.create_new_bidding(data)

@router.patch("/{bidding_id}")
def update_bidding(bidding_id: int, data: BiddingUpdate):
    return bidding_service.update_existing_bidding(bidding_id, data)

@router.delete("/{bidding_id}")
def delete_bidding(bidding_id: int):
    return bidding_service.delete_bidding_and_files(bidding_id)
