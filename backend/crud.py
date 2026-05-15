from sqlalchemy.orm import Session
from models import Application
from schemas import ApplicationCreate

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


# Retrieve all applications from database
def get_applications(db: Session):

    # Query all rows from applications table
    return db.query(Application).all()