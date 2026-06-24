const AQI_LEVELS = [
  { label: 'Good', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  { label: 'Fair', color: '#84cc16', bg: 'rgba(132,204,22,0.15)' },
  { label: 'Moderate', color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
  { label: 'Poor', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  { label: 'Very Poor', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
];

export default function AirQuality({ data }) {
  if (!data?.list?.length) return null;
  const aqi = data.list[0].main.aqi;
  const level = AQI_LEVELS[aqi - 1];
  const components = data.list[0].components;
  const percent = (aqi / 5) * 100;

  return (
    <div className="forecast-card">
      <div className="forecast-title">💨 Air Quality Index</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: level.bg, border: `3px solid ${level.color}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: level.color }}>{aqi}</span>
        </div>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: level.color }}>{level.label}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Air Quality</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'var(--glass)', borderRadius: '999px', height: '8px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${percent}%`,
          background: `linear-gradient(90deg, #22c55e, #eab308, #ef4444)`,
          borderRadius: '999px', transition: 'width 0.8s ease',
        }} />
      </div>

      {/* Pollutants */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {[
          { label: 'PM2.5', value: components.pm2_5?.toFixed(1) },
          { label: 'PM10', value: components.pm10?.toFixed(1) },
          { label: 'NO₂', value: components.no2?.toFixed(1) },
          { label: 'O₃', value: components.o3?.toFixed(1) },
          { label: 'SO₂', value: components.so2?.toFixed(1) },
          { label: 'CO', value: components.co?.toFixed(1) },
        ].map((p) => (
          <div key={p.label} style={{
            background: 'var(--glass)', border: '1px solid var(--glass-border)',
            borderRadius: '12px', padding: '12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{p.label}</div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>{p.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>μg/m³</div>
          </div>
        ))}
      </div>
    </div>
  );
}