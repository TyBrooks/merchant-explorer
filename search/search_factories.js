var app = angular.module('merchantExplorer')

app.factory('searchParamsFactory', function() {
  var factory = {};
  
  factory.createDefault = function() {
    return {
      search: {
        phrase: ""
      },
      filter: {
        category: "All Categories",
        country: "All Countries",
        cpc: "CPC + CPA"
      },
      shared: {
        affiliatable: true,
        insider: false,
        unrestricted: false
      }
    }
  }
  
  return factory;
});