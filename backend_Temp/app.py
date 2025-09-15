from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import requests
import os

# Flask points to Angular dist
app = Flask(__name__, static_folder="../frontend_Temp/dist/frontend-temp/browser", static_url_path="")
CORS(app)

# Sensor dictionary
sensors = {
    "ho_chi_minh": {"sensor_id": "ho_chi_minh", "location": "Ho Chi Minh City", "latitude": 10.8231, "longitude": 106.6297, "type": "Temperature"},
    "toronto": {"sensor_id": "toronto", "location": "Toronto", "latitude": 43.65107, "longitude": -79.347015, "type": "Temperature"},
    "seoul": {"sensor_id": "seoul", "location": "Seoul", "latitude": 37.5665, "longitude": 126.978, "type": "Temperature"},
    "san_jose": {"sensor_id": "san_jose", "location": "San Jose", "latitude": 37.7749, "longitude": -122.4194, "type": "Temperature"},
    "tokyo": {"sensor_id": "tokyo", "location": "Tokyo", "latitude": 35.6762, "longitude": 139.6503, "type": "Temperature"}
}

BASE_URL = "https://api.open-meteo.com/v1/forecast"

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

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_angular(path):
    full_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
    app.run(debug=True)

