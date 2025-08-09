const form = document.querySelector("form");
const searchInput = document.getElementById("search");
const locationEl = document.getElementById("location");
const degreeEl = document.getElementById("degree");
const briefEl = document.getElementById("weather");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");
const weatherIconEl = document.getElementById("weather-icon");
const forecastEl = document.querySelector(".forecast");
const unitToggle = document.querySelectorAll('input[name="unit"]');
let unit = "metric";

unitToggle.forEach((toggle) => {
  toggle.addEventListener("change", (e) => {
    unit = e.target.value;
    form.dispatchEvent(new Event("submit")); // weather with new unit
  });
});

const API_KEY = "2bc5e803b5f8292af25e160987cac338"; //Weather API

// weather icons
const weatherImages = {
  Clear: "clear.png",
  Clouds: "cloudy.png",
  Rain: "rainy.png",
  Snow: "snowy.png",
  Sunny: "sunny.png",
  Thunderstorm: "thunderstorm.png",
};

const errorEl = document.createElement("p");
errorEl.id = "error-message";
errorEl.style.color = "red";
form.insertAdjacentElement("afterend", errorEl);

form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop the form from refreshing

  const city = searchInput.value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // current weather URL
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=${unit}`;

  // forecast URL
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=${unit}`;

  // current weather
  fetch(currentWeatherURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then((data) => {
      errorEl.textContent = ""; // clear error message
      const name = data.name;
      const temp = data.main.temp;
      const desc = data.weather[0].main;
      const windSpeed = (data.wind.speed * 3.6).toFixed(2); // convert m/s to km/hr
      const humidity = data.main.humidity;

      locationEl.textContent = name;
      degreeEl.innerHTML = `${Math.round(temp)}<sup>o</sup>${unit === "metric" ? "C" : "F"}`;
      briefEl.textContent = desc;
      windEl.textContent = `Wind: ${windSpeed} km/hr`;
      humidityEl.textContent = `Humidity: ${humidity}%`;

      // set weather icon based on weather
      const iconFile = weatherImages[desc] || "default.png";
      weatherIconEl.src = `./images/${iconFile}`;
      weatherIconEl.alt = desc;
    })
    .catch((error) => {
      errorEl.textContent = error.message;
      errorEl.style.display = "block"; // show error message
    });

  // show forecast
  fetch(forecastURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then((data) => {
      const dailyForecasts = {};

      // show one forecast per day
      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyForecasts[date] && item.dt_txt.includes("12:00:00")) {
          dailyForecasts[date] = item;
        }
      });

      // clear existing forecast
      forecastEl.innerHTML = "";

      if (Object.keys(dailyForecasts).length === 0) {
        forecastEl.innerHTML = "<p>No forecast data available.</p>";
        return;
      }

      // display forecast
      Object.keys(dailyForecasts).forEach((date) => {
        const forecast = dailyForecasts[date];
        const temp = Math.round(forecast.main.temp);
        const desc = forecast.weather[0].main;
        const iconFile = weatherImages[desc] || "default.png";

        // format date
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        const forecastHTML = `
          <div class="forecast-item">
            <p class="forecast-date">${formattedDate}</p>
            <img class="forecast-icon" src="./images/${iconFile}" alt="${desc}" />
            <p class="forecast-temp">${temp}<sup>o</sup>${unit === "metric" ? "C" : "F"}</p>
          </div>
        `;
        forecastEl.innerHTML += forecastHTML;
      });
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });

  const City = searchInput.value.trim();
  localStorage.setItem("defaultCity", City);
});

// weather for default city when page loads
document.addEventListener("DOMContentLoaded", () => {
  const savedCity = localStorage.getItem("defaultCity") || "Durban";
  searchInput.value = savedCity;
  form.dispatchEvent(new Event("submit"));
});
//886356