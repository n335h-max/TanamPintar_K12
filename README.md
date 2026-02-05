# 🌱 TanamPintar (MVP)

CropWise is a simple AI-powered app that helps farmers choose the best crop to plant by analyzing market prices, climate conditions, and oversupply risks.

## 🚀 How to Run Locally (For Groupmates)

### 1. Clone the Repository
```bash
git clone https://github.com/n335h-max/TanamPintar_K12.git
cd TanamPintar
```

### 2. Backend Setup (FastAPI)
The backend handles the AI logic and data.

```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup API Key
# Create a .env file in the backend folder and add:
# GEMINI_API_KEY=your_api_key_here

# Run the server
python -m uvicorn main:app --reload --port 8000
```
*The backend will run at `http://localhost:8000`*

### 3. Frontend Setup (React + Vite)
The frontend is the user interface.

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The app will open at `http://localhost:5173`*

---

## 🌐 How to Deploy (Live Demo on Render)

We use **Render Blueprints** to deploy both Frontend and Backend automatically.

1. **Push to GitHub**: Make sure this code is in your GitHub repository.
2. **Go to Render**: [dashboard.render.com](https://dashboard.render.com)
3. **Click "New + " -> "Blueprint"**.
4. **Connect your GitHub Repo**.
5. Render will detect the `render.yaml` file and propose creating 2 services:
   - `tanampintar-backend` (Python)
   - `tanampintar-frontend` (Static Site)
6. **Click "Apply"**.
7. **Important**:
   - Go to the **Backend Service** settings in Render -> Environment.
   - Add your `GEMINI_API_KEY` manually (for security, it's not in the code).

Render will automatically link the frontend to the backend URL.
