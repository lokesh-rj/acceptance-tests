const forecastHomePage = require("../pages/forecast_home_Page.js"); //to access forecast_homePage page objects

Feature("weather forecast negative tests");

Scenario("verify error messages when user enters incorrect city info", (I) => {
  //Array of invalid test data
  const data = ["Bengaluru", " ", "1234","Abeerde","@232!as"];
  //loops over the data array
  data.forEach((city) => {
    I.amOnPage("/");
    forecastHomePage.enterCityInfo(city);
    //see functions acts as assertion
    I.seeElement(forecastHomePage.errorMssgs.foreCastErr);   
  });
}).tag("@negative").tag("@sanity");
