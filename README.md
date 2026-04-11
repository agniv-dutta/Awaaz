# Awaaz

Awaaz is a community intelligence and volunteer dispatch platform backend built with FastAPI, PostgreSQL (PostGIS), Redis, Celery, and SQLAlchemy 2.0.

This repository currently contains the backend implementation in the `backend/` directory, including:
- Authentication and JWT-based access control
- Report ingestion and need aggregation flows
- Volunteer registration and dispatch lifecycle
- Analytics endpoints and real-time notification support
- Async background jobs (worker + beat)
- Alembic migrations, seed script, and basic API tests

## Tech Stack

- Python 3.11+
- FastAPI (async)
- PostgreSQL + PostGIS
- SQLAlchemy 2.0 + asyncpg
- Alembic
- Redis
- Celery
- Pydantic v2
- Pytest + pytest-asyncio

## Repository Layout

```text
.
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── tasks/
│   │   └── utils/
│   ├── alembic/
│   ├── scripts/
│   ├── tests/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── alembic.ini
├── implementation_plan.md
└── walkthrough.md
```

## Quick Start (Docker)

From the repository root:

```bash
cd backend
cp .env.example .env
docker compose up --build
```

API will be available at:
- http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Run Migrations

In a separate terminal:

```bash
cd backend
docker compose exec awaaz-api alembic upgrade head
```

### Seed Development Data

```bash
cd backend
docker compose exec awaaz-api python scripts/seed.py
```

### Run Tests

```bash
cd backend
pytest
```

## Services (docker-compose)

- `db`: PostGIS-enabled PostgreSQL
- `redis`: Redis for caching/broker
- `awaaz-api`: FastAPI application
- `awaaz-worker`: Celery worker
- `awaaz-beat`: Celery beat scheduler

## Implementation Status

The backend implementation described in `implementation_plan.md` and validated in `walkthrough.md` is complete across:
- Foundation and infra setup
- Models, migrations, and schemas
- Core services and matcher utilities
- Background task processing
- API routers and app lifecycle wiring
- Test scaffolding and seed script

## Notes

- The compose setup expects a `.env` file inside `backend/`.
- PostGIS is provided via `postgis/postgis:15-3.3` in `backend/docker-compose.yml`.
