from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from schemas import ApplicationCreate, ApplicationUpdate
import crud
import models

# Create database tables if they do not already exist
Base.metadata.create_all(bind=engine)

# Create FastAPI application instance
app = FastAPI()

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency function for database sessions
# Opens DB session before request and closes afterward
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Root test route
@app.get("/")
def root():
    return {"message": "Backend running"}


# Create new application route
@app.post("/applications")
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db)
):
    # Send validated request data to CRUD function
    return crud.create_application(db, application)


# Get all saved applications route
@app.get("/applications")
def get_applications(
    db: Session = Depends(get_db)
):
    return crud.get_applications(db)

# Update existing application route
@app.put("/applications/{app_id}")
def update_application(
    app_id: int,
    application: ApplicationUpdate,
    db: Session = Depends(get_db)
):
    #Update application
    updated = crud.update_application(db, app_id, application)

    if not updated:
        return {"error": "Application not found"}
    
    return updated

# Delete application route
@app.delete("/applications/{app_id}")
def delete_application(
    app_id: int,
    db: Session = Depends(get_db)
):
    #Delete application
    deleted = crud.delete_application(db, app_id)

    if not deleted:
        return {"error": "Application not found"}
    
    return {"message": "Application deleted successfully"}