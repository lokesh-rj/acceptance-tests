// in this file you can append custom step methods to 'I' object
const fs = require("fs");
const moment = require("moment");
module.exports = function () {
  return actor({
    // Define custom steps here, use 'this' to access default methods of I.
    //reads the given JSON file
    readJSONData: function (fileName) {
      var data = JSON.parse(fs.readFileSync(fileName, "utf-8"));
      return data;
    },
    calculateHours: function (dateValue) {
      var hours = moment.unix(dateValue).utc().toDate();
      hours = hours.toString().split(" ");
      hours = hours[4];
      hours = hours.split(":");
      hours = hours[0] + hours[1];
      return hours;
    },
  });
};
