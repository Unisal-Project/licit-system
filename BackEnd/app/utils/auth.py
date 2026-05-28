import jwt
import datetime
import os
import uuid
from passlib.context import CryptContext
from dotenv import load_dotenv

from fastapi import Depends, HTTPException, Request, status

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY or len(SECRET_KEY) < 32:
    raise RuntimeError("SECRET_KEY obrigatória e deve ter pelo menos 32 caracteres")

ALGORITMO = os.getenv("ALGORITHM", "HS256")
EXPIRACAO = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
JWT_ISSUER = os.getenv("JWT_ISSUER", "licit-system-api")
JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", "licit-system-web")
AUTH_COOKIE_NAME = "access_token"

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
    agora = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": str(user_id),
        "email": email,
        "iat": agora,
        "nbf": agora,
        "iss": JWT_ISSUER,
        "aud": JWT_AUDIENCE,
        "jti": uuid.uuid4().hex,
    }

    if tempo_exp > 0:
        payload["exp"] = agora + datetime.timedelta(minutes=tempo_exp)

    if adicional:
        payload.update(adicional)
        
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITMO)

def verificar_token(token: str) -> dict:
    """Lança exceção se o token for inválido ou expirado."""
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITMO],
            issuer=JWT_ISSUER,
            audience=JWT_AUDIENCE,
        )
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

def get_current_user(request: Request) -> dict:
    token = request.cookies.get(AUTH_COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não autenticado",
        )

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
