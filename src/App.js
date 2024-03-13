
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Puff } from 'react-loader-spinner';
import {
  WiDaySunny,
  WiDayRain,
  WiDaySnow,
  WiDaySleet,
  WiDayFog,
  WiDayCloudy,
  WiDayThunderstorm,
  WiNightClear,
  WiNightRain,
  WiNightSnow,
  WiNightSleet,
  WiNightFog,
  WiNightCloudy,
  WiNightThunderstorm,
} from 'weather-icons-react';
import moment from 'moment';
import './App.css';

const API_KEY = '3tDruAWBSrefnG1Au5WmyYuwn8NHSXwm';
const BASE_URL = 'https://api.tomorrow.io/v4/timelines';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');

  useEffect(() => {
    const fetchData = async () => {
      const locations = [
        { name: "St. John's", lat: 47.5615, lng: -52.7126 },
        { name: 'Witless Bay', lat: 47.2765, lng: -52.8296 },
        { name: 'Gander', lat: 48.9542, lng: -54.6053 },
        { name: 'Long Harbour', lat: 47.4275, lng: -53.8665 },
        { name: 'Grand Falls-Windsor', lat: 48.9355, lng: -55.6403 },
        { name: 'Corner Brook', lat: 48.9500, lng: -57.9500 },
        { name: 'Port aux Basques', lat: 47.5667, lng: -59.1333 },
        { name: 'Gros Morne', lat: 49.6667, lng: -57.7833 },
        { name: 'St. Anthony', lat: 51.3837, lng: -55.5970 }
      ];

      const fields = [
        'temperature',
        'windSpeed',
        'humidity',
        'precipitationIntensity',
        'weatherCode',
      ];

      const requests = locations.map(loc =>
        axios.get(BASE_URL, {
          params: {
            apikey: API_KEY,
            location: `${loc.lat},${loc.lng}`,
            fields: fields.join(','),
            timesteps: '1d',
            units: unit === 'C' ? 'metric' : 'imperial',
          }
        })
      );

      try {
        const responses = await Promise.all(requests);
        const data = responses.map((res, i) => ({
          location: locations[i],
          current: res.data.data.timelines[0].intervals[0].values,
          daily: res.data.data.timelines[0].intervals
        }));
        setWeatherData(data);
      } catch (err) {
        setError('Failed to load weather data. Please try again later.');
      }
      setLoading(false);
    };

    fetchData();
  }, [unit]);

  if (loading) {
    return <Puff color="#00BFFF" height={100} width={100} />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <header>
        <h1>RockDrizzle</h1>
        <button onClick={() => setUnit(unit === "C" ? "F" : "C")}>
          Display °{unit === "C" ? "F" : "C"}
        </button>
      </header>
      <main>
        {weatherData.map((data) => (
          <div key={data.location.name} className="weather-card">
            <h2>{data.location.name}</h2>
            <div className="current">
              {(data.current.weatherCode === 1000 || data.current.weatherCode === 1100) && (
                <WiDaySunny size={36} />
              )}
              {data.current.weatherCode === 4000 && <WiDayRain size={36} />}
              {data.current.weatherCode === 5000 && <WiDaySnow size={36} />}
              {data.current.weatherCode === 6000 && <WiDaySleet size={36} />}
              {data.current.weatherCode === 2000 && <WiDayFog size={36} />}
              {data.current.weatherCode === 1101 && <WiDayCloudy size={36} />}
              {data.current.weatherCode === 8000 && <WiDayThunderstorm size={36} />}
              {(data.current.weatherCode === 1000 || data.current.weatherCode === 1100) && (
                <WiNightClear size={36} />
              )}
              {data.current.weatherCode === 4000 && <WiNightRain size={36} />}
              {data.current.weatherCode === 5000 && <WiNightSnow size={36} />}
              {data.current.weatherCode === 6000 && <WiNightSleet size={36} />}
              {data.current.weatherCode === 2000 && <WiNightFog size={36} />}
              {data.current.weatherCode === 1101 && <WiNightCloudy size={36} />}
              {data.current.weatherCode === 8000 && <WiNightThunderstorm size={36} />}
              <div>
                <div className="temp">
                  {Math.round(data.current.temperature)}°{unit}
                </div>
                <div className="condition">{data.current.weatherCode}</div>
              </div>
            </div>
            <div className="details">
              <div>
                <span>Precipitation:</span>
                <span>
                  {data.current.precipitationIntensity}{" "}
                  {unit === "C" ? "mm/hr" : "in/hr"}
                </span>
              </div>
              <div>
                <span>Humidity:</span>
                <span>{data.current.humidity}%</span>
              </div>
              <div>
                <span>Wind:</span>
                <span>
                  {Math.round(data.current.windSpeed)}{" "}
                  {unit === "C" ? "km/h" : "mph"}
                </span>
              </div>
            </div>
            <div className="daily-forecast">
              <h3>7-Day Forecast</h3>
              <ul>
                {data.daily.slice(1).map((day) => (
                  <li key={day.startTime}>
                    <div className="day">
                      {moment(day.startTime).format('ddd')}
                    </div>
                    {(day.values.weatherCode === 1000 || day.values.weatherCode === 1100) && (
                      <WiDaySunny size={24} />
                    )}
                    {day.values.weatherCode === 4000 && <WiDayRain size={24} />}
                    {day.values.weatherCode === 5000 && <WiDaySnow size={24} />}
                    {day.values.weatherCode === 6000 && <WiDaySleet size={24} />}
                    {day.values.weatherCode === 2000 && <WiDayFog size={24} />}
                    {day.values.weatherCode === 1101 && <WiDayCloudy size={24} />}
                    {day.values.weatherCode === 8000 && <WiDayThunderstorm size={24} />}
                    {(day.values.weatherCode === 1000 || day.values.weatherCode === 1100) && (
                      <WiNightClear size={24} />
                    )}
                    {day.values.weatherCode === 4000 && <WiNightRain size={24} />}
                    {day.values.weatherCode === 5000 && <WiNightSnow size={24} />}
                    {day.values.weatherCode === 6000 && <WiNightSleet size={24} />}
                    {day.values.weatherCode === 2000 && <WiNightFog size={24} />}
                    {day.values.weatherCode === 1101 && <WiNightCloudy size={24} />}
                    {day.values.weatherCode === 8000 && <WiNightThunderstorm size={24} />}
                    <div className="temp">
                      {Math.round(day.values.temperatureMax)}°{unit} /
                      {Math.round(day.values.temperatureMin)}°{unit}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </main>
      <footer>
        Powered by <a href="https://www.tomorrow.io/">Tomorrow.io</a>
      </footer>
    </div>
  );
}

export default App;
