from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import test_case as test_case_crud
from schemas.run import RunRequest, RunResponse, RunTestCase
from utils.auth import get_current_user
from models.user import User
import os
from openai import AzureOpenAI, OpenAIError
from dotenv import load_dotenv

load_dotenv()

# Initialize Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)

deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
if not deployment_name:
    raise RuntimeError("AZURE_OPENAI_DEPLOYMENT_NAME is missing.")

router = APIRouter()


@router.post("/prompt/{prompt_id}", response_model=RunResponse)
async def run_prompt(
    prompt_id: int,
    request: RunRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run the system prompt against all test cases for a given prompt.

    - **prompt_id**: ID of the prompt to run
    - **system_prompt**: The system prompt to use for running
    """
    system_prompt = request.system_prompt
    if not system_prompt:
        raise HTTPException(status_code=400, detail="System prompt is required")

    test_cases = test_case_crud.get_test_cases_by_prompt(db, prompt_id)

    if not test_cases:
        raise HTTPException(
            status_code=404, detail="No test cases found for this prompt"
        )

    results = []

    for tc in test_cases:
        try:
            response = client.chat.completions.create(
                model=deployment_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": tc.user_message},
                ],
                temperature=0.7,
            )
            output_text = response.choices[0].message.content.strip()

            results.append(
                RunTestCase(
                    test_case_id=tc.id,
                    user_message=tc.user_message,
                    output=output_text,
                )
            )
        except OpenAIError as e:
            results.append(
                RunTestCase(
                    test_case_id=tc.id,
                    user_message=tc.user_message,
                    output=f"OpenAI Error: {str(e)}",
                )
            )
        except Exception as e:
            results.append(
                RunTestCase(
                    test_case_id=tc.id,
                    user_message=tc.user_message,
                    output=f"Internal Error: {str(e)}",
                )
            )

    return RunResponse(results=results)
