var app = angular.module('merchantExplorer');

//TODO set this up to have different environments

app.service("config", function() {
  var configInfo = {
    showcaseApiUrl:     "",
    userApiUrl:         "//publishers.qa.viglink.com:8080/account/users",
    searchApiUrl:       "//publishers.qa.viglink.com:8080/rest/merchantgroups/search",
    retrieveApiUrl:     "//publishers.qa.viglink.com:8080/rest/merchantgroups",
    perPage:            10,
    batchSize:          10,
    minBuffer:          20,
    numShowcases:       3,
    useMockData:        false,
    loadExternalUsers:  true
  }
  
  this.lookup = function(name) {
    return configInfo[name];
  }
  
});