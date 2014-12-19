var app = angular.module('merchantExplorer');

app.service('merchantApi', ["$http", "config", "$q", function($http, config, $q) {
  var searchUrl = config.lookup('searchApiUrl'),
      retrieveUrl = config.lookup('retrieveApiUrl'),
      useMockData = config.lookup('useMockData'),
      currentPromise = null,
      ids = [],
      currentIdx = 0;
      
  
  /*
   * Grabs all the ids that match the search params
   * Takes an object with all the api search params and returns a promise
   */
  this.searchApiCall = function( apiSearchParams ) {
    if ( useMockData ) {
      return this._getMockIds();
    }
    
    currentPromise = $http({
      method: "GET",
      url: searchUrl,
      data: apiSearchParams
    })
    
    return currentPromise;
  }
  
  /*
   * Grabs the merchant data for a batch of ids
   * Takes an object with the api retrieval params and returns a promise
   */
  this.retrieveApiCall = function( apiRetrieveParams ) {
    if ( useMockData ) {
      return this._getMockMerchantData( apiRetrieveParams.merchantGroupIds );
    }
    
    currentPromise = $http({
      method: "GET",
      url: retrieveUrl,
      data: apiRetrieveParams
    })
    
    return currentPromise;
  }
  
  /*
   * Rejects an in-flight promise
   */
  this.cancelCurrentCall = function() {
    if ( currentPromise ) {
      currentPromise.reject();
    }
  }
  
  
  /*
   * The two methods below are for development / testing purposes
   * They return mock data from a simulated api call
   * To use them, ensure useMockData is set to true in the config/env/<environment>.js file
   */
  
  this._getMockIds = function() {
    //TODO make actual calls
    var deferred = $q.defer();
    currentPromise = deferred;
    
    var pending = [];
    for (var i = 0; i < 85; i++) {
      pending.push(Math.floor(Math.random() * 1000));
    }
    ids.concat(pending);
    
    setTimeout(function() {
      deferred.resolve(pending);
    }, 200);
    
    return deferred.promise;
  }
  
  this._getMockMerchantData = function(ids) {
    //TODO make actual calls
    var deferred = $q.defer();
    currentPromise = deferred;
    
    var affiliatable = function() {
      return Boolean( Math.round( Math.random() ) == 0 );
    }
    
    var insider = function() {
      var isInsider = Boolean( Math.round( Math.random() ) == 0 );
      
      return isInsider ? "STAR" : "NONE";
    }
    
    toReturn = [];
    ids.forEach(function(id) {
      toReturn.push({
        name: "Merchant " + id,
        id: id,
        displayDomain: "www.merchant" + id + ".com",
        displayCommission: "5% on all products",
        overallCoverage: "CPC Only",
        overallRestricted: false,
        overallAffiliable: affiliatable(),
        description: "Firestone Complete Auto Care is the leading industry provider for vehicle maintenance, tires, batteries and repairs. Since 1926, when Harvey Firestone opened the doors to Firestone Tire and Rubber Company, we have provided the right solutions for our customers' vehicles. Through almost 90 years in the industry we understand that no one looks forward to the time when their vehicle needs attention, but with the help from our affiliate partners, high quality services, and dedicated teammates we can help alleviate this experience for them. We have about 1,700 conveniently located stores across the country which can easily be found by your visitors.",
        rates: [{
      			"min": 10.0000,
      			"max": 12.0000,
      			"type": "%",
      			"description": "commission on completed stay",
      			"typeName": "%"
      		}, {
      			"min": 1.0000,
      			"max": 2.0000,
      			"type": "%",
      			"description": "commission on booking",
      			"typeName": "%"
      		}],
        countries: ["US", "Canada"],
        domains: [ { name: "www.firestone.com", restricted: false, affiliable: true,  coverage: "CPC Only"},
                   { name: "www.tires.com",     restricted: true,  affiliable: false, coverage: "CPA Only" }],
        promotionType: insider()
      });
    });
    
    currentIdx += 16;
    
    setTimeout(function() {
      deferred.resolve(toReturn);
    }, 1000);
    
    return deferred.promise;
  }

}]);