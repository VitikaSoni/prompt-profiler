from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    email: Optional[str] = None
    firebase_uid: Optional[str] = None


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: str
    firebase_uid: str
