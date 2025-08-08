from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, List
from app.security import verify_access_token
from app.database import get_db_connection
from datetime import date
import mysql.connector
router = APIRouter()
security = HTTPBearer()

# Dependency for JWT authentication
def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    username = verify_access_token(token)
    return username

@router.get("/participants", response_model=List[dict])
def get_participants(
    admin: str = Depends(get_current_admin),
    theme: Optional[str] = Query(None, description="Filter by training theme"),
    entreprise: Optional[str] = Query(None, description="Filter by company"),
    nom: Optional[str] = Query(None, description="Search by participant name"),
    limit: int = Query(100, ge=1, le=1000),
    skip: int = Query(0, ge=0)
):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = "SELECT * FROM participant"
    params = []
    filters = []
    if theme:
        filters.append("theme_part LIKE %s")
        params.append(f"%{theme}%")
    if entreprise:
        filters.append("entreprise LIKE %s")
        params.append(f"%{entreprise}%")
    if nom:
        filters.append("nom_prenom LIKE %s")
        params.append(f"%{nom}%")
    if filters:
        query += " WHERE " + " AND ".join(filters)
    query += " LIMIT %s OFFSET %s"
    params.extend([limit, skip])
    cursor.execute(query, params)
    participants = cursor.fetchall()
    cursor.close()
    conn.close()
    return participants

@router.get("/participants/{participant_id}", response_model=dict)
def get_participant(participant_id: int, admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM participant WHERE id = %s", (participant_id,))
    participant = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return participant

@router.post("/participants", status_code=status.HTTP_201_CREATED)
def create_participant(
    nom_prenom: str,
    cin: str,
    entreprise: str,
    admin: str = Depends(get_current_admin),
    tel_fix: Optional[str] = None,
    fax: Optional[str] = None,
    tel_port: Optional[str] = None,
    mail: Optional[str] = None,
    theme_part: Optional[str] = None,
    num_salle: Optional[int] = None,
    date_debut: Optional[date] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    columns = ["nom_prenom", "cin", "entreprise"]
    values = [nom_prenom, cin, entreprise]
    if tel_fix is not None:
        columns.append("tel_fix")
        values.append(tel_fix)
    if fax is not None:
        columns.append("fax")
        values.append(fax)
    if tel_port is not None:
        columns.append("tel_port")
        values.append(tel_port)
    if mail is not None:
        columns.append("mail")
        values.append(mail)
    if theme_part is not None:
        columns.append("theme_part")
        values.append(theme_part)
    if num_salle is not None:
        columns.append("num_salle")
        values.append(num_salle)
    if date_debut is not None:
        columns.append("date_debut")
        values.append(date_debut)
    try:
        query = f"INSERT INTO participant ({', '.join(columns)}) VALUES ({', '.join(['%s']*len(values))})"
        cursor.execute(query, values)
        participant_id = cursor.lastrowid
        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return {"id": participant_id, "message": "Participant created successfully"}

@router.put("/participants/{participant_id}")
def update_participant(
    participant_id: int,
    nom_prenom: Optional[str] = None,
    cin: Optional[str] = None,
    entreprise: Optional[str] = None,
    admin: str = Depends(get_current_admin),
    tel_fix: Optional[str] = None,
    fax: Optional[str] = None,
    tel_port: Optional[str] = None,
    mail: Optional[str] = None,
    theme_part: Optional[str] = None,
    num_salle: Optional[int] = None,
    date_debut: Optional[date] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Get current values
    cursor.execute("SELECT * FROM participant WHERE id = %s", (participant_id,))
    current = cursor.fetchone()
    if not current:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Participant not found")
    # Prepare update fields
    update_fields = []
    params = []
    if nom_prenom is not None:
        update_fields.append("nom_prenom = %s")
        params.append(nom_prenom)
    if cin is not None:
        update_fields.append("cin = %s")
        params.append(cin)
    if entreprise is not None:
        update_fields.append("entreprise = %s")
        params.append(entreprise)
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
    if theme_part is not None:
        update_fields.append("theme_part = %s")
        params.append(theme_part)
    if num_salle is not None:
        update_fields.append("num_salle = %s")
        params.append(num_salle)
    if date_debut is not None:
        update_fields.append("date_debut = %s")
        params.append(date_debut)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    query = "UPDATE participant SET " + ", ".join(update_fields) + " WHERE id = %s"
    params.append(participant_id)
    try:
        cursor.execute(query, params)
        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return {"message": "Participant updated successfully"}

@router.delete("/participants/{participant_id}")
def delete_participant(participant_id: int, admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM participant WHERE id = %s", (participant_id,))
        if cursor.rowcount == 0:
            conn.rollback()
            raise HTTPException(status_code=404, detail="Participant not found")
        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Participant deleted successfully"}