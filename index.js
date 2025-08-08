// Get references to HTML elements
const form = document.querySelector("form");
const searchInput = document.getElementById("search");

const locationEl = document.getElementById("location");
const degreeEl = document.getElementById("degree");
const briefEl = document.getElementById("brief");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");

// ✅ Use your real OpenWeatherMap API key
const API_KEY = "2bc5e803b5f8292af25e160987cac338"; // Replace this

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop the form from refreshing

  const city = searchInput.value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // Build the official OpenWeatherMap URL
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then((data) => {
      const name = data.name;
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;

      locationEl.textContent = name;
      degreeEl.innerHTML = `${Math.round(temp)}<sup>o</sup>`;
      briefEl.textContent = desc;
      windEl.textContent = `Wind: ${windSpeed} km/hr`;
      humidityEl.textContent = `Humidity: ${humidity}%`;
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});
