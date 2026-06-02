import os
import hashlib
import secrets
import smtplib
import re
from email.message import EmailMessage
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.core.database import get_connection, close_resources
from app.repository import user as user_repo
from app.utils import auth as auth_utils
from app.schema.auth import ForgotPasswordRequest, LoginRequest, RemoteAccessRequest, ResetPasswordRequest, VisitorTokenRequest
from app.schema.user import UserCreate

PASSWORD_RESET_EXPIRE_MINUTES = int(os.getenv("PASSWORD_RESET_EXPIRE_MINUTES", "30"))
PASSWORD_RESET_DEBUG = os.getenv("PASSWORD_RESET_DEBUG", "true").lower() == "true"

def _hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def _get_frontend_url(origin: str = None) -> str:
    return (origin or os.getenv("FRONTEND_URL") or "http://localhost:5173").rstrip("/")

def _normalize_remote_username(value: str) -> str:
    username = re.sub(r"[^a-zA-Z0-9._-]+", ".", value.strip()).strip(".").lower()

    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Informe um usuário de acesso com pelo menos 3 caracteres")

    return username

def _send_password_reset_email(email: str, reset_link: str):
    smtp_host = os.getenv("SMTP_HOST")

    if not smtp_host:
        print(f"[password-reset] SMTP não configurado. Link de redefinição: {reset_link}")
        return False

    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "no-reply@licitsystem.local")
    use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"

    message = EmailMessage()
    message["Subject"] = "Redefinição de senha - LicitSystem"
    message["From"] = smtp_from
    message["To"] = email
    message.set_content(
        "Recebemos uma solicitação para redefinir sua senha no LicitSystem.\n\n"
        f"Acesse o link abaixo para criar uma nova senha:\n{reset_link}\n\n"
        f"Este link expira em {PASSWORD_RESET_EXPIRE_MINUTES} minutos.\n"
        "Se você não solicitou essa redefinição, ignore este e-mail."
    )

    with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as smtp:
        if use_tls:
            smtp.starttls()

        if smtp_user and smtp_password:
            smtp.login(smtp_user, smtp_password)

        smtp.send_message(message)

def generate_visitor_token(data: VisitorTokenRequest, current_user: dict):
    # Definimos um "ID" especial ou usamos o ID do sistema para visitantes
    # No seu init.sql o ID 1 é o "Usuário Sistema", podemos usar algo similar
    # Ou simplesmente marcar no payload que é um visitante
    
    exp_minutos = data.expiracao_horas * 60
    
    # Criamos o token com perfil de visitante
    token = auth_utils.criar_token(
        user_id=0, # 0 para visitante genérico
        email="visitante@temporario.local",
        expiracao_minutos=exp_minutos,
        adicional={"perfil": "visitante"}
    )
    
    expira_em = datetime.utcnow() + timedelta(minutes=exp_minutos)
    
    # O link depende de como seu Frontend lida com isso
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    link = f"{frontend_url}/login?token={token}"
    
    return {
        "link_acesso": link,
        "access_token": token,
        "expira_em": expira_em
    }

def generate_remote_access(data: RemoteAccessRequest, current_user: dict, origin: str = None):
    perfil = data.perfil
    permanente = perfil == "editor" and data.permanente
    usuario_acesso = _normalize_remote_username(data.usuario)

    if perfil == "visitante":
        expira_em = datetime.utcnow() + timedelta(hours=24)
    elif permanente:
        expira_em = None
    else:
        validade_dias = data.validade_dias or 7
        expira_em = datetime.utcnow() + timedelta(days=validade_dias)

    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        user_repo.ensure_remote_access_columns(cursor)
        if user_repo.find_by_login(usuario_acesso, cursor):
            raise HTTPException(status_code=409, detail="Este usuário de acesso já existe")

        remote_email = f"{usuario_acesso}@acesso-remoto.local"
        user_id = user_repo.create_remote_access_user(
            {
                "nome": data.usuario.strip(),
                "email": remote_email,
                "usuario_acesso": usuario_acesso,
                "senha": auth_utils.hash_senha(data.senha),
                "perfil": perfil,
                "ativo": 1,
                "acesso_expira_em": expira_em,
                "acesso_permanente": 1 if permanente else 0,
            },
            cursor
        )
        connection.commit()
    except HTTPException:
        if connection:
            connection.rollback()
        raise
    except Exception:
        if connection:
            connection.rollback()
        raise HTTPException(status_code=500, detail="Erro ao criar acesso remoto")
    finally:
        close_resources(cursor, connection)

    link = f"{_get_frontend_url(origin)}/login?usuario={usuario_acesso}"

    return {
        "link_acesso": link,
        "usuario": usuario_acesso,
        "senha": data.senha,
        "perfil": perfil,
        "expira_em": expira_em,
        "permanente": permanente,
    }

