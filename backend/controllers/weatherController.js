const axios = require('axios');
const User = require('../models/User');

const RAPID_KEY = process.env.RAPIDAPI_KEY;

async function getCoordsFromCity(city) {
  const KEY = process.env.WEATHER_API_KEY;
  const res = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
    params: { q: city, limit: 1, appid: KEY },
  });
  if (!res.data.length) throw new Error('City not found');
  const { lat, lon, name, country } = res.data[0];
  return { lat, lon, name, country };
}

function getWeatherInfo(code) {
  const map = {
    0:  { desc: 'Clear Sky', icon: '01d' },
    1:  { desc: 'Mainly Clear', icon: '01d' },
    2:  { desc: 'Partly Cloudy', icon: '02d' },
    3:  { desc: 'Overcast', icon: '04d' },
    45: { desc: 'Foggy', icon: '50d' },
    48: { desc: 'Icy Fog', icon: '50d' },
    51: { desc: 'Light Drizzle', icon: '09d' },
    53: { desc: 'Moderate Drizzle', icon: '09d' },
    55: { desc: 'Dense Drizzle', icon: '09d' },
    56: { desc: 'Freezing Drizzle', icon: '09d' },
    57: { desc: 'Heavy Freezing Drizzle', icon: '09d' },
    61: { desc: 'Slight Rain', icon: '10d' },
    63: { desc: 'Moderate Rain', icon: '10d' },
    65: { desc: 'Heavy Rain', icon: '10d' },
    66: { desc: 'Freezing Rain', icon: '13d' },
    67: { desc: 'Heavy Freezing Rain', icon: '13d' },
    71: { desc: 'Slight Snow', icon: '13d' },
    73: { desc: 'Moderate Snow', icon: '13d' },
    75: { desc: 'Heavy Snow', icon: '13d' },
    77: { desc: 'Snow Grains', icon: '13d' },
    80: { desc: 'Slight Showers', icon: '09d' },
    81: { desc: 'Moderate Showers', icon: '09d' },
    82: { desc: 'Violent Showers', icon: '09d' },
    85: { desc: 'Slight Snow Showers', icon: '13d' },
    86: { desc: 'Heavy Snow Showers', icon: '13d' },
    95: { desc: 'Thunderstorm', icon: '11d' },
    96: { desc: 'Thunderstorm with Hail', icon: '11d' },
    99: { desc: 'Thunderstorm with Heavy Hail', icon: '11d' },
  };
  return map[code] || { desc: 'Clear Sky', icon: '01d' };
}

exports.getCurrentWeather = async (req, res) => {
  const { city } = req.query;
  try {
    const { lat, lon, name, country } = await getCoordsFromCity(city);

    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat, longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility',
        daily: 'sunrise,sunset',
        timezone: 'auto',
        forecast_days: 1,
      },
    });

    const c = data.current;
    const info = getWeatherInfo(c.weather_code);
    const mainCondition =
      c.weather_code === 0 || c.weather_code === 1 ? 'Clear' :
      c.weather_code === 2 || c.weather_code === 3 ? 'Clouds' :
      c.weather_code >= 51 && c.weather_code <= 67 ? 'Rain' :
      c.weather_code >= 71 && c.weather_code <= 77 ? 'Snow' :
      c.weather_code >= 80 && c.weather_code <= 82 ? 'Rain' :
      c.weather_code >= 85 && c.weather_code <= 86 ? 'Snow' :
      c.weather_code >= 95 ? 'Thunderstorm' :
      c.weather_code >= 45 ? 'Mist' : 'Clear';

    res.json({
      name,
      sys: {
        country,
        sunrise: new Date(data.daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(data.daily.sunset[0]).getTime() / 1000,
      },
      coord: { lat, lon },
      weather: [{ main: mainCondition, description: info.desc, icon: info.icon }],
      main: {
        temp: c.temperature_2m,
        feels_like: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        pressure: c.surface_pressure,
        temp_max: c.temperature_2m + 2,
        temp_min: c.temperature_2m - 8,
      },
      wind: { speed: c.wind_speed_10m, deg: c.wind_direction_10m },
      visibility: c.visibility ? Math.min(c.visibility, 10) * 1000 : 10000,
    });
  } catch (err) {
    res.status(404).json({ message: 'City not found' });
  }
};

exports.getForecast = async (req, res) => {
  const { city } = req.query;
  try {
    const { lat, lon, name, country } = await getCoordsFromCity(city);

    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat, longitude: lon,
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
        timezone: 'auto',
        forecast_days: 7,
      },
    });

    const d = data.daily;
    const list = d.time.map((date, i) => {
      const info = getWeatherInfo(d.weather_code[i]);
      return {
        dt: new Date(date).getTime() / 1000,
        dt_txt: `${date} 12:00:00`,
        main: {
          temp: (d.temperature_2m_max[i] + d.temperature_2m_min[i]) / 2,
          temp_max: d.temperature_2m_max[i],
          temp_min: d.temperature_2m_min[i],
          humidity: d.precipitation_probability_max[i] || 0,
        },
        weather: [{ main: 'Clear', description: info.desc, icon: info.icon }],
        wind: { speed: d.wind_speed_10m_max[i] },
      };
    });

    res.json({ city: { name, country }, list });
  } catch (err) {
    res.status(404).json({ message: 'City not found' });
  }
};

exports.getHourlyForecast = async (req, res) => {
  const { city } = req.query;
  try {
    const { lat, lon } = await getCoordsFromCity(city);

    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat, longitude: lon,
        hourly: 'temperature_2m,relative_humidity_2m,weather_code',
        timezone: 'auto',
        forecast_days: 1,
      },
    });

    const h = data.hourly;
    const list = h.time.slice(0, 8).map((time, i) => {
      const info = getWeatherInfo(h.weather_code[i]);
      return {
        dt: new Date(time).getTime() / 1000,
        dt_txt: time,
        main: { temp: h.temperature_2m[i], humidity: h.relative_humidity_2m[i] },
        weather: [{ description: info.desc, icon: info.icon }],
      };
    });

    res.json({ list });
  } catch (err) {
    res.status(404).json({ message: 'City not found' });
  }
};

exports.getAirQuality = async (req, res) => {
  const { city } = req.query;
  try {
    const { lat, lon } = await getCoordsFromCity(city);
    const KEY = process.env.WEATHER_API_KEY;
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
      params: { lat, lon, appid: KEY },
    });
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: 'Could not get air quality' });
  }
};

exports.searchCities = async (req, res) => {
  const { q } = req.query;
  try {
    const { data } = await axios.get(
      'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      {
        params: { namePrefix: q, limit: 5, sort: '-population' },
        headers: {
          'x-rapidapi-key': RAPID_KEY,
          'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        },
      }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
};

exports.addFavourite = async (req, res) => {
  const { city } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user.favourites.includes(city)) {
      user.favourites.push(city);
      await user.save();
    }
    res.json({ favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFavourite = async (req, res) => {
  const { city } = req.params;
  try {
    const user = await User.findById(req.user.id);
    user.favourites = user.favourites.filter((c) => c !== city);
    await user.save();
    res.json({ favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};