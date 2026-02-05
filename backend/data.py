# Mock Data for MVP

CROPS = {
    "Rice": {
        "suitable_months": ["October", "November", "December", "January", "May", "June"],
        "min_temp": 20, "max_temp": 35,
        "base_cost_per_ha": 5000000,
        "base_yield_per_ha": 5000, # kg
        "base_price": 6000, # per kg
        "risk_factor": "Medium"
    },
    "Corn": {
        "suitable_months": ["February", "March", "April", "September", "October"],
        "min_temp": 18, "max_temp": 30,
        "base_cost_per_ha": 3000000,
        "base_yield_per_ha": 6000, # kg
        "base_price": 4000, # per kg
        "risk_factor": "Low"
    },
    "Chili": {
        "suitable_months": ["April", "May", "June", "July"],
        "min_temp": 24, "max_temp": 32,
        "base_cost_per_ha": 8000000,
        "base_yield_per_ha": 3000, # kg
        "base_price": 25000, # per kg
        "risk_factor": "High"
    },
    "Tomato": {
        "suitable_months": ["May", "June", "July", "August"],
        "min_temp": 20, "max_temp": 28,
        "base_cost_per_ha": 7000000,
        "base_yield_per_ha": 4000, # kg
        "base_price": 10000, # per kg
        "risk_factor": "High"
    },
    "Potato": {
        "suitable_months": ["June", "July", "August"],
        "min_temp": 15, "max_temp": 25,
        "base_cost_per_ha": 9000000,
        "base_yield_per_ha": 15000, # kg
        "base_price": 8000, # per kg
        "risk_factor": "Medium"
    }
}

# Mock Market Trends (Rising, Falling, Stable)
MARKET_TRENDS = {
    "Rice": {"trend": "Stable", "price_change": 0, "oversupply_risk": False},
    "Corn": {"trend": "Rising", "price_change": 0.1, "oversupply_risk": False},
    "Chili": {"trend": "Falling", "price_change": -0.2, "oversupply_risk": True},
    "Tomato": {"trend": "Falling", "price_change": -0.1, "oversupply_risk": True},
    "Potato": {"trend": "Stable", "price_change": 0.05, "oversupply_risk": False}
}

MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]
