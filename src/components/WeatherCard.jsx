
function WeatherCard({ weather, lastUpdated, loading, onRefresh }) {
  if (!weather) {
    return null;
  }

  return (
    <>
      <div className="weather-heading">
        <div>
          <p className="eyebrow">CURRENT WEATHER</p>

          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <p className="muted">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>

          {lastUpdated && (
            <p className="muted">Last updated: {lastUpdated}</p>
          )}
        </div>

        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="refresh-button"
      >
        ↻ Refresh weather
      </button>

      <div className="temperature-row">
        <h3>{Math.round(weather.main.temp)}°C</h3>

        <div>
          <p className="weather-condition">
            {weather.weather[0].description}
          </p>

          <p className="muted">
            Feels like {Math.round(weather.main.feels_like)}°C
          </p>
        </div>
      </div>
    </>
  );
}

export default WeatherCard;
