# FastAPI Project

A basic FastAPI project setup with essential configurations.

## Setup

1. Create a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

Start the server with:

```bash
uvicorn main:app --reload
```

The application will be available at:

- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative API Documentation: http://localhost:8000/redoc

## Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint
