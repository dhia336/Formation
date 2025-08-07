
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from app.security import authenticate_admin, create_access_token
from app.config import Config


router = APIRouter()
security = HTTPBasic()


@router.post("/login")
def login(credentials: HTTPBasicCredentials = Depends(security)):
    admin = authenticate_admin(credentials.username, credentials.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    access_token = create_access_token(data={"sub": credentials.username})
    return {"access_token": access_token, "token_type": "bearer"}