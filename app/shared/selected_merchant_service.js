var app = angular.module('merchantExplorer');

app.service('selectedMerchantService', ['merchantDataService', 'merchantApi', '$q', function(dataService, api, $q) {
  var selected = {},
      service = this;
  
  this.setSelected = function( results ) {
    selected = results;
  }
  
  this.getDataPromiseForSelected = function( id, userId ) {
    var deferred = $q.defer();
    var dataPromise;
    
    switch( true ) {
      case ( !_.isEmpty( selected ) ):
        dataPromise = deferred.promise;
        deferred.resolve( selected );
        break;
      case ( dataService.hasDataForId( id, userId ) ):
        //TODO is this necessary? Maybe once we start using local storage
        dataPromise = deferred.promise;
        deferred.resolve( dataService.getDataForId( id, userId ) );
        break;
      default:
        //TODO arg, logic for userId vs unrestricted
        unformattedDataPromise = api.retrieveApiCall({
          unrestrictedOnly: false,
          userId: userId,
          merchantGroupIds: [id]
        });
        // Perform cleanup on this service and format the data like the other cases
        dataPromise = unformattedDataPromise.then( function( data ) {
          dataService.cacheMerchantData( data[0] );
          service.setSelected( {} );
          return data[0];
        } )
    }
    
    return dataPromise;
  }
  
}])