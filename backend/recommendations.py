recommendations = []

def add_recommendation(name, description, rating, lat, lng):
    recommendations.append({
        "name": name,
        "description": description,
        "rating": rating,
        "lat": lat,
        "lng": lng
    })

def get_recommendations():
    return recommendations 