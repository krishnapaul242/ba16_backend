const { addMinutes, addHours, addDays, addMonths, addYears, format } = require('date-fns');

module.exports = {
    get_current_date: () => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        return date;
    },
    get_current_time: (val) => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return time;
    },
    get_current_date_time: () => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date + ' ' + time;
        return dateTime;
    },
    add_hours: (val, hours) => {
        const date = new Date(val);
        const sum = addHours(date, hours);
        return format(sum, 'yyyy-MM-dd HH:mm:ss');
    },
    add_minutes: (val, minutes) => {
        const date = new Date(val);
        const sum = addMinutes(date, minutes);
        return format(sum, 'yyyy-MM-dd HH:mm:ss');
    },
    add_days: (val, days) => {
        const date = new Date(val);
        const sum = addDays(date, days);
        return format(sum, 'yyyy-MM-dd HH:mm:ss');
    },
    add_years: (val, years) => {
        const date = new Date(val);
        const sum = addYears(date, years);
        return format(sum, 'yy-MM-dd HH:mm:ss');
    },
    format_date: (val, method) => {
        const date = new Date(val);
        return format(date, method);
    },
    compare_date_time: (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        if (date1 > date2) {
            return 1;
        } else if (date1 < date2) {
            return 2;
        } else {
            return 0;
        }
    }

}