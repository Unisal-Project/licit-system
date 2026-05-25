from fastapi import HTTPException, status

from app.core.database import close_resources, get_connection
from app.repository import user as user_repo
from app.utils import auth as auth_utils

MANAGER_PROFILES = {"suporte", "admin"}
ADMIN_ALLOWED_TARGET_PROFILES = {"admin", "editor", "visitante"}


def _ensure_can_manage_users(current_user: dict):
    if current_user.get("perfil") not in MANAGER_PROFILES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito ao gerenciamento de usuários"
        )


def _ensure_can_access_target(current_user: dict, target_user: dict, new_role: str = None):
    current_profile = current_user.get("perfil")
    target_profile = target_user.get("perfil")

    if current_profile == "suporte":
        return

    if target_profile == "suporte" or new_role == "suporte":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administradores não podem visualizar ou alterar usuários de suporte"
        )


def list_users(current_user: dict):
    _ensure_can_manage_users(current_user)

    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        return user_repo.list_all(
            cursor,
            include_support=current_user.get("perfil") == "suporte"
        )
    finally:
        close_resources(cursor, connection)


def get_current_user_profile(current_user: dict):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        user_repo.ensure_remote_access_columns(cursor)
        user = user_repo.find_by_id(int(current_user["sub"]), cursor)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        return user
    finally:
        close_resources(cursor, connection)


def update_user_role(user_id: int, perfil: str, current_user: dict):
    _ensure_can_manage_users(current_user)

    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        user_repo.ensure_remote_access_columns(cursor)
        target_user = user_repo.find_by_id(user_id, cursor)
        if not target_user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        _ensure_can_access_target(current_user, target_user, new_role=perfil)

        user_repo.update_role(user_id, perfil, cursor)
        connection.commit()

        return user_repo.find_by_id(user_id, cursor)
    except HTTPException:
        connection.rollback()
        raise
    except Exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail="Erro ao atualizar usuário")
    finally:
        close_resources(cursor, connection)


def update_current_user_password(senha_atual: str, nova_senha: str, current_user: dict):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        user = user_repo.find_credentials_by_id(int(current_user["sub"]), cursor)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        if not user["ativo"]:
            raise HTTPException(status_code=403, detail="Usuário inativo")

        stored_password = user.get("senha") or ""
        password_is_valid = auth_utils.verificar_senha(senha_atual, stored_password)

        if (
            not password_is_valid
            and not auth_utils.senha_tem_hash_valido(stored_password)
            and senha_atual == stored_password
        ):
            password_is_valid = True

        if not password_is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Senha atual incorreta"
            )

        user_repo.update_password(
            user["id"],
            auth_utils.hash_senha(nova_senha),
            cursor
        )
        connection.commit()

        return {"message": "Senha alterada com sucesso"}
    except HTTPException:
        connection.rollback()
        raise
    except Exception:
        connection.rollback()
        raise HTTPException(status_code=500, detail="Erro ao alterar senha")
    finally:
        close_resources(cursor, connection)


def delete_user(user_id: int, current_user: dict):
    _ensure_can_manage_users(current_user)

    current_user_id = int(current_user["sub"])
    if user_id == current_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você não pode excluir o próprio usuário"
        )

    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        user_repo.ensure_remote_access_columns(cursor)
        target_user = user_repo.find_by_id(user_id, cursor)
        if not target_user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")

        _ensure_can_access_target(current_user, target_user)

        user_repo.delete(user_id, cursor)
        connection.commit()

        return {"message": "Usuário excluído com sucesso"}
    except HTTPException:
        connection.rollback()
        raise
    except Exception as error:
        connection.rollback()

        if getattr(error, "errno", None) == 1451:
            try:
                user_repo.deactivate(user_id, cursor)
                connection.commit()
                return {
                    "action": "deactivated",
                    "message": "Usuário desativado porque possui registros vinculados"
                }
            except Exception:
                connection.rollback()
                raise HTTPException(status_code=500, detail="Erro ao desativar usuário")

        raise HTTPException(status_code=500, detail="Erro ao excluir usuário")
    finally:
        close_resources(cursor, connection)
