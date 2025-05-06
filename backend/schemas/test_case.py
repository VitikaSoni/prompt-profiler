from pydantic import BaseModel
from typing import Optional


class TestCaseBase(BaseModel):
    user_message: str


class TestCaseCreate(TestCaseBase):
    pass


class TestCaseUpdate(BaseModel):
    user_message: Optional[str] = None


class TestCase(TestCaseBase):
    id: int
    prompt_id: int

    class Config:
        orm_mode = True
