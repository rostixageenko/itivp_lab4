const apikey = '10bf73cb8033581320aca5ca2db712db';
const form = document.querySelector('#form');
const input = document.querySelector('#input');
const maxLength = 50;

form.onsubmit = function (e) {
    e.preventDefault();
    let city = input.value.trim();

    const apiurl1 = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apikey}`;

    fetch(apiurl1)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных о городе.');
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                throw new Error('Город не найден.');
            }
            const lat = data[0].lat;
            const lon = data[0].lon;
            const apiurl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&lang=ru&units=metric&mode=xml`;

            return fetch(apiurl2);
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных о погоде.');
            }
            return response.text();
        })
        .then((data) => {
            const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
            const cityName = xmlDoc.querySelector("city").getAttribute("name");
            const countryValue = xmlDoc.querySelector("country").textContent;
            const weatherDesc = xmlDoc.querySelector("weather").getAttribute("value");
            const weatherIcon = xmlDoc.querySelector("weather").getAttribute("icon");
            const tempValue = xmlDoc.querySelector("temperature").getAttribute("value");

            document.querySelector('main').innerHTML = '';

            const htmlCard = `
                <div class="card">
                    <h2 class="card-city">${cityName} <span>${countryValue}</span></h2>
                    <div class="card-weather">
                        <div class="weather-value"><span>${tempValue}</span>°C</div>
                        <img class="weather-img" src="./img/${weatherIcon}.png" alt="Weather icon">
                    </div>            
                    <div class="weather-desc">${weatherDesc}</div>
                </div>`;
                
            document.querySelector('main').innerHTML = htmlCard;
        })
        .catch((error) => {
            console.error('Произошла ошибка:', error);
            document.querySelector('main').innerHTML = `<div class="error">${error.message}</div>`;
        });
};