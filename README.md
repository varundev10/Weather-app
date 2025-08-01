# Ease Weather App

A modern, full-stack weather dashboard built with React and Express, styled for a clean and responsive look.

## 🚀 Live Demo

👉 [Live Weather App](https://weather-app-tau-ten-68.vercel.app/)



## Features

- Detects your current location and shows weather
- Search for any city and get current weather
- Displays:
  - City name and country
  - Temperature (°C)
  - Humidity, wind speed, visibility
  - Weather description and icon
- Recent search history (last 7 cities)
- Quick sidebar
- Responsive, modern UI with cool hover effects
- Backend proxy for secure OpenWeatherMap API key
- Error and loading state handling

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- OpenWeatherMap API key (free at https://openweathermap.org/api)

### Setup

1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. **Backend setup:**
   ```sh
   cd backend
   npm install
   # Create .env file with your API key:
   echo OPENWEATHER_API_KEY=your_api_key_here > .env
   npm start
   ```

3. **Frontend setup:**
   ```sh
   cd ../frontend
   npm install
   # Create .env file with backend URL:
   echo REACT_APP_BACKEND_URL=http://localhost:5000 > .env
   npm start
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Project Structure

```
weather-app/
  backend/
    index.js
    package.json
    .env.example
  frontend/
    src/
      App.js
      App.css
    package.json
    .env.example
```

## Customization
- To use real hourly or forecast data, connect to OpenWeatherMap's One Call API and update the hourly table.
- You can further style the app in `App.css`.

## License
MIT
