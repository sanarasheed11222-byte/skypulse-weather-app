const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCurrentWeather,
  getForecast,
  getAirQuality,
  getHourlyForecast,
  searchCities,
  addFavourite,
  removeFavourite,
} = require('../controllers/weatherController');

router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/hourly', getHourlyForecast);
router.get('/air-quality', getAirQuality);
router.get('/search-cities', searchCities);
router.post('/favourites', protect, addFavourite);
router.delete('/favourites/:city', protect, removeFavourite);

module.exports = router;