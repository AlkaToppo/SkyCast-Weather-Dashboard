
function FiveDayForecast({ forecast }) {
  // Group forecast readings by date
  const groupedForecast = forecast.reduce((days, item) => {
    const date = item.dt_txt.split(" ")[0];

    if (!days[date]) {
      days[date] = [];
    }

    days[date].push(item);
    return days;
  }, {});

  // Calculate the high and low temperature for each day
  const dailyForecast = Object.entries(groupedForecast)
    .slice(0, 5)
    .map(([date, items]) => {
      // Choose the reading closest to noon for the weather icon
      const representative = items.reduce((closest, item) => {
        const hour = new Date(item.dt * 1000).getHours();
        const closestHour = new Date(closest.dt * 1000).getHours();

        return Math.abs(hour - 12) < Math.abs(closestHour - 12)
          ? item
          : closest;
      }, items[0]);

      const minTemp = Math.min(
        ...items.map((item) => item.main.temp_min ?? item.main.temp)
      );

      const maxTemp = Math.max(
        ...items.map((item) => item.main.temp_max ?? item.main.temp)
      );

      return { date, representative, minTemp, maxTemp };
    });

  return (
    <section className="forecast-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PLAN AHEAD</p>
          <h2>5-Day Forecast</h2>
        </div>
      </div>

      <div className="forecast-grid">
        {dailyForecast.length > 0 ? (
          dailyForecast.map((day) => (
            <div className="forecast-card" key={day.date}>
              <p className="forecast-day">
                {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }
                )}
              </p>

              <img
                className="forecast-icon"
                src={`https://openweathermap.org/img/wn/${day.representative.weather[0].icon}.png`}
                alt={day.representative.weather[0].description}
              />

              <h3>
                {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
              </h3>

              <p className="forecast-description">
                {day.representative.weather[0].description}
              </p>

              <div className="forecast-details">
                <span>Feels like</span>
                <strong>
                  {Math.round(day.representative.main.feels_like)}°C
                </strong>
              </div>
            </div>
          ))
        ) : (
          <div className="forecast-placeholder">
            <span>🌤️</span>
            <p>Search a city to load the forecast.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FiveDayForecast;
