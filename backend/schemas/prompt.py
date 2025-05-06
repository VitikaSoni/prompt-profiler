from pydantic import BaseModel, ConfigDict, field_serializer
from typing import Optional
from datetime import datetime


class PromptBase(BaseModel):
    name: str


class PromptCreate(PromptBase):
    pass


class Prompt(PromptBase):
    id: int
    user_id: int
    created_at: datetime

    @field_serializer("created_at")
    def serialize_dt(self, dt: datetime, _info):
        return dt.isoformat() if dt else None

    model_config = ConfigDict(from_attributes=True)
