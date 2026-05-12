import os
import uuid
from fastapi import UploadFile, HTTPException


ALLOWED_EXTENSIONS = {
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "png",
    "jpg",
    "jpeg",
}

MAX_FILE_SIZE_MB = 10


def get_file_extension(filename: str) -> str:
    if "." not in filename:
        raise HTTPException(
            status_code=400,
            detail="Arquivo sem extensão"
        )

    return filename.rsplit(".", 1)[1].lower()


def validate_file_extension(filename: str):
    extension = get_file_extension(filename)

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Extensão .{extension} não permitida"
        )

    return extension


def generate_unique_filename(filename: str) -> str:
    extension = get_file_extension(filename)
    unique_name = uuid.uuid4().hex

    return f"{unique_name}.{extension}"


def get_file_size_kb(file_path: str) -> int:
    size_bytes = os.path.getsize(file_path)
    return round(size_bytes / 1024)


def validate_file_size(file_path: str):
    size_kb = get_file_size_kb(file_path)
    max_size_kb = MAX_FILE_SIZE_MB * 1024

    if size_kb > max_size_kb:
        os.remove(file_path)

        raise HTTPException(
            status_code=400,
            detail=f"Arquivo excede o limite de {MAX_FILE_SIZE_MB}MB"
        )

    return size_kb


async def save_upload_file(file: UploadFile, upload_dir: str) -> dict:
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Arquivo inválido"
        )

    extension = validate_file_extension(file.filename)

    os.makedirs(upload_dir, exist_ok=True)

    stored_filename = generate_unique_filename(file.filename)
    file_path = os.path.join(upload_dir, stored_filename)

    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    size_kb = validate_file_size(file_path)

    return {
        "original_name": file.filename,
        "stored_name": stored_filename,
        "path": file_path,
        "extension": extension,
        "size_kb": size_kb,
    }


def delete_file_if_exists(file_path: str):
    if file_path and os.path.exists(file_path):
        os.remove(file_path)