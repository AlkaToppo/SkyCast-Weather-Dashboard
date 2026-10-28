# SkyCast — Weather Dashboard

**[🌦️ Live Demo](https://sky-cast-weather-dashboard-five.vercel.app)** | **[💻 GitHub Repository](https://github.com/AlkaToppo/SkyCast-Weather-Dashboard)**

A responsive weather dashboard built with **React, Vite, and the OpenWeatherMap API**. SkyCast lets users search for cities, view current weather conditions, explore hourly and five-day forecasts, and check important weather highlights.

## Features

- **City Search:** Search for weather in different cities.
- **Current Weather:** View temperature, weather conditions, and feels-like temperature.
- **Hourly Forecast:** Explore upcoming weather forecasts.
- **Five-Day Forecast:** Check upcoming daily weather conditions.
- **Weather Highlights:** View humidity, wind speed, visibility, pressure, sunrise, and sunset.
- **Current Location:** Get weather using your device's location, with permission.
- **Recent Searches:** Quickly revisit recently searched cities.
- **Light and Dark Mode:** Switch themes with your preference saved locally.
- **Responsive Design:** Use the dashboard on desktop and mobile devices.
- **Loading and Error States:** Receive feedback while weather data loads or if a request fails.

## Tech Stack

- React
- Vite
- JavaScript
- HTML5
- CSS3
- OpenWeatherMap API
- Lucide React icons
- Browser Geolocation API
- LocalStorage

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AlkaToppo/SkyCast-Weather-Dashboard.git
cd SkyCast-Weather-Dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API key

Create a `.env` file in the project root and add your OpenWeatherMap API key:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your own valid API key. The repository includes `.env.example` as a configuration template.

**Never commit your real `.env` file or publish your API key.**

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal.

## Project Structure

```text
SkyCast-Weather-Dashboard/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── FiveDayForecast.jsx
│   │   ├── HourlyForecast.jsx
│   │   ├── WeatherCard.jsx
│   │   └── WeatherHighlights.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
└── vite.config.js
```

## API

SkyCast uses the [OpenWeatherMap API](https://openweathermap.org/api) to retrieve weather information. You need your own API key to run the application.

## Future Improvements

- Deploy a live version of SkyCast.
- Add weather alerts and additional forecast visualizations.
- Improve automated testing.

## Author

**Alka Toppo**

- GitHub: [@AlkaToppo](https://github.com/AlkaToppo)
- Project Repository: [SkyCast-Weather-Dashboard](https://github.com/AlkaToppo/SkyCast-Weather-Dashboard)
