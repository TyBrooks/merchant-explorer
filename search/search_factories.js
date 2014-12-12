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

app.factory('hashedSearchParamsFactory', function() {
  var factory = {};
  
  factory.create = function( searchParams ) {
    var affiliatable = ( searchParams.affiliatable ) ? "1" : "0";
    var insider = ( searchParams.insider ) ? "1" : "0";
    var unrestricted = ( searchParams.unrestricted ) ? "1" : "0";
    
    return searchParams.phrase +
      searchParams.category +
      searchParams.country +
      searchParams.cpc_cat +
      affiliatable +
      insider +
      unrestricted;
  }
  
  return factory;
})