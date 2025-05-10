from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_firebase_uid(db: Session, firebase_uid: str):
    return db.query(User).filter(User.firebase_uid == firebase_uid).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user_from_firebase(db: Session, user: UserCreate, firebase_uid: str):
    """
    Create a new user from Firebase authentication.
    """
    db_user = User(
        email=user.email,
        firebase_uid=firebase_uid,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
