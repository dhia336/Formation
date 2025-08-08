from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, formateur, cycle, participant

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(formateur.router, prefix="/api", tags=["formateurs"])
app.include_router(cycle.router, prefix="/api", tags=["cycles"])
app.include_router(participant.router, prefix="/api", tags=["participants"])

@app.get("/")
def read_root():
    return {"message": "Training Center Management System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000 )
