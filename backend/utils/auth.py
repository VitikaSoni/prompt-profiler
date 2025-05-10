from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from utils.firebase import get_firebase_user, verify_firebase_token
from crud import user as crud_user
from schemas.user import UserCreate
from database import get_db
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """
    Verify Firebase token and return the corresponding user from our database.
    If the user doesn't exist in our database, create it.
    """
    token = credentials.credentials
    firebase_uid = await verify_firebase_token(token)
    firebase_user = await get_firebase_user(firebase_uid)

    # Check if user exists in our database
    user = crud_user.get_user_by_firebase_uid(db, firebase_uid)

    if not user:
        # Create user in our database if they don't exist
        user_data = UserCreate(
            email=firebase_user.email,
            firebase_uid=firebase_uid,
        )
        user = crud_user.create_user_from_firebase(db, user_data, firebase_uid)

    return user
