# Mood2Go 🌍🎭

Mood2Go is a web app that recommends nearby places based on your mood and vibe.  
Built for **Google Maps Hackathon 2025**, it combines playful character animations, AI-driven recommendations, and smooth map navigation.

---

## 📌 About the Project
Mood2Go uses **Google Maps Platform APIs** and **AI-powered recommendations** to suggest places to go based on your **mood** (Happy, Sad, Angry, Bored) and **vibe** (Cozy, Zen, Social, Adventurous).

This app:
- Reads mood/vibe input from an animated character interface.
- Shows your location and recommended places on Google Maps.
- Provides walking directions to chosen destinations.
- Ends with a playful “You’ve Arrived” screen.

---

## ✨ Features
- **Mood Selector** – Swipe between moods with a live-reacting character face.
- **Vibe Selector** – Choose a vibe to refine recommendations.
- **Maps Integration** – Displays user location, recommended places, and directions.
- **AI Recommendations** – Flask backend (Gemini AI) tailors suggestions.
- **Smooth Navigation** – Custom router transitions for app-like UX.

---

## 🛠 Tech Stack
**Frontend**
- HTML, CSS, JavaScript
- Custom Router
- Google Maps JavaScript API (Places, Directions, Marker Libraries)

**Backend**
- Python Flask (API endpoints for AI recommendations)
- Gemini AI for natural-language-based place reasoning
- LocalStorage for mood/vibe persistence

---

## ⚡ Installation
1. **Clone this repository**
   ```bash
   git clone https://github.com/your-username/mood2go.git
   cd mood2go
   ```
2. **Install backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run flask server**
   ```bash
   python app.py
   ```
   Flask will run at http://127.0.0.1:5502
4. **Run frontend**
   - Open project folder in VS Code
   - Install Live Server extension (if not installed)
   - Right-click index.html → Open with Live Server

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
GOOGLE_API_KEY=your_google_maps_api_key
```

---

## 🚀 Quick Start

1. Clone & install dependencies.
2. Populate your `.env`.
3. Run `python app.py` (with `--host=0.0.0.0` for LAN access).
4. Open `http://localhost:5502` (or your PC’s IP) in a browser.
5. Select mood → vibe → radius → “Generate” → tap “Go.”

---

## 📱 Running on Mobile
If you want to access the app from your phone:
1. Make sure your laptop and phone are connected to the same Wi-Fi.
2. Run Flask with host 0.0.0.0 so it’s accessible on the network:
   ```bash
   python app.py --host=0.0.0.0
   ```
3. Ensure no firewall is blocking the Flask port (default: 5502).
4. On your phone’s browser, open the app using your laptop’s local IP.
   Example: http://192.168.0.101:5502
