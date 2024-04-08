'use strict';

import { fetchdata, url } from "./api.js";

import { getCurrentDate, getDate, weekDayNames, aqiText, getTime, mpstokmh } from "./module.js";


let addEventOnElement = function (ee, eventType, callBack) {
    for (let element of ee) {
        element.addEventListener(eventType, callBack);
    }
}

//  Open Search Toggle
const searchView = document.querySelector("[data-search-view]");
const searchToggler = document.querySelectorAll("[data-search-toggler]");
let toggle = () => searchView.classList.toggle("active");
addEventOnElement(searchToggler, "click", toggle);

//======= **  ==========\\

const searchField = document.querySelector("[data-search-field]"); // Corrected selector
const SearchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
    searchTimeout ?? clearTimeout(searchTimeout); // Use clearTimeout directly

    if (!searchField.value) {
        SearchResult.classList.remove("active");
        SearchResult.innerHTML = "";
        searchField.classList.remove("searching");

    } else {
        searchField.classList.add("searching");


    }

    if (searchField.value) {

        searchTimeout = setTimeout(() => {
            fetchdata(url.Geocoding(searchField.value), function (location) {
                searchField.classList.remove("searching");
                SearchResult.classList.add("active");
                SearchResult.innerHTML = `
                    <ul class="view-list" data-search-list>
                        
                    </ul>
                `;


                const items = [];

                for (const { name, lat, lon, country, state } of location) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");
                    searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>
                        <div>
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
                    `;
                    SearchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));

                };


                addEventOnElement(items, "click", function (e) {
                    toggle();
                    SearchResult.classList.remove("active");



                });


            });

        }, searchTimeoutDuration);
    }
});
//======= **  ==========\\
const Contanier = document.querySelector("[data-contanier]");
const loading = document.querySelector("[data-loading]");
const currentLocatuon = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");


export const updataWeather = function (lat, lon) {
    loading.style.display = " grid";
    Contanier.style.overflowY = " hidden";
    Contanier.classList.contains("fade-in") ?? Contanier.classList.remove("fade-in");
    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    // =================\\
    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";


    if (window.location.hash == "#/current-location") {
        currentLocatuon.setAttribute("disabled", "");
    }
    else {
        currentLocatuon.removeAttribute("disabled");

    }

    fetchdata(url.currentWeather(lat, lon), function (currentWeather) {

        const {
            weather,
            name,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC, country: countrycity },
            main: { temp, feels_like, pressure, humidity },
            visibility,
            timezone
        } = currentWeather
        const [{ description, icon }] = weather;

        const card = document.createElement("div");
        card.classList.add("card", "card-lg", "current-weather-card");
        card.innerHTML = `      
        <h2 class="title-2 card-title"> now </h2>
        <div class="weapper">
            <p class="heading">
                ${parseInt(temp)}&deg;<sup>c</sup>
            </p>
            <img src="./assets/images/weather_icons/${icon}.png" alt="${description}" width="64" height="64"  class="weather-icon">
        </div>
        <p class="body-3">${description}</p>
        <ul class="meta-list">
            <li class="meta-item">
                <span class="m-icon">calendar_today</span>
                <p class="title-3 meta-text">${getCurrentDate()}</p>
            </li>
            <li class="meta-item">
                <span class="m-icon">location_on</span>
                <p class="title-3 meta-text" data-location >${name}
                </p>
            </li>
        </ul>
        `;
        currentWeatherSection.appendChild(card);

        fetchdata(url.airPolluation(lat, lon), function (airPolluation) {
            const [{
                main: { aqi },
                components: { no2, o3, so2, pm2_5 }

            }] = airPolluation.list;


            const cards = document.createElement("div");
            cards.classList.add("card", "card-lg");
            cards.innerHTML = `     <h2 class="title-2" id="highlights-labe">Todays Highlights </h2>
            <div class="highlight-list">
                <div class="card card-sm highlights-card one">
                    <h3 class="title-3">Air Quality Index </h3>
                    <div class="wrapper">
                        <span class="m-icon">air</span>
                        <ul class="card-list">
                            <li class="card-item">
                                <p class="title-1">${pm2_5.toPrecision(3)}</p>
                                <p class="label-1">PM <sub>2.5</sub></p>
                            </li>
                            <li class="card-item">
                                <p class="title-1">${so2.toPrecision(3)}</</p>
                                <p class="label-1">SO<sub>2</sub></p>
                            </li>
                            <li class="card-item">
                                <p class="title-1">${no2.toPrecision(3)}</p>
                                <p class="label-1">NO <sub>2</sub></p>
                            </li>
                            <li class="card-item">
                            <p class="title-1">${o3.toPrecision(3)}</p>
                            <p class="label-1">O <sub>2.5</sub></p>
                            </li>
                        </ul>


                    </div>




                    <span class="badge aqi-${aqi} label-${aqi} " title="${aqiText[aqi].message} ">
                    ${aqiText[aqi].level} 
                    </span>
                </div>

                <div class="card card-sm highlights-card two">
                    <h3 class="title-3">Sunrise & Sunset </h3>

                    <div class="card-list">
                        <div class="card-item">
                            <span class="m-icon">clear_day</span>


                            <div class="">
                                <p class="label-1"> Sunrise</p>
                                <p class="title-1"> ${getTime(sunriseUnixUTC)}</p>

                            </div>

                        </div>
                        <div class="card-item">
                            <span class="m-icon">clear_night</span>


                            <div class="">
                                <p class="label-1"> Sunset</p>
                                <p class="title-1"> ${getTime(sunsetUnixUTC, timezone)}</p>

                            </div>

                        </div>
                    </div>
                </div>
                <div class="card card-sm highlights-card ">
                    <h3 class="title-3">Humidity</h3>
                    <div class="wrapper">
                        <span class="m-icon">humidity_percentage</span>
                        <p class="title-1">${humidity} <sub>%</sub></p>

                    </div>
                </div>
                <div class="card card-sm highlights-card ">
                    <h3 class="title-3">Pressure</h3>
                    <div class="wrapper">
                        <span class="m-icon">airwave</span>
                        <p class="title-1">${pressure} <sub>hpa</sub></p>

                    </div>
                </div>
                <div class="card card-sm highlights-card ">
                    <h3 class="title-3">visibility</h3>
                    <div class="wrapper">
                        <span class="m-icon">visibility</span>
                        <p class="title-1">${visibility / 1000} <sub>KM</sub></p>

                    </div>
                </div>
                <div class="card card-sm highlights-card ">
                    <h3 class="title-3">Feels Like</h3>
                    <div class="wrapper">
                        <span class="m-icon">thermostat</span>
                        <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>

                    </div>
                </div>
            </div>
            `;


            highlightSection.appendChild(cards);
        });


        fetchdata(url.foreCast(lat, lon), function (foreCast) {



            const {
                list: forecastList,
                city: { timezone }

            } = foreCast;

            hourlySection.innerHTML = `  
             <h2 class="title-2">Today at </h2>
            <div class="slider-container">
                <ul class="slider-list" data-temp>
                    
                </ul>


                <ul class="slider-list" data-wind>
           
                   
                </ul>

            </div>`;
            for (const [index, data] of forecastList.entries()) {
                if (index > 7) break;

                const {
                    dt: dateTimeUnix,
                    main: { temp },
                    weather,
                    wind: { deg: windDirection, speed: windSpeed }
                } = data

                const [{ icon, description }] = weather
                const temPli = document.createElement("li");
                temPli.classList.add("slider-item");
                temPli.innerHTML = `    
                      <div class="card card-sm slider-card">
                <p class="body-3">${getTime(dateTimeUnix)}</p>
                <img src="./assets/images/weather_icons/${icon}.png" class="weather-icon" loading="lazy"
                    width="48" height="48" alt="${description}" title="${description}">
                <p class="body-3">${parseInt(temp)}&deg;</p>
            </div>
            `;
                hourlySection.querySelector("[data-temp]").appendChild(temPli);

                const windli = document.createElement("li");
                windli.classList.add("slider-item");
                windli.innerHTML = `        
               <div class="card card-sm slider-card">
               <p class="body-3">${getTime(dateTimeUnix)}</p>
                   <img src="./assets/images/weather_icons/direction.png" class="weather-icon"
                       width="48" height="48" loading="lazy" alt="direction" style="    transform: rotate(${windDirection}deg);">
                   <p class="body-3">${parseInt(mpstokmh(windSpeed))}</p>

               </div>
                     `;
                hourlySection.querySelector("[data-wind]").appendChild(windli);

            }


            forecastSection.innerHTML =
                `    <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
            <div class="card card-lg forecast-card">
                <ul data-forcast>
       
                    
                </ul>
            </div>`;


            for (let i = 7, len = forecastList.length; i < len; i += 8) {

                const {
                    main: { temp_max },
                    weather,
                    dt_txt
                } = forecastList[i];
                const [{ icon, description }] = weather

                const date = new Date(dt_txt);
                const ULi = document.createElement("li");
                ULi.classList.add("card-item");
                ULi.innerHTML = `
                <div class="icon-wrapper">
                        <img src="./assets/images/weather_icons/${icon}.png" alt="${description}" width="36"
                            height="36" class="weather-icons">
                        <span class="span">
                            <p class="title-2">${parseInt(temp_max)}&deg;</p>
                        </span>
                </div>

                    <p class="label-1">${weekDayNames[date.getUTCDay()]}</p>
                    `;
                forecastSection.querySelector("[data-forcast]").appendChild(ULi);




            }

            loading.style.display = " none";
            Contanier.style.overflowY = " overlay";
            Contanier.classList.add("fade-in")
        });




    });


}


export const error404 = function () {
    errorContent.style.display = "flex";
}
