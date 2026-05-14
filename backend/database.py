from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get database connection string from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# Ensure DATABASE_URL exists before creating engine
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL is not set")

# Create connection to PostgreSQL database
engine = create_engine(DATABASE_URL)

# Create database session factory
# Each session represents a connection/conversation with the database
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class that all database models will inherit from
Base = declarative_base()