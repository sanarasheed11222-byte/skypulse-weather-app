import { useEffect, useRef } from 'react';

const LAYERS = [
  { id: 'clouds_new', label: '☁️ Clouds' },
  { id: 'precipitation_new', label: '🌧 Rain' },
  { id: 'wind_new', label: '💨 Wind' },
  { id: 'temp_new', label: '🌡 Temp' },
];

export default function WeatherMap({ city, lat = 31.5, lon = 74.3 }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerRef = useRef(null);
  const KEY = process.env.REACT_APP_WEATHER_KEY;

  useEffect(() => {
    if (mapInstance.current) return;

    const L = window.L;
    if (!L) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 6,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(mapInstance.current);

    layerRef.current = L.tileLayer(
      `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${KEY}`,
      { opacity: 0.7 }
    ).addTo(mapInstance.current);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mapInstance.current && lat && lon) {
      mapInstance.current.setView([lat, lon], 6);
    }
  }, [lat, lon]);

  const switchLayer = (layerId) => {
    const L = window.L;
    if (!L || !mapInstance.current) return;
    if (layerRef.current) mapInstance.current.removeLayer(layerRef.current);
    layerRef.current = L.tileLayer(
      `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${KEY}`,
      { opacity: 0.7 }
    ).addTo(mapInstance.current);
  };

  return (
    <div className="forecast-card">
      <div className="forecast-title">🗺 Weather Map</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {LAYERS.map((l) => (
          <button
            key={l.id}
            onClick={() => switchLayer(l.id)}
            style={{
              padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--glass-border)',
              background: 'var(--glass)', color: 'var(--text)', cursor: 'pointer',
              fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--glass)'}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div ref={mapRef} style={{ height: '320px', borderRadius: '16px', overflow: 'hidden', zIndex: 1 }} />
    </div>
  );
}