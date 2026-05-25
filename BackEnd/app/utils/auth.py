import jwt
import datetime
import os
from passlib.context import CryptContext
from dotenv import load_dotenv

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "mudar-para-uma-chave-segura-em-producao")
ALGORITMO  = os.getenv("ALGORITHM", "HS256")
EXPIRACAO  = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/login")

pwd_context = CryptContext(schemes=["bcrypt"])

def hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)

def senha_tem_hash_valido(senha_hash: str) -> bool:
    return bool(senha_hash and pwd_context.identify(senha_hash))

def verificar_senha(senha: str, senha_hash: str) -> bool:
    if not senha_tem_hash_valido(senha_hash):
        return False

    try:
        return pwd_context.verify(senha, senha_hash)
    except ValueError:
        return False

def criar_token(user_id: int, email: str, expiracao_minutos: int = None, adicional: dict = None) -> str:
    tempo_exp = EXPIRACAO if expiracao_minutos is None else expiracao_minutos
    payload = {
        "sub": str(user_id),
        "email": email,
    }

    if tempo_exp > 0:
        payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(minutes=tempo_exp)

    if adicional:
        payload.update(adicional)
        
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITMO)

def verificar_token(token: str) -> dict:
    """Lança exceção se o token for inválido ou expirado."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITMO])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    return verificar_token(token)

def check_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("perfil") not in {"suporte", "admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a administradores"
        )
    return current_user

def check_bidding_manager(current_user: dict = Depends(get_current_user)):
    if current_user.get("perfil") not in {"suporte", "admin", "editor"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a usuários com permissão de edição"
        )
    return current_user
