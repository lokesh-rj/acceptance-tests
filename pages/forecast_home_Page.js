//I is an actor - acts as an abstract user
const { I } = inject();
const assert = require("assert");
const differenceHours = 300;

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
    assert.strictEqual(differentialHours, differenceHours);
  },

  //verfies summary icon by comparing the hourly details
  async verifySummaryIcon(i) {
    let firstDetailIcon = await I.grabAttributeFrom(
      `div.detail>span>svg[data-test="description-${i}-1"]`,
      "aria-label",
    );
    let summaryIcon = await I.grabAttributeFrom(
      `(//div[@class='summary']/span[@class='cell']/*[name()='svg'])[${i}]`,
      "aria-label",
    );
    assert.strictEqual(summaryIcon[0], firstDetailIcon[0]);
    //assert.strictEqual(summaryIcon[0],data.list[i-1].weather.main);
  },

  //re-usable function for verifing max temperatures
  async verifySummaryMaxTemperature(length, i) {
    var temp = "";
    var tempArray = [];
    //loops over day forecast temperature data
    for (let j = 1; j <= length; j++) {
      temp = await I.grabTextFrom(
        `div.detail>span>span.max[data-test="maximum-${i}-${j}"]`,
      );
      temp = temp.slice(0, temp.length - 1);
      tempArray.push(parseInt(temp));
    }
    maxTemp = Math.max(...tempArray);
    summaryTemp = await I.grabTextFrom(
      `div.summary>span>span.max[data-test="maximum-${i}"]`,
    );
    summaryTemp = summaryTemp.slice(0, summaryTemp.length - 1);
    assert.strictEqual(maxTemp, parseInt(summaryTemp));
  },
  //re-usable function for verifing min temperatures
  async verifySummaryMinTemperature(length, i) {
    var temp = "";
    var tempArray = [];
    //loops over day forecast temperature data
    for (let j = 1; j <= length; j++) {
      temp = await I.grabTextFrom(
        `div.detail>span>span.min[data-test="minimum-${i}-${j}"]`,
      );
      tempLength = temp.length;
      temp = temp.slice(0, tempLength - 1);
      tempArray.push(parseInt(temp));
    }
    minTemp = Math.min(...tempArray);
    summaryTemp = await I.grabTextFrom(
      `div.summary>span>span.min[data-test="minimum-${i}"]`,
    );
    summaryTemp = summaryTemp.slice(0, summaryTemp.length - 1);
    assert.strictEqual(minTemp, parseInt(summaryTemp));
  },
  //re-usable function for verifing aggregate rainfall
  async verifyAggregateRainFall(length, i) {
    var rainFall = "";
    var aggregateRainFall = 0;
    var summaryRainFall = "";
    //loops over day forecast rainfall data
    for (let j = 1; j <= length; j++) {
      rainFall = await I.grabTextFrom(
        `div.detail>span>span.rainfall[data-test="rainfall-${i}-${j}"]`,
      );
      rainFall = rainFall.slice(0, rainFall.length - 2);
      aggregateRainFall = aggregateRainFall + parseInt(rainFall);
    }
    summaryRainFall = await I.grabTextFrom(
      `div.summary>span>span.rainfall[data-test="rainfall-${i}"]`,
    );
    summaryRainFall = summaryRainFall.slice(0, summaryRainFall.length - 2);
    assert.strictEqual(aggregateRainFall, parseInt(summaryRainFall));
  },

  //re-usable function to verify wind speed and direction
  async verifyWindAndDirection(i) {
    currentSpeed = await I.grabTextFrom(
      `div.detail>span>span.speed[data-test="speed-${i}-1"]`,
    );
    currentSpeed = currentSpeed.slice(0, currentSpeed.length - 3);
    summarySpeed = await I.grabTextFrom(
      `div.summary>span>span.speed[data-test="speed-${i}"]`,
    );
    summarySpeed = summarySpeed.slice(0, summarySpeed.length - 3);
    assert.deepStrictEqual(parseInt(currentSpeed), parseInt(summarySpeed));
    let currentDirection = await I.grabAttributeFrom(
      `div.detail>span>span.direction[data-test="direction-${i}-1"]>svg`,
      "style",
    );

    let summaryDirection = await I.grabAttributeFrom(
      `div.summary>span>span.direction[data-test="direction-${i}"]>svg`,
      "style",
    );
    assert.deepStrictEqual(currentDirection, summaryDirection);
  },
};
