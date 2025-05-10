from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="prompts")
    test_cases = relationship(
        "TestCase", back_populates="prompt", cascade="all, delete-orphan"
    )
    versions = relationship(
        "Version", back_populates="prompt", cascade="all, delete-orphan"
    )
    run_logs = relationship("RunLog", back_populates="prompt")
