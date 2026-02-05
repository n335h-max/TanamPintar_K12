from pydantic import BaseModel
from typing import List, Optional

class FarmerInput(BaseModel):
    location: str
    land_size: float  # in hectares
    month: str  # e.g., "January", "February"

class CropRecommendation(BaseModel):
    crop_name: str
    suitability_score: float  # 0 to 100
    expected_profit: float
    risk_level: str  # Low, Medium, High
    reason: List[str]

class MarketTrend(BaseModel):
    crop_name: str
    price_trend: str  # Rising, Falling, Stable
    predicted_price_next_3_months: float
    oversupply_risk: bool

class ProfitEstimate(BaseModel):
    crop_name: str
    estimated_cost: float
    estimated_revenue: float
    estimated_profit: float
