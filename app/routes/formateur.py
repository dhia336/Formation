
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.security import verify_access_token
from app.database import get_db_connection
import mysql.connector


router = APIRouter()
security = HTTPBearer()


# Dependency for JWT authentication
def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    username = verify_access_token(token)
    return username

@router.get("/formateurs")
def get_formateurs(admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM formateur")
    formateurs = cursor.fetchall()
    cursor.close()
    conn.close()
    return formateurs

# Similar CRUD operations for POST, PUT, DELETE...
@router.get("/formateurs/{formateur_id}")
def get_formateur(formateur_id: int, admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM formateur WHERE id = %s", (formateur_id,))
    formateur = cursor.fetchone()
    cursor.close()
    conn.close()
    if not formateur:
        raise HTTPException(status_code=404, detail="Formateur not found")
    return formateur

@router.post("/formateurs", status_code=status.HTTP_201_CREATED)
def create_formateur(
    nom_prenom: str,
    cin: str,
    specialite: str,
    admin: str = Depends(get_current_admin),
    tel_fix: str = None,
    fax: str = None,
    tel_port: str = None,
    mail: str = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """INSERT INTO formateur (nom_prenom, cin, specialite, tel_fix, fax, tel_port, mail) VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (nom_prenom, cin, specialite, tel_fix, fax, tel_port, mail)
        )
        formateur_id = cursor.lastrowid
        conn.commit()
    except Exception as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return {"id": formateur_id, "message": "Formateur created successfully"}

@router.put("/formateurs/{formateur_id}")
def update_formateur(
    formateur_id: int,
    nom_prenom: str = None,
    cin: str = None,
    specialite: str = None,
    admin: str = Depends(get_current_admin),
    tel_fix: str = None,
    fax: str = None,
    tel_port: str = None,
    mail: str = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM formateur WHERE id = %s", (formateur_id,))
    current = cursor.fetchone()
    if not current:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Formateur not found")
    update_fields = []
    params = []
    if nom_prenom is not None:
        update_fields.append("nom_prenom = %s")
        params.append(nom_prenom)
    if cin is not None:
        update_fields.append("cin = %s")
        params.append(cin)
    if specialite is not None:
        update_fields.append("specialite = %s")
        params.append(specialite)
    if tel_fix is not None:
        update_fields.append("tel_fix = %s")
        params.append(tel_fix)
    if fax is not None:
        update_fields.append("fax = %s")
        params.append(fax)
    if tel_port is not None:
        update_fields.append("tel_port = %s")
        params.append(tel_port)
    if mail is not None:
        update_fields.append("mail = %s")
        params.append(mail)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    query = "UPDATE formateur SET " + ", ".join(update_fields) + " WHERE id = %s"
    params.append(formateur_id)
    try:
        cursor.execute(query, params)
        conn.commit()
    except Exception as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return {"message": "Formateur updated successfully"}

@router.delete("/formateurs/{formateur_id}")
def delete_formateur(formateur_id: int, admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM formateur WHERE id = %s", (formateur_id,))
        if cursor.rowcount == 0:
            conn.rollback()
            raise HTTPException(status_code=404, detail="Formateur not found")
        conn.commit()
    except Exception as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return {"message": "Formateur deleted successfully"}