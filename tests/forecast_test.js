const forecastHomePage = require("../pages/forecast_home_Page.js"); //to access forecast home page objects
const testData = require("../data/test_data.js"); // pull in a data structure that holds city names
const assert = require("assert"); //to access assert library

Feature("weather forecast acceptance tests");

Scenario("Verify default city on app launch", (I) => {
  I.amOnPage("/");
  I.seeInField(forecastHomePage.fields.city, "Glasgow");
})
  .tag("@Sanity")
  .tag("@positive");

Data(testData)
  .Scenario("verify forecast data for all the cities", async (I, current) => {
    I.amOnPage("/");
    //using current to access the city values
    forecastHomePage.enterCityInfo(current.city);
    //false positive acts as an assertion
    I.dontSeeElement(forecastHomePage.errorMssgs.foreCastErr);
    let numOfDays = await I.grabNumberOfVisibleElements(
      forecastHomePage.days.totalDays,
    );
    //assertion for validating the no of days displayed
    assert.strictEqual(numOfDays, 5);
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
      for (let i = 1; i <= 5; i++) {
        I.click(`span>span[data-test='day-${i}']`);
        for (let j = 1; j <= 8; j++) {
          if (i === 1) {
            while (j < 3) {
              await forecastHomePage.verifyDifferentialHours(
                `span[data-test="hour-${i}-${j}"]`,
                `span[data-test="hour-${i}-${j + 1}"]`,
              );
              j++;
            }
          } else {
            while (j < 8) {
              await forecastHomePage.verifyDifferentialHours(
                `span[data-test="hour-${i}-${j}"]`,
                `span[data-test="hour-${i}-${j + 1}"]`,
              );
              j++;
            }
          }
        }
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
      for (let i = 1; i <= 5; i++) {
        I.click(`span>span[data-test='day-${i}']`);
        I.seeElement(`span[data-test="hour-${i}-1"]`);
        let hourOne = await I.grabHTMLFrom(`span[data-test="hour-${i}-1"]`);
        I.see(hourOne);
        I.click(`span>span[data-test='day-${i}']`);
        //assertion for verifying data is hidden or not
        I.dontSee(hourOne);
      }
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
    for (let i = 1; i <= 5; i++) {
      I.click(`span>span[data-test='day-${i}']`);
      I.seeElement(`span[data-test="hour-${i}-1"]`);
      await forecastHomePage.verifySummaryIcon(i);
      if (i === 1) {
        await forecastHomePage.verifySummaryMaxTemperature(3, i);
        await forecastHomePage.verifySummaryMinTemperature(3, i);
        await forecastHomePage.verifyAggregateRainFall(3, i);
      } else {
        await forecastHomePage.verifySummaryMaxTemperature(8, i);
        await forecastHomePage.verifySummaryMinTemperature(8, i);
        await forecastHomePage.verifyAggregateRainFall(8, i);
      }
      await forecastHomePage.verifyWindAndDirection(i);
    }
  })
  .tag("@sanity")
  .tag("@positive")
  .tag("@direction")
  .tag("@daily");
