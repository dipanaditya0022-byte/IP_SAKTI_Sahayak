import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200

def test_analyze_classification():
    payload = {
        "innovation": {
            "description": "A novel nano-extract of Triphala for post-prandial glycemic control.",
            "ingredients": ["Haritaki", "Bibhitaki"],
            "target_market": "INDIA"
        }
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "classification" in data
    assert data["classification"]["review_required"] is True
    assert data["jurisdiction"] == "IN"

def test_analyze_jurisdiction_routing():
    payload = {
        "target_jurisdiction": "USA",
        "innovation": {
            "description": "Ashwagandha capsules for stress adaptation.",
            "ingredients": ["Ashwagandha"]
        }
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["jurisdiction"] == "INTERNATIONAL"

def test_analyze_clarification_required():
    payload = {
        "innovation": {
            "description": "Short",
            "ingredients": [],
            "target_market": "INDIA"
        }
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("ABSTENTION_TRIGGERED", "clarification_required")

def test_analyze_insufficient_evidence():
    payload = {
        "innovation": {
            "description": "A completely invented compound made of space rock zebras.",
            "target_market": "AUSTRALIA"
        }
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    # It might find nothing in the local mock db
    assert data["jurisdiction"] == "INTERNATIONAL"

def test_synthesize_stream():
    payload = {
        "query": "Nano extract of Triphala",
        "classification_label": "Modified Ayurveda / Phytopharmaceutical",
        "evidence": [
            {
                "title": "Drugs & Cosmetics Act",
                "authority": "CDSCO",
                "jurisdiction": "INDIA",
                "excerpt": "Modified traditional drugs require Phase 1 trials."
            }
        ]
    }
    # Since it's SSE, testclient returns the full response once stream closes
    response = client.post("/api/synthesize/stream", json=payload)
    assert response.status_code == 200
    assert "data: " in response.text
    assert "[DONE]" in response.text
