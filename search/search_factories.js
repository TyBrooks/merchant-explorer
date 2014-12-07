var app = angular.module('merchantExplorer', [])

app.factory('searchParamsFactory', function() {
  var factory = {};
  
  factory.createDefault = function() {
    return {
      search: {
        phrase: ""
      },
      filter: {
        category: "",
        country: "",
        cpc: ""
      },
      shared: {
        affiliatable: true,
        insider: false,
        unrestricted: false
      }
    }
  }
  
  return factory;
}