def register_user(data: UserCreate):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        user_repo.ensure_remote_access_columns(cursor)
        # Verifica se email já existe
        existing_user = user_repo.find_by_email(data.email, cursor)
        if existing_user:
            raise HTTPException(status_code=409, detail="Este email já está cadastrado")
        
        # Prepara dados (Hash da senha)
        user_data = data.model_dump()
        user_data["senha"] = auth_utils.hash_senha(data.senha)
        user_data["perfil"] = "visitante"
        user_data["ativo"] = 1
        
        user_id = user_repo.create(user_data, cursor)
        connection.commit()
        
        return {"message": "Usuário registrado com sucesso", "user_id": user_id}
        
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail="Erro ao registrar usuário")
    finally:
        close_resources(cursor, connection)

def request_password_reset(data: ForgotPasswordRequest, origin: str = None):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        user_repo.ensure_remote_access_columns(cursor)
        user_repo.ensure_password_reset_table(cursor)
        user = user_repo.find_by_email(data.email, cursor)

        response = {
            "message": "Se o e-mail estiver cadastrado, enviaremos as instruções de redefinição."
        }

        if not user or not user.get("ativo"):
            connection.commit()
            return response

        token = secrets.token_urlsafe(48)
        token_hash = _hash_reset_token(token)
        expires_at = datetime.utcnow() + timedelta(minutes=PASSWORD_RESET_EXPIRE_MINUTES)
        reset_link = f"{_get_frontend_url(origin)}/reset-password?token={token}"

        user_repo.create_password_reset_token(user["id"], token_hash, expires_at, cursor)
        _send_password_reset_email(user["email"], reset_link)
        connection.commit()

        if PASSWORD_RESET_DEBUG:
            response["reset_link"] = reset_link

        return response
    except Exception:
        if connection:
            connection.rollback()
        raise HTTPException(status_code=500, detail="Erro ao solicitar redefinição de senha")
    finally:
        close_resources(cursor, connection)

def reset_password(data: ResetPasswordRequest):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")

    cursor = connection.cursor(dictionary=True)
    try:
        user_repo.ensure_password_reset_table(cursor)
        token_data = user_repo.find_valid_password_reset_token(
            _hash_reset_token(data.token),
            cursor
        )

        if not token_data:
            raise HTTPException(status_code=400, detail="Link inválido ou expirado")

        user_repo.update_password(
            token_data["usuario_id"],
            auth_utils.hash_senha(data.nova_senha),
            cursor
        )
        user_repo.mark_password_reset_token_used(token_data["id"], cursor)
        connection.commit()

        return {"message": "Senha redefinida com sucesso"}
    except HTTPException:
        if connection:
            connection.rollback()
        raise
    except Exception:
        if connection:
            connection.rollback()
        raise HTTPException(status_code=500, detail="Erro ao redefinir senha")
    finally:
        close_resources(cursor, connection)

def authenticate_user(data: LoginRequest):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        user_repo.ensure_remote_access_columns(cursor)
        user = user_repo.find_by_login(data.email, cursor)
        if not user:
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")

        stored_password = user.get("senha") or ""
        password_is_valid = auth_utils.verificar_senha(data.password, stored_password)
        should_upgrade_password = False

        if (
            not password_is_valid
            and not auth_utils.senha_tem_hash_valido(stored_password)
            and data.password == stored_password
        ):
            password_is_valid = True
            should_upgrade_password = True

        if not password_is_valid:
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        
        if not user["ativo"]:
            raise HTTPException(status_code=403, detail="Usuário inativo")

        if (
            user.get("acesso_expira_em")
            and not user.get("acesso_permanente")
            and user["acesso_expira_em"] < datetime.utcnow()
        ):
            raise HTTPException(status_code=403, detail="Acesso remoto expirado")
        
        token = auth_utils.criar_token(
            user["id"], 
            user["email"], 
            expiracao_minutos=auth_utils.REMEMBER_ME_EXPIRACAO if data.remember_me else None,
            adicional={"perfil": user["perfil"]}
        )
        
        if should_upgrade_password:
            user_repo.update_password(
                user["id"],
                auth_utils.hash_senha(data.password),
                cursor
            )

        user_repo.update_last_login(user["id"], cursor)
        connection.commit()
        
        # Remove senha do retorno
        user.pop("senha")
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Erro ao autenticar usuário")
    finally:
        close_resources(cursor, connection)
