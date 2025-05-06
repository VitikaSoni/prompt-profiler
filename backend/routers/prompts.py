from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from database import get_db
from crud import prompt as prompt_crud
from schemas.prompt import Prompt as PromptSchema, PromptCreate
from models.prompt import Prompt
from utils.auth import get_current_user

router = APIRouter()


class RenamePromptRequest(BaseModel):
    new_name: str


@router.post("/", response_model=PromptSchema)
def create_prompt(
    prompt: PromptCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return prompt_crud.create_prompt(db=db, name=prompt.name, user_id=current_user.id)


@router.get("/", response_model=List[PromptSchema])
def get_prompts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(Prompt).filter(Prompt.user_id == current_user.id).all()


@router.delete("/{prompt_id}", response_model=bool)
def delete_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    success = prompt_crud.delete_prompt(
        db=db, prompt_id=prompt_id, user_id=current_user.id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return True


@router.patch("/{prompt_id}/rename", response_model=PromptSchema)
def rename_prompt(
    prompt_id: int,
    request: RenamePromptRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    prompt = prompt_crud.rename_prompt(
        db=db, prompt_id=prompt_id, user_id=current_user.id, new_name=request.new_name
    )
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt
