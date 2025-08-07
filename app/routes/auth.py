import csv
import io
from fastapi.responses import StreamingResponse
# Export all tables as a single CSV file

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from app.security import authenticate_admin, create_access_token
from app.config import Config



router = APIRouter()
security = HTTPBasic()

from app.database import get_db_connection
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.security import verify_access_token

# JWT-protected stats endpoint

@router.get("/stats")
def get_stats(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    username = verify_access_token(credentials.credentials)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Total counts
    cursor.execute("SELECT COUNT(*) FROM participant")
    participants_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM formateur")
    formateurs_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM cycle")
    cycles_count = cursor.fetchone()[0]

    # Participants per company
    cursor.execute("SELECT entreprise, COUNT(*) FROM participant GROUP BY entreprise")
    participants_per_company = dict(cursor.fetchall())

    # Cycles per theme
    cursor.execute("SELECT theme, COUNT(*) FROM cycle GROUP BY theme")
    cycles_per_theme = dict(cursor.fetchall())

    # Formateurs per specialty
    cursor.execute("SELECT specialite, COUNT(*) FROM formateur GROUP BY specialite")
    formateurs_per_specialty = dict(cursor.fetchall())

    # Recent additions (last 7 days)
    cursor.execute("SELECT COUNT(*) FROM participant WHERE date_debut >= CURDATE() - INTERVAL 7 DAY")
    recent_participants = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM cycle WHERE date_deb >= CURDATE() - INTERVAL 7 DAY")
    recent_cycles = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM formateur WHERE id IN (SELECT id FROM formateur WHERE DATE(NOW()) - INTERVAL 7 DAY <= DATE(NOW()))")
    recent_formateurs = cursor.fetchone()[0]

    # Top 5 companies with most participants
    cursor.execute("SELECT entreprise, COUNT(*) as count FROM participant GROUP BY entreprise ORDER BY count DESC LIMIT 5")
    top_companies = cursor.fetchall()
    top_companies = [{"entreprise": row[0], "count": row[1]} for row in top_companies]

    # Top 5 training themes
    cursor.execute("SELECT theme_part, COUNT(*) as count FROM participant GROUP BY theme_part ORDER BY count DESC LIMIT 5")
    top_themes = cursor.fetchall()
    top_themes = [{"theme": row[0], "count": row[1]} for row in top_themes]

    # Average number of participants per cycle
    cursor.execute("SELECT AVG(cnt) FROM (SELECT COUNT(*) as cnt FROM participant GROUP BY num_salle, theme_part) as sub")
    avg_participants_per_cycle = cursor.fetchone()[0]

    # Number of cycles currently active (date_fin >= today)
    cursor.execute("SELECT COUNT(*) FROM cycle WHERE date_fin >= CURDATE()")
    active_cycles = cursor.fetchone()[0]

    # Formateur with most assigned cycles (assuming for1, for2, for3 fields in cycle)
    cursor.execute("SELECT for_name, COUNT(*) as count FROM (SELECT for1 as for_name FROM cycle UNION ALL SELECT for2 FROM cycle UNION ALL SELECT for3 FROM cycle) as all_for GROUP BY for_name ORDER BY count DESC LIMIT 1")
    most_active_formateur = cursor.fetchone()
    most_active_formateur = {"formateur": most_active_formateur[0], "cycle_count": most_active_formateur[1]} if most_active_formateur and most_active_formateur[0] else None

    cursor.close()
    conn.close()
    return {
        "participants": participants_count,
        "formateurs": formateurs_count,
        "cycles": cycles_count,
        "participants_per_company": participants_per_company,
        "cycles_per_theme": cycles_per_theme,
        "formateurs_per_specialty": formateurs_per_specialty,
        "recent_additions": {
            "participants": recent_participants,
            "cycles": recent_cycles,
            "formateurs": recent_formateurs
        },
        "top_companies": top_companies,
        "top_themes": top_themes,
        "avg_participants_per_cycle": avg_participants_per_cycle,
        "active_cycles": active_cycles,
        "most_active_formateur": most_active_formateur
    }


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




@router.get("/export")
def export_all_data(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    username = verify_access_token(credentials.credentials)
    conn = get_db_connection()
    cursor = conn.cursor()

    output = io.StringIO()
    writer = csv.writer(output)

    # Export participants
    cursor.execute("SELECT * FROM participant")
    participants = cursor.fetchall()
    writer.writerow(["Participants"])
    if participants:
        writer.writerow([desc[0] for desc in cursor.description])
        for row in participants:
            writer.writerow(row)
    writer.writerow([])

    # Export formateurs
    cursor.execute("SELECT * FROM formateur")
    formateurs = cursor.fetchall()
    writer.writerow(["Formateurs"])
    if formateurs:
        writer.writerow([desc[0] for desc in cursor.description])
        for row in formateurs:
            writer.writerow(row)
    writer.writerow([])

    # Export cycles
    cursor.execute("SELECT * FROM cycle")
    cycles = cursor.fetchall()
    writer.writerow(["Cycles"])
    if cycles:
        writer.writerow([desc[0] for desc in cursor.description])
        for row in cycles:
            writer.writerow(row)

    cursor.close()
    conn.close()

    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=export.csv"})
