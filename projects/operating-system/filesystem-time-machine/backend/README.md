# Backend Setup

## 1. Create and activate virtual environment

On Windows:
```
python -m venv venv
.\venv\Scripts\activate
```

## 2. Install dependencies
```
pip install fastapi uvicorn watchdog
```

## 3. Run the FastAPI server
```
uvicorn api.main:app --reload
```

Visit http://127.0.0.1:8000/health to check the health endpoint. 