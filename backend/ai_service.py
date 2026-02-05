import os
import requests
import base64
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")

def analyze_land_image(image_bytes: bytes) -> dict:
    """
    Analyzes land image using Gemini REST API (v1) to identify soil type and suitability.
    """
    if not api_key:
        # Mock response if no API key
        return {
            "soil_type": "Loamy Soil (Estimated from visual texture)",
            "terrain": "Flat to gently sloping",
            "suggested_crops": ["Rice", "Corn", "Vegetables"],
            "analysis": "The image shows fertile land suitable for various crops. The soil appears dark and moisture-retentive.",
            "note": "This is a simulated analysis. Add GEMINI_API_KEY to use real AI."
        }

    try:
        # 1. Prepare the API endpoint (v1 stable)
        # Using gemini-2.5-flash as it is the latest stable version available in v1
        url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={api_key}"
        
        # 2. Encode image to Base64
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        
        # 3. Construct the Request Body
        # We ask for a JSON response in the prompt and use response_mime_type if supported by the model/endpoint combination,
        # but for v1 standard endpoint, we'll rely on the prompt + parsing or the generationConfig.
        
        prompt_text = """
        Analyze this image of agricultural land. Identify:
        1. Soil type (visual estimation)
        2. Terrain type
        3. Top 3 suitable crops based on visual soil health
        4. A brief analysis of the land condition.
        
        You must return a valid JSON object with the following structure:
        {
            "soil_type": "string",
            "terrain": "string",
            "suggested_crops": ["string", "string", "string"],
            "analysis": "string"
        }
        Do not include markdown code blocks (like ```json). Just the raw JSON string.
        """

        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt_text},
                    {
                        "inlineData": {
                            "mimeType": "image/jpeg", # Assuming JPEG or generic image; Gemini handles most types
                            "data": image_b64
                        }
                    }
                ]
            }]
        }

        # 4. Send Request
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, headers=headers, json=payload)
        
        # 5. Handle Response
        if response.status_code != 200:
            print(f"Gemini API Error ({response.status_code}): {response.text}")
            return {
                "soil_type": "Analysis Failed",
                "terrain": "Unknown",
                "suggested_crops": [],
                "analysis": f"API Error: {response.status_code} - {response.text}",
                "error": response.text
            }
            
        result = response.json()
        
        # Extract text from response structure
        # { "candidates": [ { "content": { "parts": [ { "text": "..." } ] } } ] }
        try:
            candidates = result.get('candidates', [])
            if not candidates:
                raise ValueError("No candidates returned")
                
            text_part = candidates[0].get('content', {}).get('parts', [])[0].get('text', '')
            
            # Clean up potential markdown if the model ignored the instruction
            cleaned_text = text_part.replace("```json", "").replace("```", "").strip()
            
            return json.loads(cleaned_text)
            
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            print(f"Parsing Error: {e}")
            print(f"Raw Response: {result}")
            return {
                "soil_type": "Analysis Failed",
                "terrain": "Unknown",
                "suggested_crops": [],
                "analysis": "Failed to parse AI response.",
                "raw_response": str(result)
            }

    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return {
            "soil_type": "Analysis Failed",
            "terrain": "Unknown",
            "suggested_crops": [],
            "analysis": f"System Error: {str(e)}",
            "error": str(e)
        }
