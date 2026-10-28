
import { useState, useEffect} from "react";
import "./App.css";
import HourlyForecast from "./components/HourlyForecast";
import FiveDayForecast from "./components/FiveDayForecast";
import WeatherHighlights from "./components/WeatherHighlights";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [city, setCity] = useState("Jamshedpur");
  const [weather, setWeather] = useState(null);
  const [theme, setTheme] = useState(() => {
  return localStorage.getItem("skycast-theme") || "dark";
});

const toggleTheme = () => {
  const newTheme = theme === "dark" ? "light" : "dark";
  setTheme(newTheme);
  localStorage.setItem("skycast-theme", newTheme);
};
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [forecast, setForecast] = useState([]);
const [lastUpdated, setLastUpdated] = useState("");
const [recentCities, setRecentCities] = useState(() => {
  try {
    const savedCities = JSON.parse(
      localStorage.getItem("skycast-recent-cities")
    );

    return Array.isArray(savedCities) ? savedCities : [];
  } catch {
    return [];
  }
});
useEffect(() => {
  localStorage.setItem(
    "skycast-recent-cities",
    JSON.stringify(recentCities)
  );
}, [recentCities]);

function saveRecentCity(cityName) {
  const cleanedCity = cityName.trim();

  if (!cleanedCity) return;

  setRecentCities((previousCities) => {
    const updatedCities = [
      cleanedCity,
      ...previousCities.filter(
        (city) => city.toLowerCase() !== cleanedCity.toLowerCase()
      ),
    ].slice(0, 5);

    return updatedCities;
  });
}
    
const weatherMain = weather?.weather?.[0]?.main?.toLowerCase() || "";

const backgroundClass = weatherMain.includes("clear")
  ? "bg-clear"
  : weatherMain.includes("cloud")
  ? "bg-clouds"
  : weatherMain.includes("rain") || weatherMain.includes("drizzle")
  ? "bg-rain"
  : weatherMain.includes("thunderstorm")
  ? "bg-storm"
  : weatherMain.includes("snow")
  ? "bg-snow"
  : "bg-default";


