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
      deferred.resolve([1,2, 3, 4, 5, 6, 7, 8]);
    }, 200)
    
    return deferred.promise;
  }
  
  this.getMerchantData = function(ids) {
    //TODO make actual calls
    var deferred = $q.defer();
    currentPromise = deferred;
    
    setTimeout(function() {
      // var rand1 = Math.floor(Math.random() * 1000);
      // var rand2 = Math.floor(Math.random() * 1000);
      // var rand3 = Math.floor(Math.random() * 1000);
      // var rand4 = Math.floor(Math.random() * 1000);
      // var rand5 = Math.floor(Math.random() * 1000);
      // var rand6 = Math.floor(Math.random() * 1000);
      // var rand7 = Math.floor(Math.random() * 1000);
      // var rand8 = Math.floor(Math.random() * 1000);
      
      deferred.resolve(
        [{
            name: "Merchant 1",
            id: 1,
            domain: "D1",
            country: "US",
            cpc: "CPC and CPA",
            aff_status: true,
            commission: "5% on all products"
        }, {
            name: "Merchant 2",
            id: 2,
            domain: "D2",
            country: "UK",
            cpc: "CPC Only",
            aff_status: true,
            commission: "8% on all products"
        },{
            name: "Merchant 3",
            id: 3,
            domain: "D1",
            country: "US",
            cpc: "CPC and CPA",
            aff_status: true,
            commission: "5% on all products"
        }, {
            name: "Merchant 4",
            id: 4,
            domain: "D2",
            country: "UK",
            cpc: "CPC Only",
            aff_status: true,
            commission: "8% on all products"
        },{
            name: "Merchant 5",
            id: 5,
            domain: "D1",
            country: "US",
            cpc: "CPC and CPA",
            aff_status: true,
            commission: "5% on all products"
        }, {
            name: "Merchant 6",
            id: 6,
            domain: "D2",
            country: "UK",
            cpc: "CPC Only",
            aff_status: true,
            commission: "8% on all products"
        },{
            name: "Merchant 7",
            id: 7,
            domain: "D1",
            country: "US",
            cpc: "CPC and CPA",
            aff_status: true,
            commission: "5% on all products"
        }, {
            name: "Merchant 8",
            id: 8,
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