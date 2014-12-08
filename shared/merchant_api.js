var app = angular.module('merchantExplorer');

app.service('merchantApi', ["$q", function($q) {
  var idUrl = "",
      batchUrl = "";
  
  this.getIds = function(searchParams) {
    //TODO make actual calls
    var promise = $q.defer();
    
    setTimeout(function() {
      promise.resolve([1,2, 3, 4, 5, 6]);
    }, 200)
    
    return promise;
  }
  
  this.batchCall = function(ids) {
    //TODO make actual calls
    var promise = $q.defer();
    
    setTimeout(function() {
      var rand1 = Math.floor(Math.random() * 1000);
      var rand2 = Math.floor(Math.random() * 1000);
      
      promise.resolve(
        [{
            name: "Merchant " + rand1,
            domain: "D1",
            country: "US",
            cpc: "CPC and CPA",
            aff_status: true,
            commission: "5% on all products"
        }, {
            name: "Merchant " + rand2,
            domain: "D2",
            country: "UK",
            cpc: "CPC Only",
            aff_status: true,
            commission: "8% on all products"
        }]
      );
    }, 1000);
    
    return promise;
  }
}]);