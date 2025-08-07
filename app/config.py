from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_NAME = os.getenv("DB_NAME", "bf_arabe1")
    SECRET_KEY = os.getenv("SECRET_KEY", "secret-key")