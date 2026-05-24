from datetime import datetime, timedelta
from fastapi import HTTPException
from app.core.database import get_connection, close_resources
from app.repository import user as user_repo
from app.utils import auth as auth_utils
from app.schema.auth import LoginRequest, VisitorTokenRequest
from app.schema.user import UserCreate

def generate_visitor_token(data: VisitorTokenRequest, current_user: dict):
    # Definimos um "ID" especial ou usamos o ID do sistema para visitantes
    # No seu init.sql o ID 1 é o "Usuário Sistema", podemos usar algo similar
    # Ou simplesmente marcar no payload que é um visitante
    
    exp_minutos = data.expiracao_horas * 60
    
    # Criamos o token com perfil 'visualizacao'
    token = auth_utils.criar_token(
        user_id=0, # 0 para visitante genérico
        email="visitante@temporario.local",
        expiracao_minutos=exp_minutos,
        adicional={"perfil": "visualizacao"}
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

def register_user(data: UserCreate):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        # Verifica se email já existe
        existing_user = user_repo.find_by_email(data.email, cursor)
        if existing_user:
            raise HTTPException(status_code=400, detail="Este email já está cadastrado")
        
        # Prepara dados (Hash da senha)
        user_data = data.model_dump()
        user_data["senha"] = auth_utils.hash_senha(data.senha)
        
        # Força perfil de fornecedor se não for admin criando (simplificação)
        # Em um sistema real, aqui você validaria permissões
        
        user_id = user_repo.create(user_data, cursor)
        connection.commit()
        
        return {"message": "Usuário registrado com sucesso", "user_id": user_id}
        
    except HTTPException:
        if connection: connection.rollback()
        raise
    except Exception as e:
        if connection: connection.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)

def authenticate_user(data: LoginRequest):
    connection = get_connection()
    if not connection:
        raise HTTPException(status_code=500, detail="Database connection error")
    
    cursor = connection.cursor(dictionary=True)
    try:
        user = user_repo.find_by_email(data.email, cursor)
        if not user:
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        
        if not auth_utils.verificar_senha(data.password, user["senha"]):
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        
        if not user["ativo"]:
            raise HTTPException(status_code=403, detail="Usuário inativo")
        
        token = auth_utils.criar_token(
            user["id"], 
            user["email"], 
            adicional={"perfil": user["perfil"]}
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        close_resources(cursor, connection)
