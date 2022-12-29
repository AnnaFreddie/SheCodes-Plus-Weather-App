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
    alert("Please provide an existing city🧐");
  } else {
    let tempToday = document.querySelector("#current-temperature");
    tempToday.innerHTML = Math.round(response.data.temperature.current) + "°";
    let cityName = document.querySelector("h1");
    cityName.innerHTML = response.data.city;
    let countryName = document.querySelector("h2");
    countryName.innerHTML = response.data.country;
  }
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
  let currentTemperatureFormat = document.querySelector("#current-temperature");
  let temperatureCalculator = ((51.8 - 32) * 5) / 9;
  let temperatureCalculatorRounded = Math.round(temperatureCalculator);
  currentTemperatureFormat.innerHTML = temperatureCalculatorRounded + "°";
}
function formatTemperatureFahrenheit() {
  temperatureFormatFahrenheit.classList.add("tempFormat");
  temperatureFormatCelsius.classList.remove("tempFormat");
  let currentTemperatureFormat = document.querySelector("#current-temperature");
  let temperatureCalculator = (11 * 9) / 5 + 32;
  let temperatureCalculatorRounded = Math.round(temperatureCalculator);
  currentTemperatureFormat.innerHTML = temperatureCalculatorRounded + "°";
}
let locationFinder = document.querySelector(".localization-icon");
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
