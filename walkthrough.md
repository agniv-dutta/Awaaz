# Awaaz Backend Implementation Walkthrough

The backend for **Awaaz**, a community intelligence and volunteer dispatch platform, now runs on SQLite with a single local Python environment.

## Completed Features

### 1. Project Infrastructure
The backend is set up with `requirements.txt`, SQLite configuration, and `.env.example`. Core settings for the database and security live in `app/core/`.

### 2. Database Models & Migrations
The SQLAlchemy 2.0 models now use SQLite-friendly string IDs and JSON columns where needed. The schema covers:
- `users` and `wards`
- `reports`
- `needs` and `volunteers`
- `dispatches`

Alembic has a fresh initial migration.

### 3. Pydantic Schemas
Strict data validation is implemented with Pydantic v2. Schemas are split across domain files (`auth`, `report`, `need`, `volunteer`, `dispatch`, `analytics`).

### 4. Core Services
Business logic in `app/services/` covers:
- **Auth**: User creation and JWT login.
- **Reports & Needs**: Report ingestion, urgency scoring, and need creation.
- **Volunteers & Dispatch**: Volunteer registration, matching, and dispatch creation.
- **Analytics**: Basic summary and heatmap aggregation.

### 5. Background Tasks
Background processing now uses FastAPI-style async helpers instead of Celery:
- `report_processor`: Parse report content.
- `need_aggregator`: Periodic need grouping stub.
- `dispatch_reminder`: Auto-decline stale dispatches.
- `reliability_updater`: Recompute volunteer reliability scores.

### 6. Routers & Endpoints
The API is exposed under `/api/v1` through routers in `app/routers/`:
- Auth, Reports, Needs, Volunteers, Dispatches, and Analytics endpoints.
- WebSocket notification support at `/api/v1/ws/notifications`.
- Health check at `/api/v1/health`.

### 7. Testing & Seeding
- `tests/` includes async test setup using SQLite.
- `scripts/seed.py` populates `awaaz.db` with starter data.

## Run Steps

1. `cd Awaaz/backend`
2. `python -m venv .venv`
3. `.venv\Scripts\activate` on Windows or `source .venv/bin/activate` on Mac/Linux
4. `pip install -r requirements.txt`
5. `cp .env.example .env` and set `SECRET_KEY` to any random string
6. `alembic upgrade head`
7. `python scripts/seed.py`
8. `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

That is the complete local setup. No Docker, no Redis, and no Postgres.

The API is available at http://localhost:8000 and the docs are at http://localhost:8000/docs.
