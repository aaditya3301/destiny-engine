"""
Test script for the Destiny Engine backend
"""
import asyncio
import json
from main import app, load_data
from fastapi.testclient import TestClient

async def test_backend():
    """Test the backend functionality"""
    # Load data first
    await load_data()
    
    # Create test client
    client = TestClient(app)
    
    # Test health check
    print("🔮 Testing health check...")
    response = client.get("/api/health")
    print(f"Health check status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test prediction with sample data
    print("\n🔮 Testing destiny prediction...")
    test_data = {
        "name": "Alex",
        "age": 25,
        "country": "USA",
        "college": "MIT",
        "aspiration": "AI Scientist"
    }
    
    response = client.post("/api/predict", json=test_data)
    print(f"Prediction status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n✨ Oracle's Verdict:")
        print(f"Predicted Lifetime Net Worth: ${result['predicted_lifetime_nw']:,.0f}")
        print(f"Predicted 10-Year Net Worth: ${result['predicted_10_year_nw']:,.0f}")
        print(f"Wealth Rank: {result['rank_band']}")
        print(f"University Tier: {result['college_tier']}")
        print(f"Success Probability: {result['probability_score']:.2%}")
        print(f"Oracle's Reasoning: {result['reasoning']}")
        print(f"Oracle's Confidence: {result['oracle_confidence']}")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    print("🔮 Starting Destiny Engine Backend Tests...")
    asyncio.run(test_backend())
    print("\n🔮 Tests completed!")
