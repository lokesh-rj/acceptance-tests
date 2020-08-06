(function () {
  const data = new DataTable(["city"]); // declare our test data datatable
  data.add(["Aberdeen"]);
  data.add(["Dundee"]);
  data.add(["Edinburgh"]);
  data.add(["Glasgow"]);
  data.add(["Perth"]);
  data.add(["Stirling"]);

  module.exports = data; // return our test data datatable
})();
