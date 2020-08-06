//I is an actor - acts as an abstract user
const { I } = inject();
const assert = require("assert");

//page objects of Weather forecast Page
module.exports = {
  headerText: {
    weatherForecastTxt: { css: "div>h1" },
  },
  fields: {
    city: { css: "input#city" },
  },
  icons: {
    detailsCloudsIcon: { css: "div.detail>span>svg[aria-label='Clouds']" },
    detailsRainIcon: { css: "div.detail>span>svg[aria-label='Rain']" },
    detailsClearIcon: { css: "div.detail>span>svg[aria-label='Clear']" },
    summaryCloudsIcon: { css: "div.summary>span>svg[aria-label='Clouds']" },
    summaryClearIcon: { css: "div.summary>span>svg[aria-label='Clear']" },
    summaryRainIcon: { css: "div.summary>span>svg[aria-label='Rain']" },
  },
  temperatures: {
    summaryMaxTemp: { css: "div.summary>span>span.max" },
    summaryMinTemp: { css: "div.summary>span>span.min" },
    detailsMaxTemp: { css: "div.detail>span>span.max" },
    detailsMinTemp: { css: "div.detail>span>span.min" },
  },

  days: {
    totalDays: { css: "span>span.name" },
    dayOne: { css: "span>span[data-test='day-1']" },
    dayTwo: { css: "span>span[data-test='day-2']" },
    dayThree: { css: "span>span[data-test='day-3']" },
    dayFour: { css: "span>span[data-test='day-4']" },
    dayFive: { css: "span>span[data-test='day-5']" },
  },
  hours: {
    dayOneHourOne: { css: "span[data-test='hour-1-1']" },
    dayOneHourTwo: { css: "span[data-test='hour-1-2']" },
    totalHours: { css: "span.hour" },
    dayTwoHourOne: { css: "span[data-test='hour-2-1']" },
    dayTwoHourTwo: { css: "span[data-test='hour-2-2']" },
  },
  errorMssgs: {
    foreCastErr: { css: "div[data-test='error']" },
  },

  //re-usable function to enter city
  enterCityInfo(cityName) {
    I.seeElement(this.headerText.weatherForecastTxt);
    I.seeElement(this.fields.city);
    I.fillField(this.fields.city, cityName);
    I.dontSee("Error retrieving the forecast");
    I.pressKey("Enter");
  },
  //re-usable function to verify differential hours
  async verifyDifferentialHours(firstHour, secondHour) {
    I.seeElement(firstHour);
    let hourOne = await I.grabHTMLFrom(firstHour);
    I.see(hourOne);
    let hourTwo = await I.grabHTMLFrom(secondHour);
    I.see(hourTwo);
    let differentialHours = parseInt(hourTwo) - parseInt(hourOne);
    assert.strictEqual(differentialHours, 300);
  },

  //verfies summary icon by comparing the hourly details
  async verifySummaryIcon() {
    let cloudy = await I.grabNumberOfVisibleElements(
      this.icons.detailsCloudsIcon,
    );
    let rainy = await I.grabNumberOfVisibleElements(this.icons.detailsRainIcon);
    let clear = await I.grabNumberOfVisibleElements(
      this.icons.detailsClearIcon,
    );
    let maxValue = Math.max(cloudy, clear, rainy);
    let summaryIcon =
      maxValue == cloudy
        ? this.icons.summaryCloudsIcon
        : maxValue == rainy
        ? this.icons.summaryRainIcon
        : this.icons.summaryClearIcon;

    I.seeElement(summaryIcon);
  },

  //re-usable function for verifing max temperatures
  async verifySummaryMaxTemperature(length) {
    var temp = "";
    var tempArray = [];
    //loops over first day forecast temperature data
    for (let i = 1; i < length; i++) {
      temp = await I.executeScript(
        `var data = document.getElementsByClassName('max');return data[${i}].innerText`,
      );

      temp = temp.slice(0, temp.length - 1);
      tempArray.push(parseInt(temp));
    }
    maxTemp = Math.max(...tempArray);
    summaryTemp = await I.executeScript(
      "var data = document.getElementsByClassName('max');return data[0].innerText",
    );
    summaryTemp = summaryTemp.slice(0, summaryTemp.length - 1);
    assert.strictEqual(maxTemp, parseInt(summaryTemp));
  },
  //re-usable function for verifing min temperatures
  async verifySummaryMinTemperature(length) {
    var temp = "";
    var tempArray = [];
    //loops over day forecast temperature data
    for (let i = 1; i < length; i++) {
      temp = await I.executeScript(
        `var data = document.getElementsByClassName('min');return data[${i}].innerText`,
      );
      tempLength = temp.length;
      temp = temp.slice(0, tempLength - 1);
      tempArray.push(parseInt(temp));
    }
    minTemp = Math.min(...tempArray);
    summaryTemp = await I.executeScript(
      "var data = document.getElementsByClassName('min');return data[0].innerText",
    );
    summaryTemp = summaryTemp.slice(0, summaryTemp.length - 1);
    assert.strictEqual(minTemp, parseInt(summaryTemp));
  },
  //re-usable function for verifing aggregate rainfall
  async verifyAggregateRainFall(length) {
    var rainFall = "";
    var aggregateRainFall = 0;
    var summaryRainFall = "";
    //loops over day forecast rainfall data
    for (let i = 1; i < length; i++) {
      rainFall = await I.executeScript(
        `var data = document.getElementsByClassName('rainfall');return data[${i}].innerText`,
      );
      rainFall = rainFall.slice(0, rainFall.length - 2);
      aggregateRainFall = aggregateRainFall + parseInt(rainFall);
    }
    summaryRainFall = await I.executeScript(
      `var data = document.getElementsByClassName('rainfall');return data[0].innerText`,
    );
    summaryRainFall = summaryRainFall.slice(0, summaryRainFall.length - 2);
    assert.strictEqual(aggregateRainFall, parseInt(summaryRainFall));
  },

  //re-usable function to verify wind speed and direction
  async verifyWindAndDirection() {
    currentSpeed = await I.executeScript(
      `var data = document.getElementsByClassName('speed');return data[1].innerText`,
    );
    currentSpeed = currentSpeed.slice(0, currentSpeed.length - 3);
    summarySpeed = await I.executeScript(
      `var data = document.getElementsByClassName('speed');return data[0].innerText`,
    );
    summarySpeed = summarySpeed.slice(0, summarySpeed.length - 3);
    assert.strictEqual(parseInt(currentSpeed), parseInt(summarySpeed));
    let currentDirection = await I.executeScript(
      `var data = document.getElementsByClassName('direction');return data[1].children[0].style.transform`,
    );
    currentDirection = currentDirection.split("(");
    currentDirection = currentDirection[1].split("d");
    currentDirection = currentDirection[0].trim();
    console.log("current: " +currentDirection);
    let summaryDirection = await I.executeScript(
      `var data = document.getElementsByClassName('direction');return data[0].children[0].style.transform`,
    );
    summaryDirection = summaryDirection.split("(");
    summaryDirection = summaryDirection[1].split("d");
    summaryDirection = summaryDirection[0].trim();
    console.log("summary: " +summaryDirection);
    assert.strictEqual(currentDirection,summaryDirection);
  },
};
