from database import engine, Base
from models.user import User
from models.prompt import Prompt
from models.version import Version
from models.test_case import TestCase


def create_tables():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    create_tables()
