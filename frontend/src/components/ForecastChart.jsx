import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ForecastChart({ data }) {
  const daily = data.list.filter((i) => i.dt_txt.includes('12:00:00')).slice(0, 5);
  const chartData = daily.map((i) => ({
    day: new Date(i.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    temp: Math.round(i.main.temp),
    feels: Math.round(i.main.feels_like),
  }));

  return (
    <div className="forecast-card">
      <div className="forecast-title">5-Day Forecast</div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} unit="°" />
          <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '10px', color: '#f1f5f9' }} formatter={(v, n) => [`${v}°C`, n]} />
          <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} name="Temp" />
          <Line type="monotone" dataKey="feels" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Feels like" />
        </LineChart>
      </ResponsiveContainer>
      <div className="day-cards">
        {daily.map((i) => (
          <div key={i.dt} className="day-card">
            <div className="day-name">{new Date(i.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <img src={`https://openweathermap.org/img/wn/${i.weather[0].icon}.png`} alt="" className="day-icon" />
            <div className="day-temp">{Math.round(i.main.temp)}°</div>
            <div className="day-min">{Math.round(i.main.temp_min)}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}