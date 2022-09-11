// input date object and return string
function getDate4Shown( _d ) {
    // make sure _d is date object
    let yr = _d.getFullYear();
    let mon = _d.getMonth() + 1;
    let dy = _d.getDate();
    // leading zero
    let mon_2 = leadingZero(mon);
    let dy_2 = leadingZero(dy);
    // return the string for shown
    return yr + '/' + mon_2 + '/' + dy_2;
}

function getTime4Shown( _t ) {
    // make sure _t is date object
    // jobStartTime.getHours() + ':' + jobStartTime.getMinutes();
    let hr = _t.getHours();
    let min = _t.getMinutes();
    // leading zero
    let hr_2 = leadingZero(hr);
    let min_2 = leadingZero(min);
    // return the string for shown
    return hr_2 + ':' + min_2;
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
    let TimeZone = 8;
    dt.setTime(dt.getTime() + TimeZone * 60 * 60 * 1000);
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

export { getDate4Shown, getTime4Shown, getDateTimeToString, getDateAndTimeToObject }