from sqlalchemy import Column, Integer, String, Text, Date
from database import Base

# Database table model for job applications
class Application(Base):
    # Name of the PostgreSQL table
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    position = Column(String, nullable=False)
    status = Column(String, nullable=False)
    date_applied = Column(Date, nullable=False)
    notes = Column(Text)