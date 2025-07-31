from math import radians, cos, sin, asin, sqrt

MOOD_RULES = {
    "sad": {
        "types":      ["cafe", "library", "park"],
        "min_rating": 4.0
    },
    "bored": {
        "types":      ["amusement_park", "zoo", "movie_theater"],
        "min_rating": 4.0
    },
    "happy": {
        "types":      ["bar", "night_club", "restaurant"],
        "min_rating": 3.5
    },
    "angry": {
        "types":      ["gym", "stadium", "park"],
        "min_rating": 4.0
    },
}

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

def filter_places(places, mood, allowed_vibe_types, radiuskm, user_location):
    lat_user = user_location["lat"]
    lng_user = user_location["lng"]

    rule = MOOD_RULES.get(mood, {})
    mood_types   = rule.get("types", [])
    mood_min_rt  = rule.get("min_rating", 0)

    WALKABLE_DISTANCE = 5.0

    filtered = []
    for place in places:
        dist = haversine(lat_user, lng_user, place["lat"], place["lng"])
        if dist > float(radiuskm):
            continue

        vibe_match = place["category"] in allowed_vibe_types

        rating = place.get("rating", 0)
        mood_match = (place["category"] in mood_types) and (rating >= mood_min_rt)

        if not (vibe_match or mood_match):
            continue

        score = 0
        if vibe_match: score += 70
        if mood_match: score += 30
        
        if dist <= WALKABLE_DISTANCE:
            score += 50 - (dist * 5)  # closer places get higher bonus
        else:
            score -= (dist - WALKABLE_DISTANCE) * 10  # places beyond 5km get penalized more heavily

        if dist <= 2.0:
            score += 20

        filtered.append({
            "name":        place["name"],
            "category":    place["category"],
            "rating":      place.get("rating", 0),
            "lat":         place.get("lat"),
            "lng":         place.get("lng"),
            "distance_km": round(dist, 2),
            "match_score": min(score, 100),
            "mood_match":  mood_match,
            "vibe_match":  vibe_match,
            "is_walkable": dist <= WALKABLE_DISTANCE
        })

    return sorted(filtered, key=lambda x: x["match_score"], reverse=True)