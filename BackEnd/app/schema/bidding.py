from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class GetAllBiddings(BaseModel):
    page: int = Field(1, ge=1)
    limit: int = Field(10, ge=1, le=100)
    number: Optional[int] = None
    year: Optional[int] = None
    department_id: Optional[int] = None
    category_id: Optional[int] = None
    status: Optional[str] = None
    search: Optional[str] = None

class BiddingCreate(BaseModel):
    user_id: int
    department_id: int
    category_id: int

    number: int = Field(..., gt=0)
    year: int = Field(..., gt=0)

    bidding_type: str = Field(..., min_length=1)
    status: Optional[str] = "Aguardando Abertura"
    classification: str = Field(..., min_length=1)

    object_name: str = Field(..., min_length=1)
    object_description: Optional[str] = None

    estimated_value: Decimal

    publication_date: date
    opening_date: date

    @field_validator("bidding_type", "classification", "object_name")
    @classmethod
    def required_text_fields_must_not_be_blank(cls, value: str):
        if not value or not value.strip():
            raise ValueError("Campo obrigatório.")

        return value.strip()


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
