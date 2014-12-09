var app = angular.module('merchantExplorer');

app.service('merchantApi', ["$q", function($q) {
  var idUrl = "",
      batchUrl = "",
      currentPromise = null;
  
  this.getIds = function(searchParams) {
    //TODO make actual calls
    var deferred = $q.defer();
    currentPromise = deferred;
    
    setTimeout(function() {
      deferred.resolve([1,2, 3, 4, 5, 6,2, 3, 4, 5, 6,2, 3, 4, 5, 6,2, 3, 4, 5, 6,2, 3, 4, 5, 6]);
    }, 200)
    
    return deferred.promise;
  }
  
  this.getMerchantData = function(ids) {
    //TODO make actual calls
    var deferred = $q.defer();
    currentPromise = deferred;
    
    setTimeout(function() {
      var rand1 = Math.floor(Math.random() * 1000);
      var rand2 = Math.floor(Math.random() * 1000);
      
      deferred.resolve(
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
        },{
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
        },{
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
        },{
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
        },{
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
        },{
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
    
    return deferred.promise;
  }
  
  this.cancelCurrentCall = function() {
    if ( currentPromise ) {
      currentPromise.reject();
    }
  }
}]);