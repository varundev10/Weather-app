const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(cors());

// Get weather by city
app.get('/api/weather/city', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'City not found' });
  }
});

// Get weather by coordinates
app.get('/api/weather/coords', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required' });
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Location not found' });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is live! 🌤️");
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
