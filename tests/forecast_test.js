const forecastHomePage = require("../pages/forecast_home_Page.js"); //to access forecast home page objects
const testData = require("../data/test_data.js"); // pull in a data structure that holds city names
const assert = require("assert"); //to access assert library

Feature("weather forecast acceptance tests");

Data(testData)
  .Scenario("verify forecast data for all the cities", async (I, current) => {
    I.amOnPage("/");
    //using current to access the city values
    forecastHomePage.enterCityInfo(current.city);
    //false positive acts as an assertion
    I.dontSeeElement(forecastHomePage.errorMssgs.foreCastErr);
    //grabs number of visible elements for a given element
    let numOfDays = await I.grabNumberOfVisibleElements(
      forecastHomePage.days.totalDays,
    );
    //assertion for validating the no of days displayed
    assert.equal(numOfDays, "5");
  })
  .tag("@sanity")
  .tag("@positive");

Data(testData)
  .Scenario(
    "verify whether selecting a day forecast displays 3 hourly data",
    async (I, current) => {
      I.amOnPage("/");
      //using current to access the testData city information
      forecastHomePage.enterCityInfo(current.city);
      //false positive acts as an assertion
      I.dontSeeElement(forecastHomePage.errorMssgs.foreCastErr);
      I.click(forecastHomePage.days.dayOne);
      let totalHours = await I.grabNumberOfVisibleElements(
        forecastHomePage.hours.totalHours,
      );
      if (parseInt(totalHours) !== 1) {
        await forecastHomePage.verifyDifferentialHours(
          forecastHomePage.hours.dayOneHourOne,
          forecastHomePage.hours.dayOneHourTwo,
        );
      } else {
        I.click(forecastHomePage.days.dayOne);
        I.click(forecastHomePage.days.dayTwo);
        await forecastHomePage.verifyDifferentialHours(
          forecastHomePage.hours.dayTwoHourOne,
          forecastHomePage.hours.dayTwoHourTwo,
        );
      }
    },
  )
  .tag("@sanity")
  .tag("@positive")
  .tag("@hourly");

Data(testData)
  .Scenario(
    "verify whether double clicking on a day hides the forecast data",
    async (I, current) => {
      I.amOnPage("/");
      //using current to access the testData city information
      forecastHomePage.enterCityInfo(current.city);
      //false positive acts as an assertion
      I.dontSeeElement(forecastHomePage.errorMssgs.foreCastErr);
      I.click(forecastHomePage.days.dayOne);
      I.seeElement(forecastHomePage.hours.dayOneHourOne);
      let hourOne = await I.grabHTMLFrom(forecastHomePage.hours.dayOneHourOne);
      I.see(hourOne);
      I.click(forecastHomePage.days.dayOne);
      //assertion for verifying data is hidden or not
      I.dontSee(hourOne);
    },
  )
  .tag("@sanity")
  .tag("@positive")
  .tag("@forecast-data");

Data(testData)
  .Scenario("verify the summary of daily forecast", async (I, current) => {
    I.amOnPage("/");
    //using current to access the testData city information
    forecastHomePage.enterCityInfo(current.city);
    //false positive acts as an assertion
    I.dontSeeElement(forecastHomePage.errorMssgs.foreCastErr);
    I.click(forecastHomePage.days.dayOne);
    I.seeElement(forecastHomePage.hours.dayOneHourOne);
    await forecastHomePage.verifySummaryIcon();
    await forecastHomePage.verifySummaryMaxTemperature(4);
    await forecastHomePage.verifySummaryMinTemperature(4);
    await forecastHomePage.verifyAggregateRainFall(4);
    await forecastHomePage.verifyWindAndDirection();
  })
  .tag("@sanity")
  .tag("@positive")
  .tag("@direction");
