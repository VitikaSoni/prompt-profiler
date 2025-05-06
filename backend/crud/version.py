from sqlalchemy.orm import Session
from models.version import Version
from schemas.version import VersionCreate
from typing import List, Optional


def create_version(db: Session, version: VersionCreate) -> Version:
    # Get the latest version number for this prompt
    latest_version = (
        db.query(Version)
        .filter(Version.prompt_id == version.prompt_id)
        .order_by(Version.number.desc())
        .first()
    )

    # Calculate the new version number
    new_version_number = 1 if latest_version is None else latest_version.number + 1

    # Create the new version
    db_version = Version(
        number=new_version_number,
        system_prompt=version.system_prompt,
        prompt_id=version.prompt_id,
    )
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version


def get_versions_by_prompt(db: Session, prompt_id: int) -> List[Version]:
    return (
        db.query(Version)
        .filter(Version.prompt_id == prompt_id)
        .order_by(Version.number.desc())
        .all()
    )


def get_version(db: Session, version_id: int) -> Version:
    return db.query(Version).filter(Version.id == version_id).first()


def get_current_version(db: Session, prompt_id: int) -> Optional[Version]:
    """
    Get the current (latest) version of a prompt.
    Returns None if no versions exist for the prompt.
    """
    return (
        db.query(Version)
        .filter(Version.prompt_id == prompt_id)
        .order_by(Version.number.desc())
        .first()
    )
