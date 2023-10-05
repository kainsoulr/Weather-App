import { useState } from "react";
import axios from 'axios'
import { HiLocationMarker } from "react-icons/hi";
import { TiLocationOutline } from "react-icons/ti";
import moment from "moment";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=`
  const api_key = 'aaad3539bc069b2121d18b1cdaac2088'


  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url + api_key)
        .then(response => {
          setData(response.data);
          setError(null);
        })
        .catch(error => {
          if (error.response.status === 404) {
            setError('No se ha encontrado esta ciudad');
          } else {
            setError('Error desconocido');
          }
          setData({});
        });
    }
  };

  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273;
  };

  return (
    <div className="App">
      <div className="searchTab">
        <input
          className="locationSearch input"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Buscar..."
          type="text"
        />
        <HiLocationMarker className="weatherIcon input" />
      </div>
      {!data.name ? 
      <section className="weather-container">
        <div className="container-top">
            <div>
              <h1 className="weather-title">Busque una ciudad</h1>
              <img 
              className="waiting-gif"
              src={`${process.env.PUBLIC_URL}/assets/waiting.gif`}
              alt="Esperando pronóstico del tiempo"
              >
              </img>
            </div>
          </div>
      </section> :
      <section className="weather-container">
        {data.wind && data.dt && data.main && data.weather && data.weather[0] ? (
          <div className="container-top">
            <div>
              <h1 className="weather-title">Hoy</h1>
              <p className="paragraph">{data.wind.speed.toFixed()}km/h</p>
            </div>
            <p className="paragraph">
              {moment(new Date(data.dt * 1000)).format("D MMM YY")}{" "}
              {moment(new Date(data.dt * 1000)).format("h:mm a")}
            </p>
          </div>
        ) : null}
        {data.main && data.weather && data.weather[0] ? (
          <div className="container-mid">
            <span className="weather-temp-main">
              {kelvinToCelsius(data.main.temp).toFixed()}°C
            </span>
            <img
            className="iconWeather"
              width="220"
              height="220"
              src={`${process.env.PUBLIC_URL}/assets/weather_icons/${data.weather[0].icon}.png`}
              alt={data.weather[0].description}
            />
          </div>
        ) : null}
        {data.name ? (
          <div className="container-bot">
            <TiLocationOutline className="weather-icon-location" />
            <p className="paragraph">
              {error ? <h1>{error}</h1> : <h1>{data.name}</h1>}
            </p>
          </div>
        ) : null}
      </section>
      }
    </div>
  );
  
}

export default App;
