import axios from 'axios';

const API = axios.create({ baseURL: 'https://skypulse-weather-app-nine.vercel.app/api' });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getCurrentWeather = (city) => API.get(`/weather/current?city=${city}`);
export const getForecast = (city) => API.get(`/weather/forecast?city=${city}`);
export const getHourlyForecast = (city) => API.get(`/weather/hourly?city=${city}`);
export const getAirQuality = (city) => API.get(`/weather/air-quality?city=${city}`);
export const searchCities = (q) => API.get(`/weather/search-cities?q=${q}`);
export const addFavourite = (city) => API.post('/weather/favourites', { city });
export const removeFavourite = (city) => API.delete(`/weather/favourites/${city}`);
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);