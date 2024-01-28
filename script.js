console.log('Script file loaded');

// Select the search form
const searchForm = document.getElementById('search-form');

// Add event listener for the form submission
searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission
  console.log('Search form submitted');
  
  // Get the value of the input field (city name)
  const cityName = document.getElementById('search-input').value;
  
  // Call fetchWeatherData function with the user-entered city name
  fetchWeatherData(cityName);
});

// Define the fetchWeatherData function to fetch weather data from the API
function fetchWeatherData(cityName) {
  // Construct the URL with the cityName and API key
  const apiKey = 'f8cc25c5df69892bdc6399e98142c5cd';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  // Make a GET request using fetch()
  fetch(apiUrl)
    .then(response => {
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      // Parse the JSON response
      return response.json();
    })
    .then(data => {
      // Extract the relevant weather data from the JSON response
      const cityName = data.name;
      const temperature = (data.main.temp - 273.15).toFixed(2); // Convert temperature to Celsius
      const humidity = data.main.humidity;
      const windSpeed = (data.wind.speed * 3.6).toFixed(2); // Convert wind speed to km/h

      // Update the weather dashboard with the retrieved data
      updateWeatherDashboard(cityName, temperature, humidity, windSpeed);

      // Fetch the 5-day forecast for the city
      fetchForecastData(cityName);
    })
    .catch(error => {
      // Handle any errors that occur during the fetch request
      console.error('Error fetching weather data:', error.message);
    });
}

// Define the fetchForecastData function to fetch the 5-day forecast from the API
function fetchForecastData(cityName) {
  // Construct the URL for forecast data with the cityName and API key
  const apiKey = 'f8cc25c5df69892bdc6399e98142c5cd';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  // Make a GET request using fetch()
  fetch(apiUrl)
    .then(response => {
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      // Parse the JSON response
      return response.json();
    })
    .then(data => {
      // Extract the relevant forecast data from the JSON response
      const forecastList = data.list.slice(0, 5); // Get the first 5 forecast entries

      // Update the forecast section with the retrieved data
      updateForecastSection(forecastList);
    })
    .catch(error => {
      // Handle any errors that occur during the fetch request
      console.error('Error fetching forecast data:', error.message);
    });
}

// Define the updateForecastSection function to update the UI with forecast data
function updateForecastSection(forecastList) {
  // Select the forecast section
  const forecastSection = document.getElementById('forecast');

  // Clear any existing forecast data
  forecastSection.innerHTML = '';

  // Loop through the forecast data and create HTML elements to display it
  forecastList.forEach((forecast, index) => {
    // Calculate the date for the forecast
    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + index + 1); // Increment date by index + 1 (next day)
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const forecastDateString = forecastDate.toLocaleDateString('en-GB', dateOptions);

    const forecastTemperature = (forecast.main.temp - 273.15).toFixed(2); // Convert temperature to Celsius
    const forecastHumidity = forecast.main.humidity;
    const forecastWindSpeed = (forecast.wind.speed * 3.6).toFixed(2); // Convert wind speed to km/h

    // Create forecast card HTML
    const forecastCard = `
      <div class="col-md-2 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${forecastDateString}</h5>
            <p class="card-text">Temperature: ${forecastTemperature} °C</p>
            <p class="card-text">Humidity: ${forecastHumidity} %</p>
            <p class="card-text">Wind Speed: ${forecastWindSpeed} km/h</p>
          </div>
        </div>
      </div>
    `;

    // Append the forecast card HTML to the forecast section
    forecastSection.insertAdjacentHTML('beforeend', forecastCard);
  });
}

// Define the updateWeatherDashboard function to update the UI with weather data
function updateWeatherDashboard(cityName, temperature, humidity, windSpeed) {
  // Update the weather title with the city name and date
  const weatherTitle = document.getElementById('weather-title');
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB');
  weatherTitle.textContent = `${cityName} (${formattedDate})`;

  // Update the weather details with the retrieved data
  const temperatureElement = document.getElementById('temperature');
  temperatureElement.textContent = `${temperature} °C`;

  const humidityElement = document.getElementById('humidity');
  humidityElement.textContent = `${humidity} %`;

  const windSpeedElement = document.getElementById('wind-speed');
  windSpeedElement.textContent = `${windSpeed} km/h`;
}
