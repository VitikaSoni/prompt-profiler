from pydantic import BaseModel


class RunLogBase(BaseModel):
    user_id: int
    prompt_id: int
    system_prompt: str
    user_message: str
    response: str


class RunLogCreate(RunLogBase):
    pass
