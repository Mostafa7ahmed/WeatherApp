'use strict';
import { updataWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=51.5073219&lon=-0.1276474";
const currentLoction = function () {
    Window.navigator.geolocation.getCurrentPosition(res => {
        const { latitude, longitude } = res.coords;

        updataWeather(`lat=${latitude}`, `lon=${longitude}`);
    }, err => {
        window.location.hash = defaultLocation;
    });
}

const searchedLocation = query => updataWeather(...query.split("&"));
//updataWeather(lat=51.5073219,lon=-0.1276474 )
const routes = new Map([
    ["/cirrent-location", currentLoction],
    ["/weather", searchedLocation]

]);

const checkHash = function () {
    const reqURL = window.location.hash.slice(1)
    const [route, query] = reqURL.includes ? reqURL.split("?") : [reqURL];
    routes.get(route) ? routes.get(route)(query) : error404();
}
window.addEventListener("hashchange", checkHash);
window.addEventListener("load", function () {
    if (!window.location.hash) {
        window.location.hash = "#/cirrent-location";

    } else {
        checkHash();
    }
});