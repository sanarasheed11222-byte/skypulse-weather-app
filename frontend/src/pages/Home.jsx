import { useState, useEffect } from 'react';
import SearchAutocomplete from '../components/SearchAutocomplete';
import AirQuality from '../components/AirQuality';
import SunriseSunset from '../components/SunriseSunset';
import WeatherMap from '../components/WeatherMap';
import { getCurrentWeather, getForecast, getAirQuality, addFavourite, removeFavourite } from '../services/weatherService';
import { Wind, Droplets, Eye, Thermometer, Heart, CloudSun, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const weatherBg = {
  Clear: 'linear-gradient(160deg, #0f2942 0%, #1a5276 40%, #e67e22 100%)',
  Clouds: 'linear-gradient(160deg, #1a1a2e 0%, #2c3e50 50%, #4a5568 100%)',
  Rain: 'linear-gradient(160deg, #0a0e27 0%, #1a2980 50%, #26d0ce 100%)',
  Snow: 'linear-gradient(160deg, #1a2a4a 0%, #2980b9 60%, #a8d8ea 100%)',
  Thunderstorm: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a2e 50%, #2d2d44 100%)',
  Drizzle: 'linear-gradient(160deg, #0a0e27 0%, #1565c0 60%, #42a5f5 100%)',
};

const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, updateFavourites } = useAuth();
  const [selectedDay, setSelectedDay] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true); setError('');
    try {
      const [w, f, a] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
        getAirQuality(city),
      ]);
      setWeather(w.data);
      setForecast(f.data);
      setAirQuality(a.data);
    } catch {
      setError('City not found.');
      setWeather(null); setForecast(null); setAirQuality(null);
  } finally { setLoading(false); }
  };

  useEffect(() => {
    handleSearch('Lahore');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const isFav = user?.favourites?.includes(weather?.name);

  const toggleFav = async () => {
    if (!user) return alert('Login to save favourites!');
    try {
      if (isFav) {
        const res = await removeFavourite(weather.name);
        updateFavourites(res.data.favourites);
      } else {
        const res = await addFavourite(weather.name);
        updateFavourites(res.data.favourites);
      }
    } catch { alert('Something went wrong'); }
  };

  const bg = weather
    ? (weatherBg[weather.weather[0].main] || weatherBg.Clear)
    : 'linear-gradient(160deg, #0b1120 0%, #1e293b 100%)';

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{
        width: '260px', flexShrink: 0,
        background: '#0d1117',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Search box */}
        <div style={{ padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍  Search city..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(e.target.value); }}
              style={{
                width: '100%', padding: '11px 14px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px', color: 'white',
                fontFamily: 'Inter, sans-serif', fontSize: '0.88rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {error && <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '6px', textAlign: 'center' }}>{error}</div>}
        </div>

        {/* Weekly list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
          {!forecast && !loading && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
              Search a city to see forecast
            </div>
          )}

          {forecast?.list?.map((day, i) => {
            const d = new Date(day.dt * 1000);
            const isToday = i === 0;
            return (
              <div key={day.dt} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: '10px',
                marginBottom: '2px',
                background: isToday ? 'rgba(59,130,246,0.18)' : 'transparent',
                border: `1px solid ${isToday ? 'rgba(59,130,246,0.35)' : 'transparent'}`,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
             onClick={() => setSelectedDay(i === 0 ? null : day)}
onMouseEnter={(e) => { if (!isToday) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
onMouseLeave={(e) => { if (!isToday) e.currentTarget.style.background = 'transparent'; }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'white' }}>
                    {isToday ? 'Today' : dayNames[d.getDay()]}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '1px', textTransform: 'capitalize' }}>
                    {day.weather[0].description}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="" style={{ width: '30px', height: '30px' }} />
                  <div style={{ textAlign: 'right', minWidth: '40px' }}>
                    <div style={{ fontWeight: 700, color: '#fb923c', fontSize: '0.88rem' }}>{Math.round(day.main.temp_max)}°</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{Math.round(day.main.temp_min)}°</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Saved cities */}
          {user?.favourites?.length > 0 && (
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', paddingLeft: '4px' }}>
                ⭐ Saved
              </div>
              {user.favourites.map((city) => (
                <button key={city} onClick={() => handleSearch(city)} style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.18)',
                  color: '#93c5fd', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.83rem',
                  fontWeight: 500, marginBottom: '3px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'background 0.15s',
                }}>
                  <MapPin size={12} /> {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT MAIN ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#0b1120' }}>

        {/* Empty / loading state */}
        {!weather && !loading && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
            <CloudSun size={72} />
            <p style={{ marginTop: '14px', fontSize: '1rem' }}>Search a city to get started</p>
          </div>
        )}

        {loading && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <div className="spinner" />
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Fetching weather...</p>
          </div>
        )}

        {weather && !loading && (
          <>
           {/* HERO */}
{!selectedDay ? (
  <div style={{ background: bg, padding: '36px 36px 28px', position: 'relative', overflow: 'hidden', minHeight: '220px' }}>
    <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Now</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{ fontSize: '6rem', fontWeight: 100, color: 'white', lineHeight: 1, letterSpacing: '-4px' }}>
            {Math.round(weather.main.temp)}°
          </div>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" style={{ width: '76px', height: '76px', marginBottom: '10px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
        </div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', textTransform: 'capitalize', marginTop: '2px' }}>
          {weather.weather[0].description} · Feels like {Math.round(weather.main.feels_like)}°
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>
          High: {Math.round(weather.main.temp_max)}° · Low: {Math.round(weather.main.temp_min)}°
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', letterSpacing: '-1px' }}>{weather.name}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>{weather.sys.country}</div>
        <button onClick={toggleFav} style={{
          marginTop: '14px',
          background: isFav ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '7px 16px', borderRadius: '999px',
          color: 'white', cursor: 'pointer',
          fontSize: '0.82rem', fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Heart size={13} fill={isFav ? 'white' : 'none'} />
          {isFav ? 'Saved ✓' : 'Save City'}
        </button>
      </div>
    </div>
  </div>
) : (
  /* SELECTED DAY DETAIL */
  <div style={{ background: bg, padding: '36px', position: 'relative', overflow: 'hidden', minHeight: '220px' }}>
    <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <button onClick={() => setSelectedDay(null)} style={{
        background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
        color: 'white', padding: '6px 14px', borderRadius: '999px',
        cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
        marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        ← Back to Today
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {new Date(selectedDay.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{ fontSize: '6rem', fontWeight: 100, color: 'white', lineHeight: 1, letterSpacing: '-4px' }}>
              {Math.round(selectedDay.main.temp_max)}°
            </div>
            <img src={`https://openweathermap.org/img/wn/${selectedDay.weather[0].icon}@2x.png`} alt="" style={{ width: '76px', height: '76px', marginBottom: '10px' }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', textTransform: 'capitalize' }}>
            {selectedDay.weather[0].description}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>
            High: {Math.round(selectedDay.main.temp_max)}° · Low: {Math.round(selectedDay.main.temp_min)}°
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>{weather.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>{weather.sys.country}</div>
        </div>
      </div>
    </div>
  </div>
)}

{/* CONDITIONS ROW — show for both today and selected day */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', padding: '20px 24px 0' }}>
  {[
    { icon: <Droplets size={16} color="#60a5fa"/>, label: 'Humidity', value: selectedDay ? `${selectedDay.main.humidity}%` : `${weather.main.humidity}%` },
    { icon: <Wind size={16} color="#60a5fa"/>, label: 'Wind Speed', value: selectedDay ? `${selectedDay.wind?.speed || '-'} m/s` : `${weather.wind.speed} m/s` },
    { icon: <Eye size={16} color="#60a5fa"/>, label: 'High / Low', value: selectedDay ? `${Math.round(selectedDay.main.temp_max)}° / ${Math.round(selectedDay.main.temp_min)}°` : `${Math.round(weather.main.temp_max)}° / ${Math.round(weather.main.temp_min)}°` },
    { icon: <Thermometer size={16} color="#60a5fa"/>, label: 'Pressure', value: `${weather.main.pressure} hPa` },
  ].map((s) => (
    <div key={s.label} style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '14px', padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: '10px',
    }}>
      {s.icon}
      <div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', marginTop: '2px' }}>{s.value}</div>
      </div>
    </div>
  ))}
</div>

            {/* CONDITIONS ROW */}
           

            {/* SUNRISE + AQI ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '14px 24px 0' }}>
              <SunriseSunset data={weather} />
              <AirQuality data={airQuality} />
            </div>

            {/* MAP */}
            <div style={{ padding: '14px 24px 24px' }}>
              <WeatherMap city={weather.name} lat={weather.coord.lat} lon={weather.coord.lon} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}