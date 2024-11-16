import {config} from "dotenv";
import * as path from "path";

const setLocalEnvs = () => config({override: true, path: path.join(process.cwd(), 'development.env')});
const dateToTimestamp = (date) => new Date(date).getTime();

const timestampToDateTime = (timestamp) => {
    const dateObject = new Date(Number(timestamp)); // Or the Date object you have

// Get individual components and format them
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');

// Format back to "year/month/day hour:minute"
    return ` ${hours}:${minutes} ${day}/${month}/${year}`;
};

export {setLocalEnvs, dateToTimestamp, timestampToDateTime}