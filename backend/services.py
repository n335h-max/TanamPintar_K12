from typing import List
from models import FarmerInput, CropRecommendation, ProfitEstimate
from data import CROPS, MARKET_TRENDS

def get_recommendations(input_data: FarmerInput) -> List[CropRecommendation]:
    recommendations = []
    
    for crop_name, data in CROPS.items():
        reasons = []
        suitability_score = 100
        
        # 1. Climate/Season Check
        if input_data.month not in data["suitable_months"]:
            # For MVP, we filter out or heavily penalize. 
            # Let's penalize to show "Not suitable for this season"
            suitability_score -= 50
            reasons.append(f"Not optimal planting season for {crop_name} in {input_data.month}")
        else:
            reasons.append(f"Good planting season for {crop_name}")
            
        # 2. Market Logic
        market_data = MARKET_TRENDS.get(crop_name, {})
        trend = market_data.get("trend", "Stable")
        oversupply = market_data.get("oversupply_risk", False)
        
        predicted_price = data["base_price"] * (1 + market_data.get("price_change", 0))
        
        if oversupply:
            suitability_score -= 30
            reasons.append("High oversupply risk detected")
        
        if trend == "Falling":
            suitability_score -= 10
            reasons.append("Market price is trending downwards")
        elif trend == "Rising":
            suitability_score += 10
            reasons.append("Market price is trending upwards")

        # 3. Profit Calculation
        total_cost = data["base_cost_per_ha"] * input_data.land_size
        total_revenue = predicted_price * data["base_yield_per_ha"] * input_data.land_size
        expected_profit = total_revenue - total_cost
        
        # 4. Risk Level Adjustment
        risk = data["risk_factor"]
        if oversupply:
            risk = "High"
            
        # Only recommend if suitability is reasonable (> 40)
        if suitability_score > 40:
            recommendations.append(CropRecommendation(
                crop_name=crop_name,
                suitability_score=max(0, min(100, suitability_score)), # Clamp 0-100
                expected_profit=expected_profit,
                risk_level=risk,
                reason=reasons
            ))
            
    # Sort by suitability score desc, then profit desc
    recommendations.sort(key=lambda x: (x.suitability_score, x.expected_profit), reverse=True)
    
    return recommendations[:3] # Return top 3
