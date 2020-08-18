const moment = require("moment");

var localTime = moment.unix(1474372800).utc().toDate();
var hours = moment.unix(1474372800).utc().toDate();
hours = hours.toString().split(" ");
hours = hours[4];
hours = hours.split(":");
hours = (hours[0])+(hours[1]);
var offsetTime = moment.unix(1474372800).utcOffset();
var utcTime = moment.unix(1474372800).toDate();
console.log("hours are : "+hours);
console.log("offset time is : "+offsetTime);
console.log("Local Time is : "+localTime);
console.log("UTC time : "+utcTime);