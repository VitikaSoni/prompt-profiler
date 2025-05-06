from pydantic import BaseModel
from datetime import datetime


class VersionBase(BaseModel):
    system_prompt: str
    prompt_id: int


class VersionCreate(VersionBase):
    pass


class Version(VersionBase):
    id: int
    number: int
    created_at: datetime

    class Config:
        from_attributes = True
