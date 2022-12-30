//APIs for weather data
let apiKey = "t656554481485f7341b044a7o3281c2b";
let apiUrl = "https://api.shecodes.io/weather/v1/current?units=metric";
let forecastApiUrl = "https://api.shecodes.io/weather/v1/forecast?";

//Finding location via geo location or via city search engine
function findCurrentLocation() {
  navigator.geolocation.getCurrentPosition(findPosition);
}
function findPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  axios.get(`${apiUrl}&key=${apiKey}&lat=${lat}&lon=${lon}`).then(updatePage);
  axios
    .get(`${forecastApiUrl}units=metric&key=${apiKey}&lat=${lat}&lon=${lon}`)
    .then(displayForcast);
}
function setCity(event) {
  event.preventDefault();
  let FindCity = document.querySelector("#localization-input");
  axios.get(`${apiUrl}&key=${apiKey}&query=${FindCity.value}`).then(updatePage);
  axios
    .get(`${forecastApiUrl}units=metric&key=${apiKey}&query=${FindCity.value}`)
    .then(displayForcast);
}
//Running the weather app according to city, loading contents
function updatePage(response) {
  if (response.data.city === undefined) {
    alert("Please provide an existing city 🧐");
  } else {
    let tempToday = document.querySelector("#current-temperature");
    tempToday.innerHTML = Math.round(response.data.temperature.current) + "°";
    let cityName = document.querySelector("h1");
    cityName.innerHTML = response.data.city;
    city = response.data.city;
    let countryName = document.querySelector("h2");
    countryName.innerHTML = response.data.country;
    let weatherDescription = document.querySelector(
      "#current-weather-description"
    );
    weatherDescription.innerHTML = response.data.condition.description;
    let currentWeatherIcon = document.querySelector("#current-weather-icon");
    currentWeatherIcon.setAttribute(
      "src",
      `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
    );
    currentWeatherIcon.setAttribute(
      "alt",
      `Weather icon showing ${response.data.condition.description}`
    );
    celsiusTemperature = response.data.temperature.current;
    celsiusTemperatureFeelsLike = response.data.temperature.feels_like;
    let pressure = document.querySelector("#pressure");
    pressure.innerHTML = response.data.temperature.pressure;
    let feelsLike = document.querySelector("#feels_like");
    feelsLike.innerHTML = `${response.data.temperature.feels_like}°`;
    let humidity = document.querySelector("#humidity");
    humidity.innerHTML = `${response.data.temperature.humidity}%`;
    let wind = document.querySelector("#wind");
    wind.innerHTML = response.data.wind.speed;
    temperatureFormatCelsius.classList.add("tempFormat");
    temperatureFormatFahrenheit.classList.remove("tempFormat");
    if (response.data.condition.icon.slice(-5) == "night") {
      setNight();
    } else {
      removeNight();
    }
  }
}

//For results where the sun is set, the app will load in a dark theme.
function setNight() {
  const AllTextsDarker = document.querySelectorAll(".text-daytime-darker");
  for (const text of AllTextsDarker) {
    text.classList.add("text-nighttime-darker");
    text.classList.remove("text-daytime-darker");
  }
  const AllTextsLighter = document.querySelectorAll(".text-daytime-lighter");
  for (const text of AllTextsLighter) {
    text.classList.add("text-nighttime-lighter");
    text.classList.remove("text-daytime-lighter");
  }
  contentBox = document.querySelector("#content-box");
  contentBox.classList.add("content-box-nighttime");
  contentBox.classList.remove("content-box-daytime");
  currentWeather = document.querySelector("#current-weather-box");
  currentWeather.classList.add("current-weather-box-nighttime");
  currentWeather.classList.remove("current-weather-box-daytime");
  let nightInfo = document.querySelector("#day-time");
  nightInfo.innerHTML = "It's night time 🌙";
  dayOrNight = "night";
}

function removeNight() {
  const AllTextsDarker = document.querySelectorAll(".text-nighttime-darker");
  for (const text of AllTextsDarker) {
    text.classList.add("text-daytime-darker");
    text.classList.remove("text-nighttime-darker");
  }
  const AllTextsLighter = document.querySelectorAll(".text-nighttime-lighter");
  for (const text of AllTextsLighter) {
    text.classList.add("text-daytime-lighter");
    text.classList.remove("text-nighttime-lighter");
  }
  contentBox = document.querySelector("#content-box");
  contentBox.classList.add("content-box-daytime");
  contentBox.classList.remove("content-box-nighttime");
  currentWeather = document.querySelector("#current-weather-box");
  currentWeather.classList.add("current-weather-box-daytime");
  currentWeather.classList.remove("current-weather-box-nighttime");
  let nightInfo = document.querySelector("#day-time");
  nightInfo.innerHTML = "It's day light ☀";
  dayOrNight = "day";
}

//Formatting the date and time to show when the app was last updated. Shown time is based on local browser data (not searched for city)
function formatDate(now) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let date = now.getDate();
  let year = now.getFullYear();
  let month = months[now.getMonth()];
  let hour = now.getHours();
  if (hour > 12) {
    let currentHour = hour;
    hour = currentHour - 12;
  }
  let minute = now.getMinutes();
  if (minute < 10) {
    minute = String(minute).padStart(2, "0");
  }
  let meridiem = "am";
  if (now.getHours() > 12) {
    meridiem = "pm";
  }
  return `<small><i>Last updated: <br> ${month} ${date} ${year} - ${hour}:${minute} ${meridiem}</i></small>`;
}
function formatDay(now) {
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let day = days[now.getDay()];
  return `${day}`;
}
function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let day = date.getDay();
  return days[day];
}
//Shows forecast data. When unit is changed, a new API call is sent to update this function.
function displayForcast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#future-weather-box");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-12 col-md-2">
            <div class="col-3 col-md-12 future-day">
                  ${formatForecastDay(forecastDay.time)}
            </div>
            <div class="col-3 col-md-12">
                  <img
                    src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                      forecastDay.condition.icon
                    }.png"
                    alt="Weather icon showing ${
                      forecastDay.condition.description
                    }"
                    class="future-weather-image"
                  />
            </div>
            <div class="col-6 col-md-12 future-day-temperature">
                  ${Math.round(forecastDay.temperature.maximum)}° / 
                  ${Math.round(forecastDay.temperature.minimum)}°
                  </div>
                  </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//All temperature values can be shown in fahrenheit or celsius. For the forecast data, the function displayForecast() is run again.
function formatTemperatureCelsius() {
  temperatureFormatCelsius.classList.add("tempFormat");
  temperatureFormatFahrenheit.classList.remove("tempFormat");
  let temperatureFahrenheit = Math.round((celsiusTemperature * 9) / 5 + 32);
  fahrenheitTemperature = temperatureFahrenheit;
  let currentTemperatureFormat = document.querySelector("#current-temperature");
  let temperatureCalculator = Math.round(
    ((fahrenheitTemperature - 32) * 5) / 9
  );
  currentTemperatureFormat.innerHTML = temperatureCalculator + "°";
  let temperatureFahrenheitFeelsLike = Math.round(
    (celsiusTemperatureFeelsLike * 9) / 5 + 32
  );
  fahrenheitTemperatureFeelsLike = temperatureFahrenheitFeelsLike;
  let currentTemperatureFormatFeelsLike = document.querySelector("#feels_like");
  let temperatureCalculatorFeelsLike = Math.round(
    ((fahrenheitTemperatureFeelsLike - 32) * 5) / 9
  );
  currentTemperatureFormatFeelsLike.innerHTML =
    temperatureCalculatorFeelsLike + "°";
  celsiusOrFahrenheit = "celsius";
  axios
    .get(`${forecastApiUrl}units=metric&key=${apiKey}&query=${city}`)
    .then(displayForcast);
}
function formatTemperatureFahrenheit() {
  temperatureFormatFahrenheit.classList.add("tempFormat");
  temperatureFormatCelsius.classList.remove("tempFormat");
  let currentTemperatureFormat = document.querySelector("#current-temperature");
  let temperatureFahrenheit = Math.round((celsiusTemperature * 9) / 5 + 32);
  currentTemperatureFormat.innerHTML = temperatureFahrenheit + "°";
  fahrenheitTemperature = temperatureFahrenheit;
  let currentTemperatureFormatFellsLike = document.querySelector("#feels_like");
  let temperatureFahrenheitFeelsLike = Math.round(
    (celsiusTemperatureFeelsLike * 9) / 5 + 32
  );
  currentTemperatureFormatFellsLike.innerHTML =
    temperatureFahrenheitFeelsLike + "°";
  fahrenheitTemperatureFeelsLike = temperatureFahrenheitFeelsLike;
  celsiusOrFahrenheit = "fahrenheit";
  axios
    .get(`${forecastApiUrl}units=imperial&key=${apiKey}&query=${city}`)
    .then(displayForcast);
}

//adding of event listeners and formating date
let locationFinder = document.querySelector("#localization-icon");
locationFinder.addEventListener("click", findCurrentLocation);
let citySubmitButton = document.querySelector("#cityForm");
citySubmitButton.addEventListener("submit", setCity);
let currentTimeShower = document.querySelector("#current-date-time");
currentTimeShower.innerHTML = formatDate(new Date());
let currentDayShower = document.querySelector("#current-day");
currentDayShower.innerHTML = formatDay(new Date());
let temperatureFormatCelsius = document.querySelector("#celsius");
temperatureFormatCelsius.addEventListener("click", formatTemperatureCelsius);
let temperatureFormatFahrenheit = document.querySelector("#fahrenheit");
temperatureFormatFahrenheit.addEventListener(
  "click",
  formatTemperatureFahrenheit
);
//initial variables which can be overwritten in functions
let celsiusTemperature = null;
let celsiusTemperatureFeelsLike = null;
let fahrenheitTemperature = null;
let fahrenheitTemperatureFeelsLike = null;
let dayOrNight = null;
let celsiusOrFahrenheit = "celsius";
let city = "Zurich";

//on load function to open app initially with real data.
window.onload = function () {
  axios.get(`${apiUrl}&key=${apiKey}&query=${city}`).then(updatePage);
  axios
    .get(`${forecastApiUrl}&key=${apiKey}&query=${city}`)
    .then(displayForcast);
};
