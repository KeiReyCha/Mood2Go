from flask import Flask, request, jsonify, send_from_directory, render_template
from geminiahay import sentence_generator_ai  
from flask_cors import CORS
from dotenv import load_dotenv
from filter import filter_places, MOOD_RULES
import os, requests
from recommendations import add_recommendation, get_recommendations
import hashlib
import time
import webbrowser

load_dotenv()
GOOGLE_API_KEY= os.getenv("GOOGLE_API_KEY")

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))      
STATIC_DIR  = os.path.abspath(os.path.join(BASE_DIR, "..", "static"))
TEMPLATE_DIR= os.path.join(BASE_DIR, "templates")

app = Flask(
    __name__,
    static_folder=STATIC_DIR,        
    static_url_path="/static",       
    template_folder=TEMPLATE_DIR
)
CORS(app)

@app.route("/pages/<path:filename>")
def serve_page_html(filename):
    pages_dir = os.path.join(app.static_folder, "pages")
    return send_from_directory(pages_dir, filename)

recommendation_cache = {}
CACHE_DURATION = 300  


VIBE_WORDS = {
    "cozy": [
        "cafe", "bakery", "book_store", "library", "restaurant", "bar", "tea_house"
    ],
    "adventurous": [
        "amusement_park", "aquarium", "zoo", "campground", "tourist_attraction", "stadium"
    ],
    "social": [
        "night_club", "bar", "movie_theater", "shopping_mall", "museum", "tourist_attraction", "park"
    ],
    "zen": [
        "spa", "park", "aquarium"
    ]
}

@app.route("/recommend", methods=["POST"])
def recommend_places():
    try:
        data = request.get_json(force=True)
        if not data.get("mood") or not data.get("vibe"):
            return jsonify({"error": "Missing mood or vibe"}), 400
        cache_key = hashlib.md5(
            f"{data.get('mood')}-{data.get('vibe')}-{data.get('radius')}-{data.get('location')}".encode()
        ).hexdigest()
        
        current_time = time.time()
        if cache_key in recommendation_cache:
            cached_data, cache_time = recommendation_cache[cache_key]
            if current_time - cache_time < CACHE_DURATION:
                return jsonify(cached_data)
            else:
                del recommendation_cache[cache_key]

        mood = data.get("mood")
        vibe_key = data.get("vibe", "").lower()
        places_list = VIBE_WORDS.get(vibe_key, [])
        mood_types = MOOD_RULES.get(mood, {}).get("types", [])

        all_keywords = list(set(places_list + mood_types))

        keyword_param = ""
        if all_keywords:
            keyword_param = "&keyword=" + "|".join(all_keywords)

        raw_radius = data.get("radius")
        try:
            radiusm = int(raw_radius)*1000
        except ValueError:
            radiusm=5000  # default to 5km for walkable distance        
        location = data.get("location")


        location = data.get("location")
        if not location or "lat" not in location or "lng" not in location:
            return jsonify({"error": "Missing or invalid location"}), 400
        lat, lng = location["lat"], location["lng"]

        google_url = (
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            f"?location={lat},{lng}"
            f"&radius={radiusm}"
            f"{keyword_param}"
            f"&key={GOOGLE_API_KEY}"
        )

        resp = requests.get(google_url, timeout=10)
        places = resp.json().get("results", [])

        #get name, category, rating from the google search of the recommended places
        shaped = []
        for p in places:
            loc = p["geometry"]["location"]
            types = p.get("types", [])
            rating = p.get("rating", 0)
            shaped.append({
                "name": p.get("name"),
                "lat": loc.get("lat"),
                "lng": loc.get("lng"),
                "category": types[0] if types else "",
                "rating": rating,
                "moods": types
            })

        radiuskm=radiusm/1000

        prefiltered= filter_places(
            shaped,
            mood,
            places_list,
            radiuskm,
            {"lat": lat, "lng": lng}
        )

        places_for_ai = prefiltered[:10] if len(prefiltered) > 10 else prefiltered

        final_results= sentence_generator_ai(
            mood= mood,
            vibe= vibe_key,
            location_name=f"{lat},{lng}",
            radiusm= radiuskm,
            places= places_for_ai
        )
        recommendation_cache[cache_key] = (final_results, current_time)
        
        return jsonify(final_results)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[ERROR] {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommendations', methods=['POST'])
def api_add_recommendation():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    rating = data.get('rating')
    lat = data.get('lat')
    lng = data.get('lng')
    if not all([name, description, rating, lat, lng]):
        return jsonify({'error': 'Missing fields'}), 400
    add_recommendation(name, description, rating, lat, lng)
    return jsonify({'success': True})

@app.route('/api/recommendations', methods=['GET'])
def api_get_recommendations():
    return jsonify(get_recommendations())

@app.route("/")
def serve_landing():
    return render_template(
      "index.html",
      GOOGLE_MAPS_API_KEY=os.getenv("GOOGLE_API_KEY")
    )
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(app.static_folder, "favicon.ico")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5502))
    url = f"http://localhost:{port}/"
    webbrowser.open(url)
    app.run(host="0.0.0.0", port=port, debug=False)
