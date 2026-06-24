require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/weather', require('./routes/weather'));

app.get('/', (req, res) => res.json({ message: 'SkyPulse API running' }));

module.exports = app;