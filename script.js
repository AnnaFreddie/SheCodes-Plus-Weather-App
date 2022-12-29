let apiKey = "t656554481485f7341b044a7o3281c2b";
let apiUrl = "https://api.shecodes.io/weather/v1/current?units=metric";

function findCurrentLocation() {
  navigator.geolocation.getCurrentPosition(findPosition);
}

function findPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  axios.get(`${apiUrl}&key=${apiKey}&lat=${lat}&lon=${lon}`).then(updatePage);
}

function setCity(event) {
  event.preventDefault();
  let city = document.querySelector("#localization-input");
  axios.get(`${apiUrl}&key=${apiKey}&query=${city.value}`).then(updatePage);
}

function updatePage(response) {
  if (response.data.city === undefined) {
    alert("Please provide an existing city 🧐");
  } else {
    let tempToday = document.querySelector("#current-temperature");
    tempToday.innerHTML = Math.round(response.data.temperature.current) + "°";
    let cityName = document.querySelector("h1");
    cityName.innerHTML = response.data.city;
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

    let pressure = document.querySelector("#pressure");
    pressure.innerHTML = response.data.temperature.pressure;
    let feelsLike = document.querySelector("#feels_like");
    feelsLike.innerHTML = `${response.data.temperature.feels_like}°`;
    let humidity = document.querySelector("#humidity");
    humidity.innerHTML = `${response.data.temperature.humidity}%`;
    let wind = document.querySelector("#wind");
    wind.innerHTML = response.data.wind.speed;

    if (response.data.condition.icon.slice(-5) == "night") {
      setNight();
    } else {
      removeNight();
    }
  }
}

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
}

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
    ,
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
  return `${month} ${date} ${year} - ${hour}:${minute} ${meridiem}`;
}

function formatDay(now) {
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let day = days[now.getDay()];
  return `${day}`;
}

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
}
function formatTemperatureFahrenheit() {
  temperatureFormatFahrenheit.classList.add("tempFormat");
  temperatureFormatCelsius.classList.remove("tempFormat");
  let currentTemperatureFormat = document.querySelector("#current-temperature");
  let temperatureFahrenheit = Math.round((celsiusTemperature * 9) / 5 + 32);
  currentTemperatureFormat.innerHTML = temperatureFahrenheit + "°";
  fahrenheitTemperature = temperatureFahrenheit;
}
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
let celsiusTemperature = null;
let fahrenheitTemperature = null;

window.onload = function () {
  axios.get(`${apiUrl}&key=${apiKey}&query=zurich`).then(updatePage);
};
