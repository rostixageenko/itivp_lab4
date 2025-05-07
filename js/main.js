const apikey = '10bf73cb8033581320aca5ca2db712db';
const form = document.querySelector('#form');
const input_city = document.querySelector('#input');
const input_country = document.querySelector('#countryInput');
const toggleCountryButton = document.querySelector('#toggleCountryInput');
const main = document.querySelector('main');

input_city.addEventListener('input', function(e) {
    validateInput(input_city); 
});
input_country.addEventListener('input', function(e) {
    validateInput(input_country); 
});

fetch('json/countries.json')
    .then(response => response.json())
    .then(data => {
        countryCodes = data;
    })
    .catch(error => {
        console.error('Ошибка при загрузке данных о странах:', error);
    });

form.onsubmit = function (e) {
    document.querySelector('main').innerHTML = '';
    e.preventDefault();
    let city = input_city.value.trim();
    let apiurl1;
    let isCountryVisible = input_country.style.display === 'block';
    
    if (isCountryVisible) {
        let countryName = input_country.value.trim();
        let countryCode = countryCodes[countryName];
        apiurl1 = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=6&appid=${apikey}`;
    } else {
        apiurl1 = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=6&appid=${apikey}`;
    }

    fetch(apiurl1)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных о городе.');
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                alert('Город не найден. Пожалуйста, проверьте правильность ввода.');    
            }
            console.log(data);
            for (const key in data) {
                const lat = data[key].lat;
                const lon = data[key].lon;
                const apiurl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&lang=ru&units=metric&mode=xml`;

                fetch(apiurl2)
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
                        console.log(xmlDoc);
                        const htmlCard = `
                            <div class="card">
                                <h2 class="card-city">${cityName} <span>${countryValue}</span></h2>
                                <div class="card-weather">
                                    <div class="weather-value"><span>${tempValue}</span>°C</div>
                                    <img class="weather-img" src="./img/${weatherIcon}.png" alt="Weather icon">
                                </div>            
                                <div class="weather-desc">${weatherDesc}</div>
                            </div>`;

                        if (key != 0) {
                            main.classList.add('several-city');
                        } else {
                            main.classList.remove('several-city'); 
                        }
                        document.querySelector('main').insertAdjacentHTML('beforeend', htmlCard);
                    })
                    .catch((error) => {
                        console.error('Произошла ошибка:', error);
                        alert(`Ошибка: ${error.message}`);
                    });
            }
        })
        .catch((error) => {
            console.error('Произошла ошибка:', error);
            alert(`Ошибка: ${error.message}`);
        });
};