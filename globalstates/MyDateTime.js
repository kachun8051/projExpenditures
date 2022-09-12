// input date object and return string
function getDate4Shown( _d ) {
    if (typeof _d === 'undefined') {
        return '';
    }
    // make sure _d is date object
    let yr = _d.getFullYear();
    let mon = _d.getMonth() + 1;
    let dy = _d.getDate();
    // leading zero
    let mon_2 = leadingZero(mon);
    let dy_2 = leadingZero(dy);
    let str = yr + '/' + mon_2 + '/' + dy_2;
    console.log("getDate4Shown: " + str);
    // return the string for shown
    return str;
}

function getTime4Shown( _t ) {

    if (typeof _t === 'undefined') {
        return '';
    }
    // make sure _t is date object
    // jobStartTime.getHours() + ':' + jobStartTime.getMinutes();
    let hr = _t.getHours();
    let min = _t.getMinutes();
    // leading zero
    let hr_2 = leadingZero(hr);
    let min_2 = leadingZero(min);
    let str = hr_2 + ':' + min_2;
    console.log("getTime4Shown: " + str);
    // return the string for shown
    return str;
}

// convert datetime object from cloud database to string
function getDateTimeToString(_dt) {
    let dt = getDateTimeToDate(_dt)
    let datepart = getDate4Shown(dt);
    let timepart = getTime4Shown(dt);
    return datepart + ' ' + timepart;
}

// convert datetime object from cloud database to datetime object
function getDateTimeToDate( _dt ) {
    // {"__type":"Date","iso":"2022-09-04T01:35:00.000Z"}
    let input = _dt['iso'];
    if (typeof input == undefined) {
        return "";
    }
    console.log("input datetime: " + input);
    let dt = new Date(input);
    return dt;
}

// input date, time and combined 2 to 1 data object
function getDateAndTimeToObject( _d, _t ){
    // make sure _d and _t are date object
    let yr = _d.getFullYear();
    // no need to add one for month
    let mon = _d.getMonth();
    let dy = _d.getDate();
    let hr = _t.getHours();
    let min = _t.getMinutes();
    let dt = new Date(yr, mon, dy, hr, min, 0);
    // the time zone is 8 hours for hong kong
    //let TimeZone = 8;
    //dt.setTime(dt.getTime() + TimeZone * 60 * 60 * 1000);
    return dt;
}
// input string in format "yyyy/MM/dd HH:mm" to date object 
function getDateFromString( str ) {
    const arr_1 = str.split(" ");
    // arr_1[0] is date part
    // arr_1[1] is time part
    const arr_1_1 = arr_1[0].split("/");
    // arr_1_1[0] is year
    // arr_1_1[1] is month
    // arr_1_1[2] is day
    let yr = parseInt(arr_1_1[0]);
    // month is zero-index
    let mon = parseInt(arr_1_1[1])-1;
    let dy = parseInt(arr_1_1[2]);
    const arr_1_2 = arr_1[1].split(":");
    // arr_1_2[0] is hour
    // arr_1_2[1] is minute
    let hr = parseInt(arr_1_2[0]);
    let min = parseInt(arr_1_2[1]);
    let dt = new Date(yr, mon, dy, hr, min, 0);
    return dt;
}

// get Now concerning year, month and day only
// with time as 00:00:00
const getNowAtZero = () => {
    const dt = new Date();
    dt.setHours(0, 0, 0, 0);
    return dt;
}

function leadingZero( input ) {
    if (isNaN(input) == true ) {
        return input;
    }
    if (input < 10) {
        return "0" + input;
    }
    return input;
}



export { getDate4Shown, getTime4Shown, getDateTimeToString, getDateAndTimeToObject, getDateFromString, getNowAtZero }