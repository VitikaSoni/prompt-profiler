from pydantic import BaseModel
from typing import List


class RunTestCase(BaseModel):
    test_case_id: int
    user_message: str
    output: str


class RunResponse(BaseModel):
    results: List[RunTestCase]


class RunRequest(BaseModel):
    system_prompt: str