async function getWeather(cityName) {
  const searchedCity = cityName.trim();

  // 1. Validate input
  if (!searchedCity) {
    setError("Please enter a city name.");
    return;
  }

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;


  if (!apiKey) {
    setError("API key is missing. Please check your .env file.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // 2. Fetch current weather
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchedCity)}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        throw new Error("City not found. Please check the spelling.");
      }

      if (weatherResponse.status === 401) {
        throw new Error("Invalid or inactive API key.");
      }

      if (weatherResponse.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Unable to fetch weather. Please try again.");
    }

    const weatherData = await weatherResponse.json();

    // 3. Fetch forecast
    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(searchedCity)}&appid=${apiKey}&units=metric`;

    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      if (forecastResponse.status === 401) {
        throw new Error("API key is invalid or inactive.");
      }

      if (forecastResponse.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Weather loaded, but the forecast could not be fetched. Please try again.");
    }

    const forecastData = await forecastResponse.json();

    // 4. Update the dashboard only after both requests succeed
    setWeather(weatherData);
    setForecast(forecastData.list);
    setCity(weatherData.name);
    saveRecentCity(weatherData.name);
    setLastUpdated(
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch (err) {
    // 5. Handle network and unexpected errors
    if (err instanceof TypeError) {
      setError("Network error. Check your internet connection and try again.");
    } else {
      setError(err.message || "Something went wrong. Please try again.");
    }
  } finally {
    // 6. Always stop the loading state
    setLoading(false);
  }
}


function handleSearch(event) {
    event.preventDefault();
    getWeather(city);
} 
  
async function getMyLocation() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // 1. Check API key
  if (!apiKey) {
    setError("API key is missing. Please check your .env file.");
    return;
  }

  // 2. Check browser support
  if (!navigator.geolocation) {
    setError("Your browser does not support location detection.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // 3. Get the user's coordinates
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { enableHighAccuracy: false, timeout: 10000 }
      );
    });

    const { latitude, longitude } = position.coords;

    // 4. Fetch current weather
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 401) {
        throw new Error("Invalid or inactive API key.");
      }

      if (weatherResponse.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Unable to fetch local weather.");
    }

    const weatherData = await weatherResponse.json();

    // 5. Fetch the forecast
    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      if (forecastResponse.status === 401) {
        throw new Error("Invalid or inactive API key.");
      }

      if (forecastResponse.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Unable to fetch the local forecast.");
    }

    const forecastData = await forecastResponse.json();

    // 6. Update the dashboard after both requests succeed
    setWeather(weatherData);
    setForecast(forecastData.list);
    setCity(weatherData.name);

    setLastUpdated(
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch (err) {
    // 7. Give useful error messages
    if (err instanceof TypeError) {
      setError("Network error. Check your internet connection.");
    } else if (err.code === 1) {
      setError("Location permission denied. Allow location access in your browser.");
    } else if (err.code === 2) {
      setError("Your location is unavailable. Please try again.");
    } else if (err.code === 3) {
      setError("Location request timed out. Please try again.");
    } else {
      setError(err.message || "Unable to fetch local weather.");
    }
  } finally {
    // 8. Always stop loading
    setLoading(false);
  }
}
  


  return (
    <div className={`app ${backgroundClass} ${theme}-theme` }>
      <main className="dashboard">
        <header className="header">
          <div className="brand">
            <span className="brand-icon">☀</span>
            <div>
              <h1>SkyCast</h1>
              <p>WEATHER STUDIO</p>
            </div>
          </div>
          <span className="live-badge">WEATHER DASHBOARD</span>
          <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        </header>

        <section className="search-section">
          <p className="eyebrow">YOUR WEATHER, AT A GLANCE</p>
          <h2>How's the sky today?</h2>
          <p className="subtitle">
            Search a city to explore its weather.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
           
            <button type="submit" disabled={loading}>
            {loading && <span className="loading-spinner" />}
            {loading ? "Fetching..." : "Search ↗"}
            </button>
  
          </form>
          
         <button
          type="button"
          className="refresh-button location-button"
          onClick={getMyLocation}
          disabled={loading}
         >
         📍 Use my location
         </button>

              
         {error && (
          <p className="error-message" role="alert">
        ⚠️ {error}
          </p>
         )}

{recentCities.length > 0 && (
  <div className="recent-searches">
    <div className="recent-searches-header">
      <span className="recent-label">RECENT SEARCHES</span>

      <button
        type="button"
        className="clear-history-button"
        onClick={() => setRecentCities([])}
      >
        Clear history
      </button>
    </div>

    <div className="recent-city-list">
      {recentCities.map((recentCity) => (
        <button
          type="button"
          className="recent-city-button"
          key={recentCity}
          disabled={loading}
          onClick={() => getWeather(recentCity)}
        >
          {recentCity}
        </button>
      ))}
    </div>
  </div>
)}

            
        </section>
      
<section className="weather-panel">
  {weather ? (
    <>
      <WeatherCard
        weather={weather}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={() => getWeather(city)}
      />

      <WeatherHighlights weather={weather} />
    </>
  ) : (
    <div>
      <p className="eyebrow">CURRENT WEATHER</p>
      <h2>{city || "Your city"}</h2>

      <div className="temperature-row">
        <h3>--°C</h3>
        <div>
          <p className="weather-condition">
            {loading ? "Fetching weather..." : "Weather awaits"}
          </p>
          <p className="muted">
            Search a city to see live conditions.
          </p>
        </div>
      </div>
    </div>
  )}
</section>


        <HourlyForecast forecast={forecast} />
        <FiveDayForecast forecast={forecast} />

        <footer>
          <span>SKYCAST</span>
          <p>Weather insights, beautifully presented.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
