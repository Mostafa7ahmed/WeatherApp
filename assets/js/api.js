'use strict';
let tokeen = prompt("Enter you token", "ef871557197701e9889bc076cb30e519");
const api_key = tokeen;
export const fetchdata = function (URL, callback) {
    fetch(`${URL}&appid=${api_key}`)
        .then((res) => res.json())
        .then(Date => callback(Date))
}

export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`;
    },
    foreCast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
    },
    airPolluation(lat, lon) {
        return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
    },
    reverseGeocoding(lat, lon) {
        return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}limit=5`;
    },
    Geocoding(query) {
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`

    }


}

