# Awaaz

Awaaz is a community intelligence and volunteer dispatch backend built with FastAPI, SQLite, SQLAlchemy 2.0, Alembic, and Pydantic v2.

## What’s Included

- JWT auth and user registration
- Report intake and simple background processing
- Need creation and volunteer dispatch matching
- Analytics and websocket notification scaffolding
- Alembic migrations, seed data, and async tests

## Layout

```text
.
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── scripts/
│   ├── tests/
│   ├── requirements.txt
│   └── alembic.ini
├── implementation_plan.md
└── walkthrough.md
```

## Run

Follow the exact backend steps in [walkthrough.md](walkthrough.md).

## API

- Base URL: http://localhost:8000
- Health: http://localhost:8000/api/v1/health
- Docs: http://localhost:8000/docs

## Notes

- The backend stores data in `backend/awaaz.db`.
- The API is mounted under `/api/v1` for compatibility with the frontend.
