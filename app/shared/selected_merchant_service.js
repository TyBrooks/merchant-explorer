var app = angular.module('merchantExplorer');


/*
 * This is the service responsible for transfering data between the show and search pages
 * Besides being a one-time 
 */
app.service('selectedMerchantService', ['merchantDataService', 'merchantApi', '$q', function(dataService, api, $q) {
  var selected = {},
      service = this;
      
  this.userId = null;
  this.currentPage = 1;
  
  this.setSelected = function( results ) {
    selected = results;
  }
  
  this.getDataPromiseForSelected = function( id, userId ) {
    var deferred = $q.defer();
    var dataPromise;
    
    switch( true ) {
      // When the data for the selected merchant has already been set.
      case ( !_.isEmpty( selected ) ):
        dataPromise = deferred.promise;
        deferred.resolve( selected );
        break;
      // When the data for the selected merchant hasn't been set, but is cached already
      case ( dataService.hasDataForId( id, userId ) ):
        //TODO is this necessary? Maybe once we start using local storage
        dataPromise = deferred.promise;
        deferred.resolve( dataService.getDataForId( id, userId ) );
        break;
      // All other cases (i.e. the data for the merchant hasn't been set and doesn't exist in the cache)
      default:
        unformattedDataPromise = api.retrieveApiCall({
          userId: userId,
          merchantGroupIds: [id]
        });
        // Perform cleanup on this service and format the data like the other cases
        dataPromise = unformattedDataPromise.then( function( response ) {
          dataService.cacheMerchantData( response.data );
          service.setSelected( {} );
          return response.data[0];
        } )
    }
    
    return dataPromise;
  }
  
}])