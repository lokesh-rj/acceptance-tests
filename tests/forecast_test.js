const forecastHomePage = require("../pages/forecast_home_Page.js"); //to access forecast home page objects
const testData = require("../data/test_data.js"); // pull in a data structure that holds city names
const assert = require("assert"); //to access assert library
const totalNumOfDays = 5;
const totalDetailRows = 8;

Feature("weather forecast acceptance tests");

Scenario("Verify default city on app launch", async (I) => {
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
    assert.strictEqual(numOfDays, totalNumOfDays);
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

      for (let i = 1; i <= totalNumOfDays; i++) {
        I.click(`span>span[data-test='day-${i}']`);
        let numOfDetailRows = await I.grabNumberOfVisibleElements(
          `(//div[@class="details"])[${i}]/div`,
        );
        for (let j = 1; j <= totalDetailRows; j++) {
          if (numOfDetailRows < totalDetailRows) {
            while (j < numOfDetailRows) {
              await forecastHomePage.verifyDifferentialHours(
                `span[data-test="hour-${i}-${j}"]`,
                `span[data-test="hour-${i}-${j + 1}"]`,
              );
              j++;
            }
          } else {
            while (j < numOfDetailRows) {
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
      for (let i = 1; i <= totalNumOfDays; i++) {
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
    for (let i = 1; i <= totalNumOfDays; i++) {
      I.click(`span>span[data-test='day-${i}']`);
      I.seeElement(`span[data-test="hour-${i}-1"]`);
      await forecastHomePage.verifySummaryIcon(i);
      let numOfDetailRows = await I.grabNumberOfVisibleElements(
        `(//div[@class="details"])[${i}]/div`,
      );
      if (numOfDetailRows < totalDetailRows) {
        await forecastHomePage.verifySummaryMaxTemperature(numOfDetailRows, i);
        await forecastHomePage.verifySummaryMinTemperature(numOfDetailRows, i);
        await forecastHomePage.verifyAggregateRainFall(numOfDetailRows, i);
      } else {
        await forecastHomePage.verifySummaryMaxTemperature(numOfDetailRows, i);
        await forecastHomePage.verifySummaryMinTemperature(numOfDetailRows, i);
        await forecastHomePage.verifyAggregateRainFall(numOfDetailRows, i);
      }
      await forecastHomePage.verifyWindAndDirection(i);
    }
  })
  .tag("@sanity")
  .tag("@positive")
  .tag("@direction")
  .tag("@daily");

Data(testData)
  .Scenario(
    "verify all the values should be rounded off",
    async (I, current) => {
      var data = I.readJSONData(`./data/${current.city.toLowerCase()}.json`);
      console.log("count is : " + data.cnt);
      I.amOnPage("/");
      //using current to access the testData city information
      forecastHomePage.enterCityInfo(current.city);
      //false positive acts as an assertion
      I.dontSeeElement(forecastHomePage.errorMssgs.foreCastErr);
      for (var i = 0; i < data.cnt - 1; i++) {
        let expectedMaxTemp = data.list[i].main.temp_max;
        console.log(`Expected Temp for ${i} is : ` + expectedMaxTemp);
        let actualMaxTemp = await I.executeScript(
          `var data = document.getElementsByClassName('detail');return data[${i}].children[2].children[0].innerText`,
        );
        actualMaxTemp = actualMaxTemp.slice(0, actualMaxTemp.length - 1);
        console.log("Actual Max Temp is : " + actualMaxTemp);
        assert.notStrictEqual(actualMaxTemp, expectedMaxTemp);
        let expectedMinTemp = data.list[i].main.temp_min;
        console.log(`Expected min temp for ${i} is : ` + expectedMinTemp);
        let actualMinTemp = await I.executeScript(
          `var data = document.getElementsByClassName('detail');return data[${i}].children[2].children[1].innerText`,
        );
        actualMinTemp = actualMinTemp.slice(0, actualMinTemp.length - 1);
        console.log("Actual Min Temp is : " + actualMinTemp);
        assert.notStrictEqual(actualMinTemp, expectedMinTemp);
        let expectedSpeed = data.list[i].wind.speed;
        console.log(`Expected Speed for ${i} is : ` + expectedSpeed);
        let actualSpeed = await I.executeScript(
          `var data = document.getElementsByClassName('detail');return data[${i}].children[3].children[0].innerText`,
        );
        actualSpeed = actualSpeed.slice(0, actualSpeed.length - 3);
        console.log("Actual Speed is : " + actualSpeed);
        assert.notStrictEqual(actualSpeed, expectedSpeed);
        let expectedPressure = data.list[i].main.pressure;
        console.log(`Expected Pressure for ${i} is : ` + expectedPressure);
        let actualPressure = await I.executeScript(
          `var data = document.getElementsByClassName('detail');return data[${i}].children[4].children[1].innerText`,
        );
        actualPressure = actualPressure.slice(0, actualPressure.length - 2);
        console.log("Actual Pressure is : " + actualPressure);
        assert.notStrictEqual(actualPressure, expectedPressure);
      }
    },
  )
  .tag("@sanity")
  .tag("@positive")
  .tag("@roundOff");
