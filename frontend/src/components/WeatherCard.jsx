import { Wind, Droplets, Eye, Thermometer, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addFavourite, removeFavourite } from '../services/weatherService';

const bgMap = {
  Clear: 'bg-clear', Clouds: 'bg-clouds', Rain: 'bg-rain',
  Snow: 'bg-snow', Thunderstorm: 'bg-thunderstorm', Drizzle: 'bg-drizzle',
};

export default function WeatherCard({ data }) {
  const { user, updateFavourites } = useAuth();
  const bg = bgMap[data.weather[0].main] || 'bg-default';
  const isFav = user?.favourites?.includes(data.name);

  const toggleFav = async () => {
    if (!user) return alert('Login to save favourites!');
    try {
      if (isFav) {
        const res = await removeFavourite(data.name);
        updateFavourites(res.data.favourites);
      } else {
        const res = await addFavourite(data.name);
        updateFavourites(res.data.favourites);
      }
    } catch { alert('Something went wrong'); }
  };

  return (
    <div className={`weather-card ${bg}`}>
      <div className="card-top">
        <div>
          <div className="city-name">{data.name}, {data.sys.country}</div>
          <div className="condition">{data.weather[0].description}</div>
        </div>
        <div className="card-right">
          <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="" className="weather-icon" />
          <button onClick={toggleFav} className="btn-fav">
            <Heart size={20} fill={isFav ? 'white' : 'none'} />
          </button>
        </div>
      </div>
      <div className="temp-display">
        <span className="temp-big">{Math.round(data.main.temp)}°</span>
        <span className="temp-unit">C</span>
      </div>
      <div className="feels-like">Feels like {Math.round(data.main.feels_like)}°C · High {Math.round(data.main.temp_max)}° · Low {Math.round(data.main.temp_min)}°</div>
      <div className="stats-grid">
        <div className="stat-item"><Droplets size={18}/><div><div className="stat-label">Humidity</div><div className="stat-value">{data.main.humidity}%</div></div></div>
        <div className="stat-item"><Wind size={18}/><div><div className="stat-label">Wind</div><div className="stat-value">{data.wind.speed} m/s</div></div></div>
        <div className="stat-item"><Eye size={18}/><div><div className="stat-label">Visibility</div><div className="stat-value">{(data.visibility/1000).toFixed(1)} km</div></div></div>
        <div className="stat-item"><Thermometer size={18}/><div><div className="stat-label">Pressure</div><div className="stat-value">{data.main.pressure} hPa</div></div></div>
      </div>
    </div>
  );
}