var app = angular.module('merchantExplorer');

app.service('selectedMerchantService', ['merchantDataService', 'merchantApi', '$q' function(dataService, api, $q) {
  var selected = {},
      service = this;
  
  this.setSelected = function( results ) {
    this.selected = results;
  }
  
  this.getDataPromiseForSelected = function( id, userId ) {
    var dataPromise = $q.defer();
    
    switch( true ) {
      case ( !_.isEmpty( selected ) ):
        dataPromise.resolve( selected );
        break;
      case ( dataService.hasDataForId( id ) ):
        dataPromise.resolve( dataService.getDataForId( id ) );
        break;
      default:
        //TODO arg, logic for userId vs unrestricted
        var dataPromise = api.retrieveApiCall({
          unrestrictedOnly: false,
          userId: userId,
          merchantGroupIds: [id]
        });
        
        dataPromise.then( function( data ) {
          dataService.cacheMerchantData( data );
          service.setSelected( {} );
          return data;
        } )
    }
    
    return dataPromise;
  }
  
}])