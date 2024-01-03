'use strict';

export const weekDayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export const monthsNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

export const getCurrentDate = function () {
    const currentDate = new Date();
    const weekDayName = weekDayNames[currentDate.getUTCDay()];
    const monthName = monthsNames[currentDate.getUTCMonth()];
    const day = currentDate.getUTCDate();
    const year = currentDate.getUTCFullYear();

    return `${weekDayName}, ${monthName} ${day}, ${year}`;
};

export const getDate = function () {
    const currentDate = new Date();
    const monthName = monthsNames[currentDate.getUTCMonth()];
    const day = currentDate.getUTCDate();

    return `${day}  ${monthName} `;
};

export const getTime = function (dateUnix) {
    const date = new Date((dateUnix) * 1000);
    const hour = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const Period = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12} : ${minutes}   ${Period}`
};

export const mpstokmh = (mps) => {

    return (mps * 3600) / 1000;

};
export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk"
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
    },
    3: {
        level: "Moderates",
        message: "Air Quality Is ConSiderde and air pollution poes liter or no risk"
    }
    ,
    4: {
        level: "Poor",
        message: "Members of sensitive groups may experience health effects. The general public is not likely to be affecte"
    }
    ,
    5: {
        level: "Very Poor",
        message: "Air Quality Is ConSiderde and air pollution poes liter or no risk"
    }

}