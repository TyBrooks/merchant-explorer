var app = angular.module('merchantExplorer');


app.service('merchantResultService', ["merchantApi", "merchantResultModel", function(api, results) {
  
  var batchSize = 20;
  
  this.makeInitialCall = function(searchParams) {
    //TODO decide whether to clear the results at click time, or api time.
    // probably click time with a loading screen
    results.clear();
    results.setCurrentSearchParams(searchParams);
    api.getIds(queryParams).then( angular.bind( this, handleInitialCall ) );
  }
  
  function handleInitialCall(ids) {
    results.setIds(ids);
  }
  
  this.batchCall = function() {
    var nextIds = results.getNextIds(batchSize);
    
    //TODO check cache in results first
    api.batchCall(nextIds).then( angular.bind( this, handleBatchCall ) );
  }
  
  function handleBatchCall(merchantData) {
    results.addResults(merchantData);
  }
  
}])