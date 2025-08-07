import mysql.connector
from app.config import Config
from app.security import get_password_hash

def hash_admin_passwords():
    conn = mysql.connector.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, pass FROM admin")
    admins = cursor.fetchall()
    for admin in admins:
        admin_id = admin["id"]
        plain_pass = admin["pass"]
        # Only hash if not already a bcrypt hash
        if not (plain_pass.startswith("$2b$") or plain_pass.startswith("$2a$")):
            hashed = get_password_hash(plain_pass)
            cursor2 = conn.cursor()
            cursor2.execute("UPDATE admin SET pass = %s WHERE id = %s", (hashed, admin_id))
            cursor2.close()
            print(f"Updated admin id {admin_id} password to bcrypt hash.")
    conn.commit()
    cursor.close()
    conn.close()
    print("All admin passwords updated.")

if __name__ == "__main__":
    hash_admin_passwords()
