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

//รับ Enter เพื่อทำงาน findWeatherDetail
function enterPressed(event) {
    if (event.key === "Enter") {
        findWeatherDetails();
    }
}
//รับ input เพื่อไปหาข้อมูล
function findWeatherDetails() {
    if (searchInput.value === "") {

    }
    else {
        const searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput.value + "&appid=" + appkey;
        httpRequestAsync(searchLink, theResponse);
    }
}

//แปลง json ส่งข้อมูลกลับไปที่ HTML
function theResponse(response) {
    const jsonObject = JSON.parse(response);
    const Now = convertToUTC(jsonObject.timezone * 1000);

    cityName.innerHTML = jsonObject.name;
    countyName.innerHTML = jsonObject.sys.country;
    icon.src = "http://openweathermap.org/img/w/" + jsonObject.weather[0].icon + ".png";
    temp.innerHTML = jsonObject.weather[0].main;
    max.innerHTML = parseInt(jsonObject.main.temp_max - 273.15) + "°C";
    min.innerHTML = parseInt(jsonObject.main.temp_min - 273.15) + "°C";
    celsius.innerHTML = parseInt(jsonObject.main.temp - 273.15) + "°";
    fahrenheit.innerHTML = parseInt((jsonObject.main.temp - 273.15) * 9 / 5 + 32) + "°";
    timezone.innerHTML = Now;


}

//HttpRequest
function httpRequestAsync(url, callback) {
    //สร้างอินสแตนซ์ของซึ่งใช้ในการส่งคำขอ HTTP
    const httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = () => {

        //httpRequest.readyState == 4 หมายถึง การรับข้อมูลเสร็จสมบูรณ์ 
        //httpRequest.status == 200 หมายถึง คำขอสำเร็จ (HTTP Status 200 OK)
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            callback(httpRequest.responseText);
        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}

//แปลง timezone เป็นเวลาปัจุบัน
function convertToUTC(offsetMillis) {
    const now = new Date();
    const localTime = new Date(now.getTime() + offsetMillis);
    const HH = parseInt(localTime.toISOString().split('T')[1].split(':')[0]);
    const utcTime = now.toISOString().split('T')[1].split(':').slice(0, 2).join(':');

    /*console.log(`Local Time (Offset: ${offsetMillis} ms): ${localTime.toISOString().split('T')[1].split('.')[0]}`);
    console.log(`UTC Time: ${utcTime}`);*/

    if (HH >= 19 || HH < 6) {
        Night(HH);
    }
    else {
        Day(HH);
    }

    //return HH:MM
    return localTime.toISOString().split('T')[1].split(':').slice(0, 2).join(':');
}

//ส่วนของตกแต่ง css
const weather = document.querySelectorAll(".imgWeather");
const sunday = document.querySelectorAll(".sun");
const cloud1 = document.querySelectorAll(".cloud1");
const cloud2 = document.querySelectorAll(".cloud2");
const cloud3 = document.querySelectorAll(".cloud3");

var c = window.matchMedia("(max-width: 700px)");

//แปลงเวลาให้เป็นเปอร์เซ็น เช่น 6.pm - 19.pm เป็น 1% - 100%
function mapRange(value, inMin, inMax, outMin, outMax) {

    if (value >= 0 && value <= 5) {
        return (((value + 24) - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }
    //      (ค่าเวลา - เวลาต่ำสุด) * (%ต่ำสุด - %สูงสุด) / (เวลาสูงสุด - เวลาต่ำสุด) + %ต่ำสุด
    else {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }
}

function Mediaquery(element, screen, outmin, outmax){
    screen.onchange = (e) =>{
        if (e.matches){
            element.style.left = (mapRange(hours, 6, 19, 1, outmin)) + "%";
        }else{
            element.style.left = (mapRange(hours, 6, 19, 1, outmax)) + "%";
        }
}}

//แสดงหน้า css ตามเวลา
function Night(hours) {
    weather.forEach(W => {
        W.classList.add("imgWeather-night");
        W.classList.replace("imgWeather-day", "imgWeather-night");
    });
    sunday.forEach(sun => {
        sun.classList.add("sun-night");
        sun.classList.replace("sun-day", "sun-night");
        if (c.matches){
            sun.style.left = (mapRange(hours, 19, 29, 1, 80)) + "%";
        }else{
            sun.style.left = (mapRange(hours, 19, 29, 1, 90)) + "%";
        }
        Mediaquery(sun, c, 80, 90);
    });
    [cloud1, cloud2, cloud3].forEach((array, index) => {
        array.forEach(clouds => { 
            clouds.classList.add(`cloud${index + 1}-night`);
            clouds.classList.replace(`cloud${index + 1}-day`, `cloud1-night`);
        });
    });

}

//แสดงหน้า css ตามเวลา
function Day(hours) {
    weather.forEach(W => {
        W.classList.add("imgWeather-day");
        W.classList.replace("imgWeather-night", "imgWeather-day");
    });
    sunday.forEach(sun => {
        sun.classList.add("sun-day");
        sun.classList.replace("sun-night", "sun-day");
        if (c.matches){
            sun.style.left = (mapRange(hours, 6, 19, 1, 100)) + "%";
        }else{
            sun.style.left = (mapRange(hours, 6, 19, 1, 90)) + "%";
        }
        Mediaquery(sun, c, 100, 90);
    });
    [cloud1, cloud2, cloud3].forEach((array, index) => {
        array.forEach(clouds => {
            clouds.classList.add(`cloud${index + 1}-day`);
            clouds.classList.replace(`cloud${index + 1}-night`, `cloud${index + 1}-day`);
        });
    });
}

//theme btn
function theme() {
    const body = document.body;
    const html = document.html;    

    body.classList.toggle("dark-theme");
    html.forEach(html => {
        html.style.backgroundColor = "#474747";
    });
}