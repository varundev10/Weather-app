import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TABS = ["Forecast", "Today", "Tomorrow", "History"];

function App() {
  const [city, setCity] = useState("Delhi");
  const [date] = useState("Today");
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);
  const [activeTab, setActiveTab] = useState("Forecast");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentCities")) || [];
    setRecent(saved);
  }, []);

  const saveRecent = (cityName) => {
    let updated = [cityName, ...recent.filter((c) => c.toLowerCase() !== cityName.toLowerCase())];
    updated = updated.slice(0, 7);
    setRecent(updated);
    localStorage.setItem("recentCities", JSON.stringify(updated));
  };

  const fetchByCity = async (cityName) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/weather/city?city=${encodeURIComponent(cityName)}`);
      setWeather(data);
      setCity(data.name);
      saveRecent(data.name);
    } catch (err) {
      setError("City not found.");
      setWeather(null);
    }
    setLoading(false);
  };

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/weather/coords?lat=${lat}&lon=${lon}`);
      setWeather(data);
      setCity(data.name);
      saveRecent(data.name);
    } catch (err) {
      setError("Unable to fetch weather for your location.");
      setWeather(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!weather) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            fetchByCoords(pos.coords.latitude, pos.coords.longitude);
          },
          () => setError("Geolocation permission denied.")
        );
      } else {
        setError("Geolocation not supported.");
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) fetchByCity(query.trim());
  };

  const handleRecentClick = (cityName) => {
    fetchByCity(cityName);
  };

  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      setError("");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setError("Geolocation permission denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
    }
  };

  return (
    <div className="app-root">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span role="img" aria-label="cloud">🌤️</span>
          <span className="logo-text">Ease Weather</span>
        </div>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a location"
          />
          <button className="menu-btn cool-btn" type="submit">🔍</button>
        </form>
        <button
          className="current-location-btn cool-btn"
          type="button"
          onClick={handleCurrentLocation}
        >
          📍 Current Weather
        </button>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab cool-btn${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="main-content">
        {/* Left: Main Weather Card */}
        <div className="weather-section">
          {/* Tab content */}
          {(activeTab === "Forecast" || activeTab === "Today") && (
            <>
              {/* City and Date Dropdowns */}
              <div className="controls">
                <select value={city} onChange={e => fetchByCity(e.target.value)} className="cool-btn">
                  {[city, ...recent.filter(c => c !== city)].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select value={date} disabled className="cool-btn">
                  <option>Today</option>
                  <option>Tomorrow</option>
                </select>
              </div>

              {/* Recent cities */}
              <div className="recent-cities" style={{ marginBottom: "1rem" }}>
                {recent.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleRecentClick(c)}
                    className="cool-btn"
                    style={{
                      margin: "0 0.25rem",
                      padding: "0.25rem 0.75rem",
                      border: "none",
                      background: "#e5e7eb",
                      borderRadius: "0.5rem",
                      cursor: "pointer"
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Weather Card */}
              <div className="weather-card">
                {loading && <p>Loading...</p>}
                {error && <p className="error">{error}</p>}
                {weather && (
                  <>
                    <h2>
                      Today weather in {weather.name}, {weather.sys.country}
                    </h2>
                    <div className="weather-date">
                      {new Date(weather.dt * 1000).toLocaleDateString(undefined, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </div>
                    <div className="weather-main">
                      <div className="weather-icon">
                        <img
                          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                          alt={weather.weather[0].description}
                        />
                      </div>
                      <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
                      <div className="weather-desc">{weather.weather[0].description}</div>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}>
                      <li>Humidity: {weather.main.humidity}%</li>
                      <li>Wind: {weather.wind.speed} m/s</li>
                      <li>Visibility: {weather.visibility / 1000} km</li>
                    </ul>
                    <div className="weather-summary">
                      {weather.name} is currently experiencing {weather.weather[0].description}. The temperature is {Math.round(weather.main.temp)}°C with humidity at {weather.main.humidity}%. Wind speed is {weather.wind.speed} m/s and visibility is {weather.visibility / 1000} km.
                    </div>
                  </>
                )}
                {!loading && !weather && !error && (
                  <div style={{ color: "#888" }}>Search for a city to see the weather.</div>
                )}
              </div>
            </>
          )}

          {activeTab === "Tomorrow" && (
            <>
              <div style={{margin: "2rem 0", color: "#888"}}>
                Tomorrow's forecast feature coming soon!
              </div>
            </>
          )}

          {activeTab === "History" && (
            <div className="history-tab">
              <h2>Search History (Last 7 Locations)</h2>
              <ul>
                {recent.length === 0 && <li>No history yet.</li>}
                {recent.map((city, idx) => (
                  <li key={city + idx}>
                    <button className="cool-btn" onClick={() => fetchByCity(city)}>
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Weather Metrics Cards */}
        <aside className="weather-metrics">
          {/* Visibility Card */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>Visibility</h3>
              <div className="visibility-icon">
                <div className="visibility-line"></div>
                <div className="visibility-line"></div>
                <div className="visibility-line"></div>
              </div>
            </div>
            <div className="metric-value">
              {weather ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'}
            </div>
            <div className="metric-status">Good</div>
          </div>

          {/* Pressure Card */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>Pressure</h3>
              <div className="pressure-graphic">
                <div className="pressure-line"></div>
                <div className="pressure-handle"></div>
              </div>
            </div>
            <div className="metric-value">
              {weather ? `${weather.main.pressure} mb` : 'N/A'}
            </div>
            <div className="metric-status">Rising</div>
          </div>

          {/* Wind Card */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>Wind →</h3>
              <div className="wind-compass">
                <div className="compass-rose">
                  <span className="compass-n">N</span>
                  <span className="compass-e">E</span>
                  <span className="compass-s">S</span>
                  <span className="compass-w">W</span>
                  <div className="wind-arrow" style={{transform: `rotate(${weather ? weather.wind.deg : 0}deg)`}}></div>
                </div>
              </div>
            </div>
            <div className="metric-value">
              {weather ? `${weather.wind.speed} km/h` : 'N/A'}
            </div>
            <div className="metric-details">
              <div>Gust: {weather ? `${Math.round(weather.wind.speed * 2)} km/h` : 'N/A'}</div>
              <div>Force: 1 (Light Air)</div>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>Humidity →</h3>
              <div className="humidity-bars">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="humidity-bar" style={{height: `${Math.random() * 60 + 40}%`}}></div>
                ))}
              </div>
            </div>
            <div className="metric-value">
              {weather ? `${weather.main.humidity}%` : 'N/A'}
            </div>
            <div className="metric-status">
              {weather && weather.main.humidity > 70 ? 'Humid' : 'Normal'}
            </div>
            <div className="metric-details">
              <div>Dew Point: {weather ? `${Math.round(weather.main.temp - 5)}°` : 'N/A'}</div>
              <div>Very humid</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
