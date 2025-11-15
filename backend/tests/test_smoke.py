from app import app

def test_smoke_flask():
    client = app.test_client()
    response = client.get("/")

    assert response.status_code == 200
