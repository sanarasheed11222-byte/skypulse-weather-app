import { Droplets } from 'lucide-react';

export default function HourlyForecast({ data }) {
  const hours = data.list.slice(0, 8);

  return (
    <div className="forecast-card">
      <div className="forecast-title">⏱ Hourly Forecast — Next 24hrs</div>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
        {hours.map((h) => (
          <div key={h.dt} style={{
            minWidth: '90px',
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            padding: '14px 10px',
            textAlign: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {new Date(h.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <img
              src={`https://openweathermap.org/img/wn/${h.weather[0].icon}.png`}
              alt=""
              style={{ width: '44px', height: '44px', margin: '4px auto' }}
            />
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
              {Math.round(h.main.temp)}°
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '4px' }}>
              <Droplets size={11} color="#60a5fa" />
              <span style={{ fontSize: '0.75rem', color: '#60a5fa' }}>{h.main.humidity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}