# Awaaz

![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-CA3E6C?logo=sqlalchemy&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-2C3E50?logo=alembic&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?logo=pydantic&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

Awaaz is a community intelligence and volunteer dispatch platform. The repository contains a SQLite-backed FastAPI backend and a Vite + React frontend.

## What This Repo Contains

- Backend authentication with JWT tokens
- Report intake, need creation, and volunteer dispatch matching
- Analytics endpoints and websocket notifications
- SQLite persistence with Alembic migrations
- Background processing implemented with FastAPI-native async tasks
- Frontend app that talks to the backend API under `/api/v1`

## Project Layout

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
│   ├── requirements.txt
│   └── alembic.ini
├── frontend/
└── implementation_plan.md
```

## Tech Stack

Backend:
- FastAPI
- SQLite with `aiosqlite`
- SQLAlchemy 2.0
- Alembic
- Pydantic v2
- JWT auth with `python-jose`
- Passlib password hashing

Frontend:
- React 19
- TypeScript
- Vite
- TanStack Query
- React Router
- Axios
- Recharts
- Socket.IO client

## Run the Backend

Use a separate terminal for the backend.

### First-time setup

```bat
cd C:\Users\Agniv Dutta\Awaaz\backend
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
copy .env.example .env
python -m alembic upgrade head
python scripts\seed.py
```

Set `SECRET_KEY` inside `backend\.env` before starting the app.
If you already have an existing backend virtual environment at `backend\venv`, activate that instead of creating `.venv`.

### Start the backend

```bat
cd C:\Users\Agniv Dutta\Awaaz\backend
.venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/api/v1/health

## Run the Frontend

Use a second terminal for the frontend.

### First-time setup

```bat
cd C:\Users\Agniv Dutta\Awaaz\frontend
npm install
```

### Start the frontend

```bat
cd C:\Users\Agniv Dutta\Awaaz\frontend
npm run dev
```

Frontend URLs:
- Vite dev server: usually http://localhost:5173
- API target: http://localhost:8000/api/v1

### Frontend scripts

- `npm run dev` starts the app in development mode
- `npm run build` creates a production build
- `npm run lint` runs ESLint
- `npm run preview` serves the production build locally

## Environment Variables

### Backend `.env`

```env
DATABASE_URL=sqlite+aiosqlite:///./awaaz.db
SECRET_KEY=replace-with-a-random-32-char-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
GOOGLE_VISION_API_KEY=
GCS_BUCKET_NAME=
```

### Frontend `.env`

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
```

## Database Notes

- SQLite database file: `backend/awaaz.db`
- Test database file: `backend/awaaz_test.db`
- Alembic migration: `backend/alembic/versions/0001_initial.py`
- No Docker, Postgres, Redis, or Celery are required for local development

## API Reference

All API routes are mounted under `/api/v1` unless stated otherwise.

| Area | Method | Endpoint | Purpose |
| --- | --- | --- | --- |
| Root | GET | `/` | Basic welcome message |
| Health | GET | `/api/v1/health` | Liveness check |
| Auth | POST | `/api/v1/auth/register` | Create a new user |
| Auth | POST | `/api/v1/auth/login` | Issue JWT access token |
| Reports | POST | `/api/v1/reports/` | Create a report |
| Reports | POST | `/api/v1/reports/submit` | Create a report and schedule background processing |
| Reports | GET | `/api/v1/reports/` | List reports |
| Reports | GET | `/api/v1/reports/{report_id}` | Fetch a single report |
| Needs | POST | `/api/v1/needs/` | Create a need |
| Needs | GET | `/api/v1/needs/` | List needs |
| Needs | POST | `/api/v1/needs/{need_id}/dispatch` | Schedule dispatch creation for a need |
| Volunteers | POST | `/api/v1/volunteers/` | Create a volunteer profile |
| Volunteers | PUT | `/api/v1/volunteers/location` | Update volunteer coordinates |
| Dispatches | POST | `/api/v1/dispatches/{dispatch_id}/respond` | Accept or decline a dispatch |
| Analytics | GET | `/api/v1/analytics/summary` | Aggregate counts and dashboard stats |
| Analytics | GET | `/api/v1/analytics/heatmap` | Return heatmap points |
| WebSockets | WS | `/api/v1/ws/notifications` | Real-time notification channel |

### Health and root

| Method | Endpoint | Response |
| --- | --- | --- |
| GET | `/` | Welcome message |
| GET | `/api/v1/health` | `{ "status": "ok" }` |

### Auth

| Method | Endpoint | Notes |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Creates a user and returns the user payload |
| POST | `/api/v1/auth/login` | Accepts form data and returns JWT tokens |

Register request body:

```json
{
	"email": "user@example.com",
	"name": "User Name",
	"phone": "1234567890",
	"role": "admin",
	"password": "strongpassword",
	"ward_id": "uuid-optional"
}
```

Login form fields:
- `username` = email
- `password` = password

### Reports

| Method | Endpoint | Notes |
| --- | --- | --- |
| POST | `/api/v1/reports/` | Creates a report |
| POST | `/api/v1/reports/submit` | Creates a report and schedules background parsing |
| GET | `/api/v1/reports/` | Lists reports with optional pagination and ward filter |
| GET | `/api/v1/reports/{report_id}` | Fetches one report by ID |

Create report request body:

```json
{
	"source": "DIRECT_ENTRY",
	"raw_text": "Need medical supplies and food support",
	"ward_id": "uuid"
}
```

Query parameters for `GET /api/v1/reports/`:
- `ward_id` optional UUID
- `skip` optional integer, default `0`
- `limit` optional integer, default `100`

### Needs

| Method | Endpoint | Notes |
| --- | --- | --- |
| POST | `/api/v1/needs/` | Creates a need |
| GET | `/api/v1/needs/` | Lists needs with optional pagination and ward filter |
| POST | `/api/v1/needs/{need_id}/dispatch` | Schedules volunteer matching and dispatch creation |

Create need request body:

```json
{
	"category": "MEDICAL",
	"description": "Urgent medical supplies required",
	"ward_id": "uuid",
	"location_lat": 0.5,
	"location_lng": 0.5,
	"urgency": "HIGH"
}
```

Query parameters for `GET /api/v1/needs/`:
- `ward_id` optional UUID
- `skip` optional integer, default `0`
- `limit` optional integer, default `100`

### Volunteers

| Method | Endpoint | Notes |
| --- | --- | --- |
| POST | `/api/v1/volunteers/` | Creates a volunteer profile |
| PUT | `/api/v1/volunteers/location` | Updates the current volunteer location |

Create volunteer request body:

```json
{
	"languages": ["Hindi", "English"],
	"availability_schedule": {
		"mon": ["09:00-17:00"],
		"tue": ["09:00-17:00"]
	},
	"max_radius_km": 5,
	"home_ward_id": "uuid",
	"skills": ["MEDICAL", "LOGISTICS"]
}
```

Update location request body:

```json
{
	"lat": 19.0760,
	"lng": 72.8777
}
```

### Dispatches

| Method | Endpoint | Notes |
| --- | --- | --- |
| POST | `/api/v1/dispatches/{dispatch_id}/respond` | Accepts or declines a dispatch |

Dispatch response body:

```json
{
	"action": "accept",
	"notes": "On my way"
}
```

### Analytics

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/v1/analytics/summary` | Returns dashboard totals and activity counts |
| GET | `/api/v1/analytics/heatmap` | Returns weighted heatmap points |

Both endpoints accept an optional `ward_id` query parameter.

### WebSockets

| Protocol | Endpoint | Notes |
| --- | --- | --- |
| WS | `/api/v1/ws/notifications` | Bidirectional notifications channel |

Connection behavior:
- Connect to the websocket endpoint and keep the socket open to receive notifications
- The server accepts text messages and maintains the connection until the client disconnects

## Background Processing

The backend does not use Redis or Celery. Background work is handled through FastAPI async helpers:

- Report processing runs after `POST /api/v1/reports/submit`
- Dispatch generation runs after `POST /api/v1/needs/{need_id}/dispatch`
- Periodic tasks run inside the FastAPI lifespan:
	- need aggregation
	- reliability updates
	- stale dispatch reminders

## Testing

Run the backend tests from the backend folder:

```bat
cd C:\Users\Agniv Dutta\Awaaz\backend
.venv\Scripts\activate
python -m pytest -q
```

The test suite currently covers:
- API root
- Health endpoint
- User registration route

## Seed Data

The seed script populates:
- Sample wards
- Admin user
- Volunteer user and profile
- Report
- Need
- Dispatch

Run it after migrations:

```bat
cd C:\Users\Agniv Dutta\Awaaz\backend
.venv\Scripts\activate
python scripts\seed.py
```

## Troubleshooting

- If `alembic` is not recognized, run `python -m alembic upgrade head` from the activated backend venv.
- If `email-validator` is missing, reinstall backend dependencies with `python -m pip install -r requirements.txt`.
- If password hashing errors appear, reinstall the backend dependencies so `passlib` and its crypto backend are refreshed in the active venv.
- If the frontend cannot reach the backend, confirm the backend is running on port `8000` and `VITE_API_BASE_URL` points to `http://localhost:8000/api/v1`.

## Reference Docs

- [walkthrough.md](walkthrough.md) contains the canonical step-by-step local run instructions.
- [implementation_plan.md](implementation_plan.md) documents the original backend build plan.
