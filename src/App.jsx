import { useState, useEffect } from 'react';
import './App.css';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import { WEATHER_API_URL, WEATHER_API_KEY } from './api';
import Forecast from './components/forecast/forecast';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  function handleOnSearchChange(searchData) {
    const [lat, lon] = searchData.value.split(" ");

    const CurrentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([CurrentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <div className='container'>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
        <Search onSearchChange={handleOnSearchChange} />
        
        {currentWeather === null && forecast === null && (
          <div className="empty-state">
            <div className="weather-illustration">
              <div className="sun"></div>
              <div className="cloud"></div>
              <div className="cloud cloud-2"></div>
            </div>
            <h2>Discover Weather Anywhere</h2>
            <p className="subtext">Search for a city to get the current weather and forecast</p>
            <div className="features">
              <div className="feature">
                <span>🌡️</span>
                <p>Real-time temperature</p>
              </div>
              <div className="feature">
                <span>💨</span>
                <p>Wind conditions</p>
              </div>
              <div className="feature">
                <span>🌧️</span>
                <p>Precipitation forecast</p>
              </div>
            </div>
          </div>
        )}

        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast && <Forecast data={forecast} />}
      </div>
      <footer className="footer" style={{ backgroundColor: theme === "light" ? "#f1f1f1" : "#333", color: theme === "light" ? "#000" : "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", bottom: 0, width: "auto", marginTop: "78px" }}>
        &copy; {new Date().getFullYear()} Weather App. All rights reserved.
      </footer>
    </>
  );
}

export default App;