from sqlalchemy.orm import Session
from models import Application
from schemas import ApplicationCreate, ApplicationUpdate

# Create and save a new application in the database
def create_application(db: Session, app: ApplicationCreate):

    # Convert incoming schema data into Application model object
    db_application = Application(**app.dict())

    # Add object to current database session
    db.add(db_application)

    # Save changes to database
    db.commit()

    # Refresh object so updated DB values are available immediately
    db.refresh(db_application)

    return db_application

def update_application(db: Session, app_id: int, updated_app: ApplicationUpdate):
    #Find existing application
    application = db.query(Application).filter(
        Application.id == app_id
    ).first()

    #Return None if not found
    if not application:
        return None
    
    #Update fields
    application.company = updated_app.company_name
    application.role = updated_app.position
    application.status = updated_app.status
    application.date_applied = updated_app.date_applied
    application.notes = updated_app.notes

    # Save changes
    db.commit()

    # Refresh updatedobject
    db.refresh(application)

    return application

# Retrieve all applications from database
def get_applications(db: Session):

    # Query all rows from applications table
    return db.query(Application).all()