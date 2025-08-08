from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.security import verify_access_token
from app.database import get_db_connection
from datetime import date
import mysql.connector

router = APIRouter()
security = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    username = verify_access_token(token)
    return username

@router.get("/cycles")
def get_cycles(admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cycle")
    cycles = cursor.fetchall()
    cursor.close()
    conn.close()
    return cycles

@router.get("/cycles/{cycle_id}")
def get_cycle(cycle_id: int, admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM cycle WHERE id = %s", (cycle_id,))
    cycle = cursor.fetchone()
    cursor.close()
    conn.close()
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle not found")
    return cycle

@router.post("/cycles", status_code=status.HTTP_201_CREATED)
def create_cycle(
    num_act: str,
    theme: str,
    date_deb: date,
    date_fin: date,
    num_salle: int,
    for1: Optional[str] = None,
    for2: Optional[str] = None,
    for3: Optional[str] = None,
    admin: str = Depends(get_current_admin)
):
    conn = get_db_connection()
    cursor = conn.cursor()
    columns = ["num_act", "theme", "date_deb", "date_fin", "num_salle"]
    values = [num_act, theme, date_deb, date_fin, num_salle]
    if for1 is not None:
        columns.append("for1")
        values.append(for1)
    if for2 is not None:
        columns.append("for2")
        values.append(for2)
    if for3 is not None:
        columns.append("for3")
        values.append(for3)
    try:
        query = f"INSERT INTO cycle ({', '.join(columns)}) VALUES ({', '.join(['%s']*len(values))})"
        cursor.execute(query, values)
        cycle_id = cursor.lastrowid
        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return {"id": cycle_id, "message": "Cycle created successfully"}

@router.put("/cycles/{cycle_id}")
def update_cycle(
    cycle_id: int,
    num_act: Optional[str] = None,
    theme: Optional[str] = None,
    date_deb: Optional[date] = None,
    date_fin: Optional[date] = None,
    num_salle: Optional[int] = None,
    for1: Optional[str] = None,
    for2: Optional[str] = None,
    for3: Optional[str] = None,
    admin: str = Depends(get_current_admin)
):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cycle WHERE id = %s", (cycle_id,))
    current = cursor.fetchone()
    if not current:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Cycle not found")
    update_fields = []
    params = []
    if num_act is not None:
        update_fields.append("num_act = %s")
        params.append(num_act)
    if theme is not None:
        update_fields.append("theme = %s")
        params.append(theme)
    if date_deb is not None:
        update_fields.append("date_deb = %s")
        params.append(date_deb)
    if date_fin is not None:
        update_fields.append("date_fin = %s")
        params.append(date_fin)
    if num_salle is not None:
        update_fields.append("num_salle = %s")
        params.append(num_salle)
    if for1 is not None:
        update_fields.append("for1 = %s")
        params.append(for1)
    if for2 is not None:
        update_fields.append("for2 = %s")
        params.append(for2)
    if for3 is not None:
        update_fields.append("for3 = %s")
        params.append(for3)
    if not update_fields:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    query = "UPDATE cycle SET " + ", ".join(update_fields) + " WHERE id = %s"
    params.append(cycle_id)
    try:
        cursor.execute(query, params)
        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return {"message": "Cycle updated successfully"}

@router.delete("/cycles/{cycle_id}")
def delete_cycle(cycle_id: int, admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM cycle WHERE id = %s", (cycle_id,))
        if cursor.rowcount == 0:
            conn.rollback()
            raise HTTPException(status_code=404, detail="Cycle not found")
        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return {"message": "Cycle deleted successfully"}
