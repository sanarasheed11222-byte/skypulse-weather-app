# 🌤️ SkyPulse — Professional Weather App

A full-stack weather application built with the MERN stack, featuring real-time weather data, interactive maps, air quality monitoring, and user authentication.

## 🔴 Live Demo
> Coming soon...

## ✨ Features

- 🔍 **City Search** with autocomplete suggestions (GeoDB Cities API)
- 🌡️ **Real-time Weather** — temperature, humidity, wind, pressure, visibility
- 📅 **7-Day Forecast** with daily high/low temperatures
- ⏱️ **Day Detail View** — click any day for full details
- 💨 **Air Quality Index (AQI)** with pollutant breakdown (PM2.5, PM10, NO₂, CO)
- 🌅 **Sunrise & Sunset** times with visual progress bar
- 🌙 **Moon Phase** display
- 🗺️ **Interactive Weather Map** with cloud, rain, wind, temperature layers
- ❤️ **Save Favourite Cities** per user account
- 🔐 **JWT Authentication** — Register & Login
- 🌙 **Dark / Light Mode** toggle
- 📍 **GPS Location** detection

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Recharts (data visualization)
- Leaflet.js (interactive maps)
- Lucide React (icons)
- Plain CSS with glassmorphism design

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- Express Rate Limiting

### APIs
- **Open-Meteo** — weather data (free, no key needed)
- **OpenWeatherMap** — geocoding, air quality, map tiles
- **GeoDB Cities** (RapidAPI) — city search autocomplete

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- OpenWeatherMap API key (free)
- RapidAPI key for GeoDB Cities (free)

### Installation

1. Clone the repo:
```bash
git clone https://github.com/sanarasheed11222-byte/skypulse-weather-app.git
cd skypulse-weather-app
```

2. Setup backend:
```bash
cd backend
npm install
```

Create `backend/.env`:
3. Setup frontend:
```bash
cd frontend
npm install
```

Create `frontend/.env`:
4. Run the app:
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📸 Screenshots

> Add screenshots here after deployment

## 👩‍💻 Author

**Sana Rasheed**
- GitHub: [@sanarasheed11222-byte](https://github.com/sanarasheed11222-byte)

## 📄 License

MIT License
