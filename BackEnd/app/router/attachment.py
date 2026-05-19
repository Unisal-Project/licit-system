from fastapi import APIRouter, UploadFile, File, status
from typing import List
from app.schema.attachment import AttachmentResponse
from app.service import attachment as attachment_service

router = APIRouter(
    prefix="/attachments",
    tags=["attachments"]
)

@router.post("/{attachment_id}", status_code=status.HTTP_201_CREATED )
def upload_attachment(
    attachment_id: int,
    file: UploadFile = File(...)
):
    return attachment_service.save_bidding_attachment(attachment_id, file)

@router.get("/{attachment_id}", response_model=List[AttachmentResponse] )
def list_attachments(
    attachment_id: int
):
    return attachment_service.get_attachments_by_bidding(attachment_id)

@router.get("/{attachment_id}/download")
def download_attachment(
    attachment_id: int
):
    return attachment_service.get_attachment_file(attachment_id)

@router.delete("/{attachment_id}", status_code=status.HTTP_204_NO_CONTENT )
def delete_attachment(
    attachment_id: int
):
    attachment_service.remove_attachment(attachment_id)
    return None