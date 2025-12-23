from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import requests
import os

# Flask points to Angular dist
app = Flask(__name__, static_folder="../frontend_Temp/dist/frontend-temp/browser", static_url_path="")
CORS(app, origins=[
    "http://localhost:4200",  # Local development
    "https://*.azurestaticapps.net",  # Azure Static Web Apps
    "https://temperature-api-fpbraua4ckb7gmhu.canadacentral-01.azurewebsites.net"  # Your backend URL
])

# Sensor dictionary
sensors = {
    "ho_chi_minh": {"sensor_id": "ho_chi_minh", "location": "Ho Chi Minh City", "latitude": 10.8231, "longitude": 106.6297, "type": "Temperature"},
    "toronto": {"sensor_id": "toronto", "location": "Toronto", "latitude": 43.65107, "longitude": -79.347015, "type": "Temperature"},
    "seoul": {"sensor_id": "seoul", "location": "Seoul", "latitude": 37.5665, "longitude": 126.978, "type": "Temperature"},
    "san_jose": {"sensor_id": "san_jose", "location": "San Jose", "latitude": 37.7749, "longitude": -122.4194, "type": "Temperature"},
    "tokyo": {"sensor_id": "tokyo", "location": "Tokyo", "latitude": 35.6762, "longitude": 139.6503, "type": "Temperature"}
}

BASE_URL = "https://api.open-meteo.com/v1/forecast"
GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"

def get_temperature(lat, lon):
    params = {
        'latitude': lat,
        'longitude': lon,
        'current_weather': 'true',
        'temperature_unit': 'celsius'
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code == 200:
        return response.json()['current_weather']['temperature']
    return None


@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    for city in sensors:
        temp = get_temperature(sensors[city]['latitude'], sensors[city]['longitude'])
        sensors[city]['value'] = temp if temp is not None else "Error fetching temperature"
    return jsonify(sensors)

@app.route('/api/sensors/<sensor_id>', methods=['GET'])
def get_sensor(sensor_id):
    sensor = sensors.get(sensor_id)
    if not sensor:
        return jsonify({"error": "Sensor not found"}), 404
    temp = get_temperature(sensor['latitude'], sensor['longitude'])
    sensor['value'] = temp if temp is not None else "Error fetching temperature"
    return jsonify(sensor)

@app.route('/api/sensors/type/<sensor_type>', methods=['GET'])
def get_sensors_by_type(sensor_type):
    filtered = {k: v for k, v in sensors.items() if v['type'].lower() == sensor_type.lower()}
    return jsonify(filtered)

@app.route('/api/sensors', methods=['POST'])
def add_sensor():
    new_sensor = request.get_json()
    if 'sensor_id' not in new_sensor:
        return jsonify({"error": "sensor_id is required"}), 400
    sensors[new_sensor['sensor_id']] = new_sensor
    return jsonify({"message": "Sensor added successfully", "sensor": new_sensor}), 201

# search city name
@app.route('/api/search')
def search_city():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City name is required"}), 400
    
    # Geocode city
    geo_resp = requests.get(f"{GEOCODE_URL}?name={city}")
    geo_data = geo_resp.json()
    if not geo_data.get("results"):
        return jsonify({"error": "City not found"}), 404
    
    lat = geo_data["results"][0]["latitude"]
    lon = geo_data["results"][0]["longitude"]

    # Get current weather based on geocode
    weather_resp = requests.get(f"{BASE_URL}?latitude={lat}&longitude={lon}&current_weather=true")
    weather_data = weather_resp.json()
    temperature = weather_data["current_weather"]["temperature"]
    #Return results 
    result = {
        "sensor_id": city.lower(),
        "location": city.title(),
        "latitude": lat,
        "longitude": lon,
        "type": "Temperature",
        "value": temperature
    }
    return jsonify(result)


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

