from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.security import verify_access_token
from typing import Optional, List
from datetime import date
from app.security import authenticate_admin
from app.database import get_db_connection
import mysql.connector

router = APIRouter()
security = HTTPBearer()

# Dependency for authentication
# Dependency for JWT authentication
def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    username = verify_access_token(token)
    return username
import mysql.connector

@router.get("/cycles", response_model=List[dict])
def get_cycles(
    admin: str = Depends(get_current_admin),
    theme: Optional[str] = Query(None, description="Filter by training theme"),
    date_from: Optional[date] = Query(None, description="Filter cycles starting after this date"),
    date_to: Optional[date] = Query(None, description="Filter cycles ending before this date"),
    active_only: bool = Query(False, description="Show only active cycles (not ended)"),
    limit: int = Query(100, ge=1, le=1000),
    skip: int = Query(0, ge=0)
):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = "SELECT * FROM cycle"
    params = []
    
    filters = []
    if theme:
        filters.append("theme LIKE %s")
        params.append(f"%{theme}%")
    if date_from:
        filters.append("date_deb >= %s")
        params.append(date_from)
    if date_to:
        filters.append("date_fin <= %s")
        params.append(date_to)
    if active_only:
        filters.append("date_fin >= CURDATE()")
    
    if filters:
        query += " WHERE " + " AND ".join(filters)
    
    query += " LIMIT %s OFFSET %s"
    params.extend([limit, skip])
    
    cursor.execute(query, params)
    cycles = cursor.fetchall()
    cursor.close()
    conn.close()
    return cycles

@router.get("/cycles/{cycle_id}", response_model=dict)
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
    admin: str = Depends(get_current_admin),
    for1: Optional[str] = None,
    for2: Optional[str] = None,
    for3: Optional[str] = None
):
    # Validate date range
    if date_deb > date_fin:
        raise HTTPException(status_code=400, detail="End date must be after start date")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            """INSERT INTO cycle 
            (num_act, theme, date_deb, date_fin, for1, for2, for3, num_salle)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (num_act, theme, date_deb, date_fin, for1, for2, for3, num_salle)
        )
        cycle_id = cursor.lastrowid
        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    
    return {"id": cycle_id, "message": "Training cycle created successfully"}

@router.put("/cycles/{cycle_id}")
def update_cycle(
    cycle_id: int,
    admin: str = Depends(get_current_admin),
    num_act: Optional[str] = None,
    theme: Optional[str] = None,
    date_deb: Optional[date] = None,
    date_fin: Optional[date] = None,
    for1: Optional[str] = None,
    for2: Optional[str] = None,
    for3: Optional[str] = None,
    num_salle: Optional[int] = None
):
    # Validate date range if both are provided
    if date_deb is not None and date_fin is not None and date_deb > date_fin:
        raise HTTPException(status_code=400, detail="End date must be after start date")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get current values
    cursor.execute("SELECT * FROM cycle WHERE id = %s", (cycle_id,))
    current = cursor.fetchone()
    if not current:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Cycle not found")
    
    # Prepare update fields
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
    if for1 is not None:
        update_fields.append("for1 = %s")
        params.append(for1)
    if for2 is not None:
        update_fields.append("for2 = %s")
        params.append(for2)
    if for3 is not None:
        update_fields.append("for3 = %s")
        params.append(for3)
    if num_salle is not None:
        update_fields.append("num_salle = %s")
        params.append(num_salle)
    
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
    
    return {"message": "Training cycle updated successfully"}

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
    
    return {"message": "Training cycle deleted successfully"}

@router.get("/cycles/{cycle_id}/participants", response_model=List[dict])
def get_cycle_participants(cycle_id: int, admin: str = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # First get cycle details to know theme and room number
    cursor.execute("SELECT theme, num_salle FROM cycle WHERE id = %s", (cycle_id,))
    cycle = cursor.fetchone()
    if not cycle:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Cycle not found")
    
    # Find participants with matching theme and room
    cursor.execute(
        "SELECT * FROM participant WHERE theme_part = %s AND num_salle = %s",
        (cycle['theme'], cycle['num_salle'])
    )
    participants = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return participants