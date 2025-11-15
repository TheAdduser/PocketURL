import pytest
from app import app 


@pytest.fixture
def client():
    """Tworzy klienta testowego Flask"""
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    """Smoke test: sprawdza czy endpoint /health działa"""
    response = client.get("/health")
    assert response.status_code == 200
