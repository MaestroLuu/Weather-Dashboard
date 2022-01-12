var cityName = $("#city-display");
var dataDisplay = $("#data-display");

var time = moment().format("MMMM Do, YYYY h:mma");


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
        console.log(data);
    
        // create img url with icon id
        var iconEl = document.createElement("img");
        var iconUrl =
          "https://openweathermap.org/img/wn/" +
          data.current.weather[0].icon +
          "@2x.png";
        iconEl.setAttribute("src", iconUrl);
        iconEl.setAttribute("alt", data.current.weather[0].description);
        cityName.append(iconEl);
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