var cityName = $("#city-display");
var timeEl = $("#time-display");
var temperature = $("#temperature");
var windSpeed = $("#wind-speed");
var humidityEl = $("#humidity");
var uviEl = $("#uv-index");
var dailyForecast = $("#upcoming-forecast");
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

        // create img url with icon id
        var iconEl = document.createElement("img");
        var iconUrl =
          "https://openweathermap.org/img/wn/" +
          data.current.weather[0].icon +
          "@2x.png";
        iconEl.setAttribute("src", iconUrl);
        iconEl.setAttribute("alt", data.current.weather[0].description);
        cityName.append(iconEl);

        temperature.text("Temperature: " + temp + "°");
        windSpeed.text("Wind speed: " + wind + "mph");
        humidityEl.text("Humidity: " + humidity + "%");
        uviEl.text("UV-Index: " + uvi);

      for (i = 0; i < 5; i++) {
        if (i < 5) {
          var dailyUpdate = data.daily[i].temp.max;
          var forecastDisplay = $("<div>");
          forecastDisplay.addClass("card col-sm-2 m-2");
          forecastDisplay.text(dailyUpdate);
          dailyForecast.append(forecastDisplay);
          console.log(dailyUpdate)
        }
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
        console.log(data);
        cityName.text(data[0].name);
        fetchWeather(data[0].lat, data[0].lon);
    });
}

$("#city-search").on("click", function(event) {
    event.preventDefault();
    var search = $("#city").val();
    getCoords(search);
});