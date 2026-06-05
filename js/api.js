// New footer element////////////////////////////////////////////////////////////////////////////////////////////////
const footer = document.getElementById(`footer`);

// New paragraph element for the copyright
const copyright = document.createElement("p");

// Current year
const today = new Date();
const thisYear = today.getFullYear();

// inner HTML of the copyright element 
copyright.innerHTML = `Miguel Alexander Nunez Palomares © ${thisYear}`;

// copyright element appended to the footer
footer.appendChild(copyright);


// Weather API code///////////////////////////////////////////////////////////////////////////////////////
const currentWeather = document.getElementById("current-weather");
const forecastList = document.getElementById("forecast-list");

navigator.geolocation.getCurrentPosition(
    function (position) {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
        )
            .then(response => response.json())
            .then(weatherData => {

                currentWeather.innerHTML = `
                    <h3>Current Weather</h3>
                    <p>Temperature: ${weatherData.current.temperature_2m}°F</p>
                    <p>Wind Speed: ${weatherData.current.wind_speed_10m} mph</p>
                `;

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
            });
    },

    function (error) {
        currentWeather.innerHTML =
            "<p>Location access denied. Unable to retrieve weather.</p>";

        console.log(error);
    }
);



// GIPHY API code/////////////////////////////////////////////////////////////////////////////////////////////////
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
        gif.alt = gifArray[i].title;

        container.appendChild(gif);
    }
}

fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&limit=2&rating=g`)
    .then(function (response) {
        return response.json();
    })
    .then(function (gifData) {
        console.log(gifData);
        displayGifs(gifData.data, trendingGifs);
    })
    .catch(function (error) {
        trendingGifs.innerHTML = "<p>Sorry, trending GIFs could not be loaded.</p>";
        console.log("Trending GIPHY error:", error);
    });

gifSearchButton.addEventListener("click", function () {
    const searchTerm = gifSearchInput.value;

    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${searchTerm}&limit=4&rating=g`)
        .then(function (response) {
            return response.json();
        })
        .then(function (gifData) {
            console.log(gifData);
            displayGifs(gifData.data, searchGifs);
            gifSearchInput.value = "";
        })
        .catch(function (error) {
            searchGifs.innerHTML = "<p>Sorry, search results could not be loaded.</p>";
            console.log("Search GIPHY error:", error);
        });
});