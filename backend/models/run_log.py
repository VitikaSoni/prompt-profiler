from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class RunLog(Base):
    __tablename__ = "run_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    prompt_id = Column(
        Integer, ForeignKey("prompts.id", ondelete="SET NULL"), nullable=True
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    system_prompt = Column(String)
    user_message = Column(String)
    response = Column(String)

    user = relationship("User", back_populates="run_logs")
    prompt = relationship("Prompt", back_populates="run_logs")
