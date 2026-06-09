from email.mime import application

from sqlalchemy.orm import Session
from models import Application
from schemas import ApplicationCreate, ApplicationUpdate
from datetime import date

# Create and save a new application in the database
def create_application(db: Session, app: ApplicationCreate):

    # Convert schema to dict first
    data = app.model_dump()

    # Ensure required DB fields are always valid
    data["date_applied"] = data.get("date_applied") or date.today()

    # Create DB model safely
    db_application = Application(**data)

    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return db_application

#Find existing application
def update_application(db: Session, app_id: int, updated_app: ApplicationUpdate):

    application = db.query(Application).filter(Application.id == app_id).first()

    if not application:
        return None

    # Only get fields user actually sent
    update_data = updated_app.model_dump(exclude_unset=True)

    # Apply only provided fields
    for key, value in update_data.items():
        setattr(application, key, value)

    db.commit()
    db.refresh(application)

    return application

# Retrieve all applications from database
def get_applications(db: Session):

    # Query all rows from applications table
    return db.query(Application).all()

# Delete an application
def delete_application(db: Session, app_id: int):
    # Find application by ID
    application = db.query(Application).filter(
        Application.id == app_id
    ).first()

    # Return None if not found
    if not application:
        return None
    
    # Delete application from session
    db.delete(application)

    # Save changes to database
    db.commit()

    return application

# Get one application by ID
def get_application(
    db: Session,
    app_id: int
):

    return (
        db.query(Application).filter(Application.id == app_id)
        .first()
    )