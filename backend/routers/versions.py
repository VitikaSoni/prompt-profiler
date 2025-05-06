from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from crud import version as crud
from schemas.version import Version, VersionCreate

router = APIRouter()


@router.post("/", response_model=Version)
def create_version(
    version: VersionCreate,
    db: Session = Depends(get_db),
):
    return crud.create_version(db=db, version=version)


@router.get("/prompt/{prompt_id}", response_model=List[Version])
def get_versions_by_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
):
    return crud.get_versions_by_prompt(db=db, prompt_id=prompt_id)


@router.get("/{version_id}", response_model=Version)
def get_version(
    version_id: int,
    db: Session = Depends(get_db),
):
    db_version = crud.get_version(db, version_id=version_id)
    if db_version is None:
        raise HTTPException(status_code=404, detail="Version not found")
    return db_version


@router.get("/current/{prompt_id}", response_model=Version)
def get_current_version(
    prompt_id: int,
    db: Session = Depends(get_db),
):
    db_version = crud.get_current_version(db, prompt_id=prompt_id)
    if db_version is None:
        raise HTTPException(status_code=404, detail="No versions found for this prompt")
    return db_version
