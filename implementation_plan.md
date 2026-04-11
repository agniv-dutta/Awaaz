# Awaaz Backend Implementation Plan

This plan details the step-by-step implementation of the Awaaz backend according to the provided specifications. We will strictly follow the execution order and ensure each step runs without import errors before proceeding to the next.

## Architecture & Stack
- **Stack:** Python 3.11+, FastAPI (async, lifespan), PostgreSQL (asyncpg) + SQLAlchemy 2.0, Alembic, Redis (aioredis) + Celery, Pydantic v2, JWT auth, WebSockets.

## Execution Steps

### Step 1: Foundation
- Create exact project directory structure.
- `requirements.txt` with exact dependencies.
- `Dockerfile` and `docker-compose.yml` (PostgreSQL with PostGIS, Redis, API, Worker, Beat).
- `.env.example` with required variables.

### Step 2: Core Infrastructure (`app/core/`)
- `config.py`: Pydantic settings loading from `.env`.
- `database.py`: Async SQLAlchemy engine and session factory.
- `redis.py`: Async Redis client singleton.
- `security.py`: JWT auth and password hashing.
- `celery_app.py`: Celery instance configuration.
- `storage.py`: Stub or wrapper for GCS/S3.

### Step 3: Database Models & Migrations (`app/models/` & `alembic/`)
- Base model setup.
- Implement `User`, `Ward`, `Report`, `Need`, `Volunteer`, `Dispatch` models.
- Initialize Alembic.
- Generate and apply initial migration (including PostGIS extension if feasible, or note instructions for it).

### Step 4: Schemas (`app/schemas/`)
- Pydantic v2 schemas for all domains (`auth.py`, `report.py`, `need.py`, `volunteer.py`, `dispatch.py`, `analytics.py`).

### Step 5: Core Services (`app/services/matcher.py` & `app/utils/geo.py`)
- Implement `haversine` in `geo.py`.
- Implement `compute_match_score` and `get_top_matches` in `matcher.py`.

### Step 6: Remaining Services (`app/services/`)
- Implement business logic for auth, reports, needs, volunteers, dispatch, and analytics.
- Integration placeholder for OCR service.

### Step 7: Background Tasks (`app/tasks/`)
- `report_processor`: Keyword extraction.
- `need_aggregator`: Grouping logic by distance (500m logic).
- `dispatch_reminder`: Reminder triggers.
- `reliability_updater`: Score calculations.

### Step 8: API Routers & App Factory (`app/routers/` & `app/main.py`)
- Implement endpoints in individual router files.
- WebSocket endpoint for notifications.
- Combine in `main.py` with lifespan config.

### Step 9: Testing (`tests/`)
- Pytest configuration (`conftest.py`).
- Write async tests for matcher, reports pipeline, and dispatch logic.

### Step 10: Seeding (`scripts/seed.py`)
- Script to populate the database with dummy Wards, Users, Volunteers, Needs, and Dispatches.

## User Review Required

> [!IMPORTANT]
> The database requires the PostGIS extension. The standard `postgres:15` image does not include it, but `postgis/postgis:15-3.3` does. I will use the PostGIS enabled image in the `docker-compose.yml`. Please let me know if you would prefer otherwise.
>
> I will proceed with Step 1 as soon as you approve the plan!
