from pydantic import BaseModel
from datetime import date

# Schema used when creating a new application
# FastAPI uses this to validate request bodies automatically
class ApplicationCreate(BaseModel):
    company_name: str
    position: str
    status: str
    date_applied: date | None = None
    notes: str | None = None

#Schema used when updating an existing application
class ApplicationUpdate(BaseModel):
    company_name: str
    position: str
    status: str
    date_applied: date | None = None
    notes: str | None = None