from fastapi import APIRouter, UploadFile, File, status
from typing import List
from app.schema.attachment import AttachmentResponse
from app.service import attachment as attachment_service

router = APIRouter(
    tags=["Anexos"]
)

@router.post(
    "/licitacoes/{licitacao_id}/anexos",
    status_code=status.HTTP_201_CREATED
)
def upload_attachment(
    licitacao_id: int,
    file: UploadFile = File(...)
):
    return attachment_service.save_bidding_attachment(licitacao_id, file)

@router.get(
    "/licitacoes/{licitacao_id}/anexos",
    response_model=List[AttachmentResponse]
)
def list_attachments(
    licitacao_id: int
):
    return attachment_service.get_attachments_by_bidding(licitacao_id)

@router.get(
    "/anexos/{attachment_id}/download"
)
def download_attachment(
    attachment_id: int
):
    return attachment_service.get_attachment_file(attachment_id)

@router.delete(
    "/anexos/{attachment_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_attachment(
    attachment_id: int
):
    attachment_service.remove_attachment(attachment_id)
    return None