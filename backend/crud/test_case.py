from sqlalchemy.orm import Session
from models.test_case import TestCase
from schemas.test_case import TestCaseCreate, TestCaseUpdate


def create_test_case(
    db: Session, test_case: TestCaseCreate, prompt_id: int
) -> TestCase:
    db_test_case = TestCase(
        user_message=test_case.user_message,
        prompt_id=prompt_id,
    )
    db.add(db_test_case)
    db.commit()
    db.refresh(db_test_case)
    return db_test_case


def get_test_case(db: Session, test_case_id: int) -> TestCase:
    return db.query(TestCase).filter(TestCase.id == test_case_id).first()


def get_test_cases_by_prompt(db: Session, prompt_id: int) -> list[TestCase]:
    return db.query(TestCase).filter(TestCase.prompt_id == prompt_id).all()


def update_test_case(
    db: Session, test_case_id: int, test_case: TestCaseUpdate
) -> TestCase:
    db_test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if db_test_case:
        for key, value in test_case.dict(exclude_unset=True).items():
            setattr(db_test_case, key, value)
        db.commit()
        db.refresh(db_test_case)
    return db_test_case


def delete_test_case(db: Session, test_case_id: int) -> bool:
    db_test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if db_test_case:
        db.delete(db_test_case)
        db.commit()
        return True
    return False
