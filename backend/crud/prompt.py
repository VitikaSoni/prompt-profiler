from sqlalchemy.orm import Session
from models import Prompt
from schemas.prompt import PromptCreate
from typing import Optional


def get_prompts(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(Prompt)
        .filter(Prompt.user_id == user_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_prompt(db: Session, prompt_id: int, user_id: int) -> Optional[Prompt]:
    return (
        db.query(Prompt)
        .filter(Prompt.id == prompt_id, Prompt.user_id == user_id)
        .first()
    )


def create_prompt(db: Session, name: str, user_id: int) -> Prompt:
    db_prompt = Prompt(name=name, user_id=user_id)
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt


def delete_prompt(db: Session, prompt_id: int, user_id: int) -> bool:
    prompt = get_prompt(db, prompt_id, user_id)
    if prompt:
        db.delete(prompt)
        db.commit()
        return True
    return False


def rename_prompt(
    db: Session, prompt_id: int, user_id: int, new_name: str
) -> Optional[Prompt]:
    prompt = get_prompt(db, prompt_id, user_id)
    if prompt:
        prompt.name = new_name
        db.commit()
        db.refresh(prompt)
        return prompt
    return None
