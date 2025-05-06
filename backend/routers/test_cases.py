from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from crud import test_case as crud
from schemas import test_case as schemas
from utils.auth import get_current_user
from models.user import User

router = APIRouter()


@router.post("/", response_model=schemas.TestCase)
def create_test_case(
    test_case: schemas.TestCaseCreate,
    prompt_id: int = Query(
        ..., description="ID of the prompt this test case belongs to"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new test case for a specific prompt.

    - **prompt_id**: ID of the prompt this test case belongs to (required)
    - **user_message**: The input message for the test case
    - **expected_output**: The expected output for the test case
    """
    return crud.create_test_case(db=db, test_case=test_case, prompt_id=prompt_id)


@router.get("/{test_case_id}", response_model=schemas.TestCase)
def read_test_case(
    test_case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_test_case = crud.get_test_case(db, test_case_id=test_case_id)
    if db_test_case is None:
        raise HTTPException(status_code=404, detail="Test case not found")
    return db_test_case


@router.get("/prompt/{prompt_id}", response_model=List[schemas.TestCase])
def read_test_cases_by_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.get_test_cases_by_prompt(db, prompt_id=prompt_id)


@router.put("/{test_case_id}", response_model=schemas.TestCase)
def update_test_case(
    test_case_id: int,
    test_case: schemas.TestCaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_test_case = crud.update_test_case(
        db, test_case_id=test_case_id, test_case=test_case
    )
    if db_test_case is None:
        raise HTTPException(status_code=404, detail="Test case not found")
    return db_test_case


@router.delete("/{test_case_id}")
def delete_test_case(
    test_case_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = crud.delete_test_case(db, test_case_id=test_case_id)
    if not success:
        raise HTTPException(status_code=404, detail="Test case not found")
    return {"message": "Test case deleted successfully"}
