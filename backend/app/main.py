from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.database import engine
from app.core.redis import connect_redis, disconnect_redis
from app.routers import auth, reports, needs, volunteers, dispatches, analytics, websockets

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup logic
    await connect_redis()
    yield
    # Teardown logic
    await disconnect_redis()
    await engine.dispose()

app = FastAPI(title="Awaaz API", version="1.0.0", lifespan=lifespan)

# Include routers
app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(needs.router)
app.include_router(volunteers.router)
app.include_router(dispatches.router)
app.include_router(analytics.router)
app.include_router(websockets.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Awaaz API"}
