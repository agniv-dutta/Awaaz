import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.routers import auth, reports, needs, volunteers, dispatches, analytics, websockets
from app.services.background_tasks import dispatch_reminder, need_aggregator, reliability_updater

logger = logging.getLogger(__name__)


async def _run_periodic_task(task_coro, interval_seconds: int) -> None:
    while True:
        try:
            await task_coro()
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("Periodic task failed: %s", getattr(task_coro, "__name__", "task"))
        await asyncio.sleep(interval_seconds)

@asynccontextmanager
async def lifespan(app: FastAPI):
    periodic_tasks = [
        asyncio.create_task(_run_periodic_task(need_aggregator, 300)),
        asyncio.create_task(_run_periodic_task(reliability_updater, 900)),
        asyncio.create_task(_run_periodic_task(dispatch_reminder, 60)),
    ]
    yield
    for task in periodic_tasks:
        task.cancel()
    await asyncio.gather(*periodic_tasks, return_exceptions=True)
    await engine.dispose()

app = FastAPI(title="Awaaz API", version="1.0.0", lifespan=lifespan)

API_PREFIX = "/api/v1"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(reports.router, prefix=API_PREFIX)
app.include_router(needs.router, prefix=API_PREFIX)
app.include_router(volunteers.router, prefix=API_PREFIX)
app.include_router(dispatches.router, prefix=API_PREFIX)
app.include_router(analytics.router, prefix=API_PREFIX)
app.include_router(websockets.router, prefix=API_PREFIX)

@app.get("/")
async def root():
    return {"message": "Welcome to Awaaz API"}


@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok"}
