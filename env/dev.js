var app = angular.module('merchantExplorer');

//TODO set this up to have different environments

app.service("config", function() {
  var configInfo = {
    showcaseApiUrl:   "",
    merchantApiURL:   "",
    perPage:          10,
    batchSize:        10,
    numShowcases:     3
  }
  
  this.lookup = function(name) {
    return configInfo[name];
  }
  
});