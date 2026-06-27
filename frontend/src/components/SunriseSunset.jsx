import { Sunrise, Sunset } from 'lucide-react';

function getMoonPhase() {
  
  const known = new Date(2000, 0, 6);
  const diff = (new Date() - known) / (1000 * 60 * 60 * 24);
  const phase = diff % 29.53;
  if (phase < 1.85) return { name: 'New Moon', emoji: '🌑' };
  if (phase < 7.38) return { name: 'Waxing Crescent', emoji: '🌒' };
  if (phase < 9.22) return { name: 'First Quarter', emoji: '🌓' };
  if (phase < 14.77) return { name: 'Waxing Gibbous', emoji: '🌔' };
  if (phase < 16.61) return { name: 'Full Moon', emoji: '🌕' };
  if (phase < 22.15) return { name: 'Waning Gibbous', emoji: '🌖' };
  if (phase < 23.99) return { name: 'Last Quarter', emoji: '🌗' };
  return { name: 'Waning Crescent', emoji: '🌘' };
}

export default function SunriseSunset({ data }) {
  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  
  const moon = getMoonPhase();

  const fmt = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const totalDay = data.sys.sunset - data.sys.sunrise;
  const elapsed = Math.max(0, Math.min(Date.now() / 1000 - data.sys.sunrise, totalDay));
  const sunPercent = (elapsed / totalDay) * 100;

  const dayHours = Math.floor(totalDay / 3600);
  const dayMins = Math.floor((totalDay % 3600) / 60);

  return (
    <div className="forecast-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Sunrise/Sunset */}
        <div>
          <div className="forecast-title">🌅 Sun</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sunrise size={20} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sunrise</div>
                <div style={{ fontWeight: 700, color: 'var(--text)' }}>{fmt(sunrise)}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sunset size={20} color="#f97316" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sunset</div>
                <div style={{ fontWeight: 700, color: 'var(--text)' }}>{fmt(sunset)}</div>
              </div>
            </div>
          </div>

          {/* Sun arc progress */}
          <div style={{ position: 'relative', height: '6px', background: 'var(--glass)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${Math.min(sunPercent, 100)}%`,
              background: 'linear-gradient(90deg, #f59e0b, #f97316)',
              borderRadius: '999px',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{fmt(sunrise)}</span>
            <span>Day: {dayHours}h {dayMins}m</span>
            <span>{fmt(sunset)}</span>
          </div>
        </div>

        {/* Moon Phase */}
        <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '16px' }}>
          <div className="forecast-title">🌙 Moon Phase</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
            <div style={{ fontSize: '3.5rem' }}>{moon.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{moon.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Tonight</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}