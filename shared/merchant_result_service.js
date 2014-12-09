var app = angular.module('merchantExplorer');


app.service('merchantResultService', ["merchantApi", "merchantResultModel", function(api, results) {
  
  var batchSize = 20,
      minBuffer = 20;
  
  this.makeInitialCall = function(searchParams) {
    //TODO decide whether to clear the results at click time, or api time.
    // probably click time with a loading screen
    results.clear();
    results.setCurrentSearchParams(searchParams);
    api.getIds(searchParams).then( angular.bind( this, handleInitialCall ) );
  }
  
  function handleInitialCall(ids) {
    results.setIds(ids);
    
    //TODO check if you have enough
    this.batchCall();
  }
  
  this.batchCall = function() {
    var nextIds = results.getNextIds(batchSize);
    
    //TODO check cache in results first
    api.getMerchantData(nextIds).then( angular.bind( this, handleBatchCall ) );
  }
  
  function handleBatchCall(merchantData) {
    results.addResults(merchantData);
  }
  
  //Main Data retrieval method
  this.getCurrentPageData = function(pageNum, perPage) {
    var startPos = (pageNum - 1) * perPage,
        endPos = pageNum * perPage;
    
    return results.getDataForIdRange(startPos, endPos);
  }
  
  this.checkBuffer = function(pageNum) {
    var buffer = results.getNumPreloaded();
    if ( buffer > minBuffer && results.getNumNotLoaded > 0 ) {
      var newIds = results.getNextIds(batchSize);
      api.getMerchantData(nextIds).then( angular.bind( this, handleBatchCall ) );
    }
  }
  
  
}])