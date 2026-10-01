from datetime import datetime, timedelta, timezone

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status

from .config import SECRET_KEY


ALGORITHM = "HS256"


pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    password: str,
    hashed: str
) -> bool:

    return pwd_context.verify(
        password,
        hashed
    )


def create_access_token(
    user_id: int,
    minutes: int = 60 * 24
) -> str:

    payload = {
        "sub": str(user_id),
        "exp": (
            datetime.now(timezone.utc)
            + timedelta(minutes=minutes)
        )
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decode_token(token: str) -> int:

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return int(payload["sub"])

    except (
        JWTError,
        KeyError,
        ValueError
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )