import pytest

@pytest.mark.anyio
async def test_root(async_client):
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Awaaz API"}


@pytest.mark.anyio
async def test_health(async_client):
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.anyio
async def test_register(async_client):
    payload = {
        "email": "test@example.com",
        "name": "Test User",
        "phone": "1234567890",
        "role": "admin",
        "password": "strongpassword"
    }
    response = await async_client.post("/api/v1/auth/register", json=payload)
    if response.status_code == 200:
        assert response.json()["email"] == payload["email"]
    else:
        # If it already exists it will return 400, handle that
        assert response.status_code == 400
