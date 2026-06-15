import jwt
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.config import settings

security = HTTPBearer(auto_error=False)


def get_token_from_header(request: Request) -> str | None:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


def get_doctor_id_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials if credentials else None
    if not token:
        raise HTTPException(status_code=401, detail="Token requerido")

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        role = payload.get("role") or payload.get("rol")
        if role != "MEDICO":
            raise HTTPException(status_code=403, detail="Solo médicos pueden usar este servicio")

        medico_id = payload.get("medicoId")
        if not medico_id:
            doctor_id = payload.get("doctorId") or payload.get("sub")
        else:
            doctor_id = medico_id

        if not doctor_id:
            raise HTTPException(status_code=401, detail="Token inválido: sin identificador de médico")

        return str(doctor_id)

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
