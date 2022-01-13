var cityName = $("#city-display");
var timeEl = $("#time-display");
var temperature = $("#temperature");
var windSpeed = $("#wind-speed");
var humidityEl = $("#humidity");
var uviEl = $("#uv-index");
var buttonContainer = $("#history-buttons");
var pastSearches = [];

var time = moment().format("MMMM Do, YYYY h:mma");
timeEl.text(time);

function fetchWeather(lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&appid=a4a56662ec683a9ec071a1207a88f06f&units=imperial";

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {      
      var temp = data.current.temp;
      var wind = data.current.wind_speed;
      var humidity = data.current.humidity;
      var uvi = data.current.uvi;

      var iconEl = $("<img>");
      var iconUrl =
        "https://openweathermap.org/img/wn/" +
        data.current.weather[0].icon +
        "@2x.png";
      iconEl.attr("src", iconUrl);
      iconEl.attr("alt", data.current.weather[0].description);
      cityName.append(iconEl);

      temperature.text("Temperature: " + temp + "°");
      windSpeed.text("Wind speed: " + wind + "mph");
      humidityEl.text("Humidity: " + humidity + "%");
      uviEl.text("UV-Index: " + uvi);

    for (i = 0; i < 5; i++) {
      var forecastDisplay = $("<div>");
      forecastDisplay.addClass("card col-sm-2 m-2 search-results");

      var date = $("<h6>");
      date.text(moment().add(i, "days").format("ddd MMM Do"));
      forecastDisplay.append(date);

      var dailyIcon = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
      var imgDisplay = $("<img>");
      imgDisplay.attr("src", dailyIcon);
      forecastDisplay.append(imgDisplay);

      var dailyTemp = $("<p>");
      dailyTemp.text("Temperature: " + data.daily[i].temp.max);
      forecastDisplay.append(dailyTemp);

      var dailyWind = $("<p>");
      dailyWind.text("Wind Speed: " +  data.daily[i].wind_speed);
      forecastDisplay.append(dailyWind);

      var dailyHumidity = $("<p>");
      dailyHumidity.text("Humidity: " + data.daily[i].humidity);
      forecastDisplay.append(dailyHumidity);

      $("#upcoming-forecast").append(forecastDisplay);
    }
    });
}
  
function getCoords(search) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q="
     + search +"&limit=1&appid=a4a56662ec683a9ec071a1207a88f06f";

    fetch(apiUrl)
    .then(function (response) {
            return response.json();
    })
    .then(function (data) {
        cityName.text(data[0].name);
        fetchWeather(data[0].lat, data[0].lon);
    });
}

function renderBtns() {
  for (i = 0; i <pastSearches.length; i++) {
    var btn = $("<button>");
    btn.addClass("btn btn-outline-success float-right");
    btn.text(pastSearches[i]);
    buttonContainer.append(btn);
  }
}

$("#city-search").on("click", function(event) {
  event.preventDefault();
  $(".search-results").remove();
  var search = $("#city").val();
  pastSearches.push(search);
  localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

  var btn = $("<button>");
  btn.addClass("btn btn-outline-success float-right search-results");
  btn.text(search);
  buttonContainer.append(btn);
  getCoords(search);
});

$("#history-buttons").on("click", function(event) {
  if (event.target.matches(".btn")) {
    var query = event.target.textContent;
    getCoords(query);
  }
});

pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
if (pastSearches === null) {
  pastSearches = [];
}

renderBtns();