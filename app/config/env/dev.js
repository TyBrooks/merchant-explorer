var app = angular.module('merchantExplorer');

//TODO set this up to have different environments

app.service("config", function() {
  var configInfo = {
    showcaseApiUrl:     "",
    searchApiUrl:       "qa-web-va.ec2.viglink.com:8080/rest/merchantgroups",
    retrieveApiUrl:     "qa-web-va.ec2.viglink.com:8080/rest/merchantgroups/merchant-groups",
    perPage:            10,
    batchSize:          10,
    minBuffer:          20,
    numShowcases:       3,
    useMockData:        true
  }
  
  this.lookup = function(name) {
    return configInfo[name];
  }
  
});