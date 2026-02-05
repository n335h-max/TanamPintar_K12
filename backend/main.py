from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import FarmerInput, CropRecommendation
from services import get_recommendations
from ai_service import analyze_land_image
from data import MARKET_TRENDS

app = FastAPI(title="TanamPintar API", description="MVP for Crop Recommendation System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to TanamPintar API"}

@app.post("/recommend", response_model=list[CropRecommendation])
def recommend_crops(input_data: FarmerInput):
    """
    Get top 3 crop recommendations based on location, land size, and planting period.
    """
    return get_recommendations(input_data)

@app.post("/analyze-land")
async def analyze_land(file: UploadFile = File(...)):
    """
    Analyze uploaded land image using Gemini AI.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    result = analyze_land_image(contents)
    return result

@app.get("/market-trends")
def get_market_trends():
    """
    Get current market trends for major crops.
    """
    return MARKET_TRENDS

@app.get("/climate-risk")
def get_climate_risk():
    """
    Get simulated climate risk data.
    """
    # Mock data for MVP
    return {
        "rainfall": "High",
        "heat_risk": "Moderate",
        "warnings": [
            "Heavy rainfall expected in late afternoon.",
            "Avoid planting chili this month due to fungal risk from moisture."
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
