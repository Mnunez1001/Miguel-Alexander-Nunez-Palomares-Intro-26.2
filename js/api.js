// Footer with dynamic year and copyright information
const footer = document.getElementById("footer");
const copyright = document.createElement("p");

const today = new Date();
const thisYear = today.getFullYear();

copyright.innerHTML = `© ${thisYear} Miguel Alexander Nunez Palomares`;
footer.appendChild(copyright);

// Weather API elements /////////////////////////////////////////////////////////////////////////////////////////////////
const currentWeather = document.getElementById("current-weather");
const forecastList = document.getElementById("forecast-list");
const currentWeatherButton = document.getElementById("current-weather-button");
const forecastButton = document.getElementById("forecast-button");

function getUserLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      function (error) {
        reject(error);
      },
    );
  });
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
}

async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

  return fetchJson(url);
}

async function getForecast(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto`;

  return fetchJson(url);
}

function renderCurrentWeather(weatherData) {
  currentWeather.innerHTML = `
        <h3>Current Weather</h3>
        <p>Temperature: ${weatherData.current.temperature_2m}°F</p>
        <p>Wind Speed: ${weatherData.current.wind_speed_10m} mph</p>
    `;
}

function renderForecast(weatherData) {
  forecastList.innerHTML = "";

  for (let i = 0; i < weatherData.daily.time.length; i++) {
    const forecastItem = document.createElement("li");

    forecastItem.innerHTML = `
            <strong>${weatherData.daily.time[i]}</strong>
            <span>High: ${weatherData.daily.temperature_2m_max[i]}°F</span>
            <span>Low: ${weatherData.daily.temperature_2m_min[i]}°F</span>
            <span>Rain: ${weatherData.daily.precipitation_probability_max[i]}%</span>
        `;

    forecastList.appendChild(forecastItem);
  }
}

async function loadCurrentWeather() {
  try {
    currentWeather.innerHTML = "<p>Loading current weather...</p>";

    const location = await getUserLocation();
    const weatherData = await getCurrentWeather(
      location.latitude,
      location.longitude,
    );

    renderCurrentWeather(weatherData);
  } catch (error) {
    currentWeather.innerHTML =
      "<p>Sorry, current weather could not be loaded.</p>";
    console.error("Current weather error:", error);
  }
}

async function loadForecast() {
  try {
    forecastList.innerHTML = "<li>Loading forecast...</li>";

    const location = await getUserLocation();
    const weatherData = await getForecast(
      location.latitude,
      location.longitude,
    );

    renderForecast(weatherData);
  } catch (error) {
    forecastList.innerHTML =
      "<li>Sorry, forecast data could not be loaded.</li>";
    console.error("Forecast error:", error);
  }
}

currentWeatherButton.addEventListener("click", loadCurrentWeather);
forecastButton.addEventListener("click", loadForecast);

// GIPHY API code ///////////////////////////////////////////////////////////////////////////////////////////////////
const giphyApiKey = "6mMase2BQiR1INJk58RDNEAS0fBkWsDQ";

const trendingGifs = document.getElementById("trending-gifs");
const searchGifs = document.getElementById("search-gifs");
const gifSearchInput = document.getElementById("gif-search-input");
const gifSearchButton = document.getElementById("gif-search-button");

function displayGifs(gifArray, container) {
  container.innerHTML = "";

  for (let i = 0; i < gifArray.length; i++) {
    const gif = document.createElement("img");

    gif.src = gifArray[i].images.fixed_height.url;
    gif.alt = gifArray[i].title || "GIF image";

    container.appendChild(gif);
  }
}

async function getTrendingGifs() {
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&limit=2&rating=g`;

  return fetchJson(url);
}

async function searchForGifs(searchTerm) {
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(searchTerm)}&limit=4&rating=g`;

  return fetchJson(url);
}

async function loadTrendingGifs() {
  try {
    trendingGifs.innerHTML = "<p>Loading trending GIFs...</p>";

    const gifData = await getTrendingGifs();

    displayGifs(gifData.data, trendingGifs);
  } catch (error) {
    trendingGifs.innerHTML = "<p>Sorry, trending GIFs could not be loaded.</p>";
    console.error("Trending GIPHY error:", error);
  }
}

async function loadSearchGifs() {
  const searchTerm = gifSearchInput.value.trim();

  if (!searchTerm) {
    searchGifs.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  try {
    searchGifs.innerHTML = "<p>Loading search results...</p>";

    const gifData = await searchForGifs(searchTerm);

    if (gifData.data.length === 0) {
      searchGifs.innerHTML = "<p>No GIFs found. Try a different search.</p>";
      return;
    }

    displayGifs(gifData.data, searchGifs);
    gifSearchInput.value = "";
  } catch (error) {
    searchGifs.innerHTML = "<p>Sorry, search results could not be loaded.</p>";
    console.error("Search GIPHY error:", error);
  }
}

gifSearchButton.addEventListener("click", loadSearchGifs);

loadTrendingGifs();


// Dark mode toggle code////////////////////////////////////////////////////////////////////////////////////////////////////
const darkModeToggle = document.getElementById("dark-mode-toggle");

function enableDarkMode() {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerText = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    darkModeToggle.innerText = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
}

if (localStorage.getItem("theme") === "dark") {
    enableDarkMode();
}

darkModeToggle.addEventListener("click", function () {
    if (document.body.classList.contains("dark-mode")) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});
