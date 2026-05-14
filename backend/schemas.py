from pydantic import BaseModel
from datetime import date

# Schema used for validating incoming application data
# FastAPI uses this to validate request bodies automatically
class ApplicationCreate(BaseModel):
    company_name: str
    position: str
    status: str
    date_applied: date | None = None
    notes: str | None = None