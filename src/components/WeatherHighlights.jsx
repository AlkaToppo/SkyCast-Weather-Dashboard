
function WeatherHighlights({ weather }) {
  if (!weather) return null;

  const highlights = [
    {
      icon: "💧",
      label: "Humidity",
      value: `${weather.main.humidity}%`,
    },
    {
      icon: "💨",
      label: "Wind speed",
      value: `${weather.wind.speed} m/s`,
    },
    {
      icon: "🌡️",
      label: "Feels like",
      value: `${Math.round(weather.main.feels_like)}°C`,
    },
    {
      icon: "👁️",
      label: "Visibility",
      value:
        weather.visibility != null
          ? `${(weather.visibility / 1000).toFixed(1)} km`
          : "N/A",
    },
  ];

  return (
    <div className="details-grid">
      {highlights.map((item) => (
        <div className="detail-card" key={item.label}>
          <span>{item.icon}</span>
          <p>{item.label}</p>
          <h3>{item.value}</h3>
        </div>
      ))}
    </div>
  );
}

export default WeatherHighlights;
