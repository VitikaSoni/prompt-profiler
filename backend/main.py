from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, prompts, test_cases, versions, run
from database import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS"),  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(prompts.router, prefix="/prompts", tags=["prompts"])
app.include_router(test_cases.router, prefix="/test-cases", tags=["test-cases"])
app.include_router(versions.router, prefix="/versions", tags=["versions"])
app.include_router(run.router, prefix="/run", tags=["run"])


@app.get("/")
async def root():
    return {"message": "Welcome to the Prompt Profiler API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
