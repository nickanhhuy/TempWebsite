# 🌡️ Global Temperature Monitoring System

A real-time temperature monitoring application that displays sensor data from cities worldwide on an interactive map. Built with modern web technologies and deployed on Microsoft Azure.

## 🚀 Live Demo

- **Frontend**: [https://agreeable-mushroom-075af2e10.6.azurestaticapps.net](https://agreeable-mushroom-075af2e10.6.azurestaticapps.net)
- **API**: [https://temperature-api-fpbraua4ckb7gmhu.canadacentral-01.azurewebsites.net](https://temperature-api-fpbraua4ckb7gmhu.canadacentral-01.azurewebsites.net)

## ✨ Features

- 🗺️ **Interactive Map**: Leaflet.js-powered map showing global temperature sensors
- 🌡️ **Real-time Data**: Live temperature readings from Open-Meteo weather API
- 🔍 **City Search**: Dynamic search and add new temperature sensors
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized Angular frontend with efficient API calls
- 🔄 **Auto-refresh**: Temperature data updates automatically

## 🏗️ Architecture

### Frontend (Angular)
- **Framework**: Angular 19
- **Map Library**: Leaflet.js for interactive mapping
- **Styling**: Modern CSS with responsive design
- **Deployment**: Azure Static Web Apps with GitHub Actions CI/CD

### Backend (Flask API)
- **Framework**: Flask with Flask-CORS
- **Data Source**: Open-Meteo weather API
- **Endpoints**: RESTful API for sensor data and city search
- **Deployment**: Azure App Service (B1 Basic tier)

## 🛠️ Tech Stack

**Frontend:**
- Angular 19
- TypeScript
- Leaflet.js
- HTML5/CSS3
- RxJS

**Backend:**
- Python 3.11
- Flask
- Requests
- Flask-CORS

**Cloud & DevOps:**
- Microsoft Azure (Static Web Apps + App Service)
- GitHub Actions
- VS Code Azure Extension

## 📍 Default Sensor Locations

- 🇻🇳 Ho Chi Minh City, Vietnam
- 🇨🇦 Toronto, Canada  
- 🇰🇷 Seoul, South Korea
- 🇺🇸 San Jose, USA
- 🇯🇵 Tokyo, Japan

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Angular CLI

### Local Development

#### Frontend Setup
```bash
cd frontend_Temp
npm install
ng serve
```
Access at: `http://localhost:4200`

#### Backend Setup
```bash
cd backend_Temp
pip install -r requirements.txt
python app.py
```
API available at: `http://localhost:8000`

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sensors` | GET | Get all sensors with current temperatures |
| `/api/sensors/{id}` | GET | Get specific sensor data |
| `/api/sensors/type/{type}` | GET | Get sensors by type |
| `/api/sensors` | POST | Add new sensor |
| `/api/search?city={name}` | GET | Search and get temperature for any city |
| `/health` | GET | Health check endpoint |

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 8000)

### CORS Configuration
The API is configured to accept requests from:
- `http://localhost:4200` (development)
- Azure Static Web Apps domain (production)

## 🚀 Deployment

### Frontend Deployment
- **Platform**: Azure Static Web Apps
- **Method**: Automatic deployment via GitHub Actions
- **Trigger**: Push to `main` branch

### Backend Deployment  
- **Platform**: Azure App Service (B1 Basic)
- **Method**: Manual deployment via VS Code Azure extension
- **Features**: Always-on, custom domains supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**
- GitHub: [@nickanhhuy](https://github.com/nickanhhuy)
- Project Link: [https://github.com/nickanhhuy/TempWebsite](https://github.com/nickanhhuy/TempWebsite)

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather API
- [Leaflet.js](https://leafletjs.com/) for the interactive mapping library
- [Microsoft Azure](https://azure.microsoft.com/) for cloud hosting
- [Angular](https://angular.io/) and [Flask](https://flask.palletsprojects.com/) communities

---

⭐ **Star this repository if you found it helpful!**