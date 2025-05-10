from sqlalchemy.orm import Session
from schemas.run_log import RunLogCreate
from models.run_log import RunLog
from typing import Optional


def create_run_log(db: Session, run_log: RunLogCreate):
    db_run_log = RunLog(
        user_id=run_log.user_id,
        prompt_id=run_log.prompt_id,
        system_prompt=run_log.system_prompt,
        user_message=run_log.user_message,
        response=run_log.response,
    )
    db.add(db_run_log)
    db.commit()
