import moment from "moment-timezone";

export const currentLocalTime = (timezone, format) => {
    return moment.tz(moment.now(), timezone).format(format);
};

export const UTCTime = () => {
    return new Date(new Date().toUTCString());
};

export const currentUTCTime = (format) => {
    return moment().utc().format(format);
};

export const localToUtcTime = (time, timezone, format) => {
    return moment.tz(time, timezone).utc().format(format);
};