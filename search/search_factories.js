var app = angular.module('merchantExplorer')

app.factory('searchParamsFactory', function() {
  var factory = {};
  
  factory.createDefault = function() {
    return {
      phrase: "",
      category: "All Categories",
      country: "All Countries",
      cpc_cat: "CPC + CPA",
      affiliatable: true,
      insider: false,
      unrestricted: false
    }
  }
  
  return factory;
});