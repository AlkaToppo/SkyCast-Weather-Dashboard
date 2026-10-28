
function HourlyForecast({ forecast }) {
  return (
    <section className="hourly-section">
      <p className="section-label">COMING UP</p>
      <h2>Hourly Forecast</h2>

      <div className="hourly-grid">
        {forecast.length > 0 ? (
          forecast.slice(0, 8).map((item) => (
            <div className="hourly-card" key={item.dt}>
              <p>
                {new Date(item.dt * 1000).toLocaleTimeString("en-IN", {
                  hour: "numeric",
                  hour12: true,
                })}
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                alt={item.weather[0].description}
              />

              <h3>{Math.round(item.main.temp)}°C</h3>
              <p>{item.weather[0].description}</p>
            </div>
          ))
        ) : (
          <p>Search a city to load the hourly forecast.</p>
        )}
      </div>
    </section>
  );
}

export default HourlyForecast;
