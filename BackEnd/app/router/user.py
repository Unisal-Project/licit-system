from fastapi import APIRouter, Depends

from app.schema.user_admin import UserPasswordUpdate, UserRoleUpdate
from app.service import user as user_service
from app.utils.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def list_users(current_user: dict = Depends(get_current_user)):
    return user_service.list_users(current_user)


@router.get("/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return user_service.get_current_user_profile(current_user)


@router.patch("/me/password")
def update_current_user_password(
    data: UserPasswordUpdate,
    current_user: dict = Depends(get_current_user)
):
    return user_service.update_current_user_password(
        data.senha_atual,
        data.nova_senha,
        current_user
    )


@router.patch("/{user_id}/role")
def update_user_role(
    user_id: int,
    data: UserRoleUpdate,
    current_user: dict = Depends(get_current_user)
):
    return user_service.update_user_role(user_id, data.perfil, current_user)


@router.delete("/{user_id}")
def delete_user(user_id: int, current_user: dict = Depends(get_current_user)):
    return user_service.delete_user(user_id, current_user)
