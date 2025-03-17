const appkey = "0436b7c77fabc502cb6f35f98c3ccab3";

const searchInput = document.querySelector("#search-txt");
const searchButton = document.querySelector("#search-a");
const cityName = document.querySelector("#city");
const countyName = document.querySelector("#county");
const icon = document.querySelector("#icon");
const max = document.querySelector("#max");
const min = document.querySelector("#min");
const temp = document.querySelector("#temp");
const celsius = document.querySelector("#celsius");
const fahrenheit = document.querySelector("#fahrenheit");
const timezone = document.getElementById("time-zone");

searchButton.addEventListener("click", findWeatherDetails);
searchInput.addEventListener("keyup", enterPressed);

function enterPressed(event) {
    if (event.key === "Enter") {
        findWeatherDetails();
    }
}

function findWeatherDetails() {
    if (searchInput.value === "") {

    }
    else {
        const searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput.value + "&appid=" + appkey;
        httpRequestAsync(searchLink, theResponse);
    }
}

function theResponse(response) {
    const jsonObject = JSON.parse(response);
    cityName.innerHTML = jsonObject.name;
    countyName.innerHTML = jsonObject.sys.country;
    icon.src = "http://openweathermap.org/img/w/" + jsonObject.weather[0].icon + ".png";
    temp.innerHTML = jsonObject.weather[0].main;
    max.innerHTML = parseInt(jsonObject.main.temp_max - 273.15) + "°C";
    min.innerHTML = parseInt(jsonObject.main.temp_min - 273.15) + "°C";
    celsius.innerHTML = parseInt(jsonObject.main.temp - 273.15) + "°";
    fahrenheit.innerHTML = parseInt((jsonObject.main.temp - 273.15) * 9 / 5 + 32) + "°";
    timezone.innerHTML = convertToUTC(jsonObject.timezone * 1000);
}

function httpRequestAsync(url, callback) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            callback(httpRequest.responseText);
        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}

function convertToUTC(offsetMillis) {
    const now = new Date();
    const localTime = new Date(now.getTime() + offsetMillis);
    
    const utcTime = now.toISOString().split('T')[1].split(':').slice(0, 2).join(':');
    
    console.log(`Local Time (Offset: ${offsetMillis} ms): ${localTime.toISOString().split('T')[1].split('.')[0]}`);
    console.log(`UTC Time: ${utcTime}`);
    
    return localTime.toISOString().split('T')[1].split(':').slice(0, 2).join(':');
}