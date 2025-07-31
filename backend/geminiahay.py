import json
import re
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def sentence_generator_ai(mood, vibe, location_name, radiusm, places):
    place_descriptions = "\n".join(
        [f"- {p['name']}: rating {p.get('rating', '?')}, lat {p.get('lat', '?')}, lng {p.get('lng', '?')}" for p in places]
    )

    prompt = """
You are an emotional assistant helping users find places that match their feelings.
A user is feeling {mood} and looking for a {vibe} vibe in {location}. 
Here are some places nearby:
{places}
Do not give an answer for the reason based on the place name itself. Instead, for each place, describe specific activities, atmospheres, or features that will directly address the user’s emotional need (e.g., “Because playing arcade games releases endorphins and distracts you from sadness…”). 
Do not add any other places outside of the given ones.
Avoid any hedging or speculative words such as “probably,” “likely,” “might,” “suggests,” or “could.” Use definitive, concrete language that describes specific activities, atmospheres, or features 
Please rank the top 3 places that best match the user's emotional need and explain why.
Respond in JSON format only like this:
[
  {{
    "name": "Name of Place",
    "reason": "Why this place matches the mood and vibe",
    "rating": "Rating of the place"
  }}
]
""".format(
        mood=mood,
        vibe=vibe,
        location=location_name,
        places=place_descriptions
    )


    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=500,  # limit response length for speed
            top_p=0.8,
            top_k=40
        )
    )
    raw_text = response.text.strip()
    raw_text = re.sub(r"^```(?:json)?\n?", "", raw_text)
    raw_text = re.sub(r"\n?```$", "", raw_text)
    cleaned_text = raw_text




    try:
        ai_response = json.loads(cleaned_text)
        
        enhanced_response = []
        places_lookup = {place['name']: place for place in places}
        
        for ai_place in ai_response:
            matching_place = places_lookup.get(ai_place['name'])
            
            if matching_place:
                enhanced_place = {
                    "name": ai_place['name'],
                    "reason": ai_place['reason'],
                    "rating": matching_place.get('rating', 0),
                    "lat": matching_place.get('lat', 0),
                    "lng": matching_place.get('lng', 0)
                }
            else:
                enhanced_place = {
                    "name": ai_place['name'],
                    "reason": ai_place['reason'],
                    "rating": ai_place.get('rating', 0),
                    "lat": None,
                    "lng": None
                }
            enhanced_response.append(enhanced_place)
        
        return enhanced_response

    except json.JSONDecodeError as e:
        print("[ERROR] Gemini output is not valid JSON:", e)
        return []
