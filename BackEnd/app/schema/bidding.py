from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class BiddingCreate(BaseModel):
    user_id: int
    department_id: int
    category_id: int

    number: int
    year: int

    bidding_type: str
    status: Optional[str] = "Aberto"
    classification: Optional[str] = "Global"

    object_name: str
    object_description: Optional[str] = None

    estimated_value: Optional[Decimal] = None

    publication_date: Optional[date] = None
    opening_date: Optional[date] = None


class BiddingUpdate(BaseModel):
    department_id: Optional[int] = None
    category_id: Optional[int] = None

    number: Optional[int] = None
    year: Optional[int] = None

    bidding_type: Optional[str] = None
    status: Optional[str] = None
    classification: Optional[str] = None

    object_name: Optional[str] = None
    object_description: Optional[str] = None

    estimated_value: Optional[Decimal] = None

    publication_date: Optional[date] = None
    opening_date: Optional[date] = None