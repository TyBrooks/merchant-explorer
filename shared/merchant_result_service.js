var app = angular.module('merchantExplorer');

app.service('merchantResultsService', ["merchantApi", function(merchantApi) {
  //TODO make private methods private.
  
  var idUrl = "",
      batchUrl = "",
      batchSize = 20,
      resultsService = this,
      totalCalls = 0,
      currentCalls = 0,
      data = [],
      pending = [],
      ids = [];
  
  
  //public getter methods
  
  this.getResults = function() {
    return data;
  }
  
  this.getPageData = function(paqe) {
    return results.data( ( currentPage - 1 ) * perPage, perPage);
  }
  
  this.getCallCountInfo = function() {
    return {
      totalCalls: totalCalls,
      currentCalls: currentCalls
    }
  }
  
  this.isPendingResults = function() {
    return pending.length > 0;
  }
  
  this.isDone = function() {
    return totalCalls === currentCalls;
  };
  
  //Search methods
  
  this.search = function(searchParams) {
    this.resetSearchData();
    this.idCall(searchParams);
    
  };
  
  this.resetSearchData = function() {
    data = [];
    pending = [];
    currentCalls = 0;
    totalCalls = 0;
    
    merchantApi.cancelCurrentCall();
  }
  
  //Methods for handling pending data
  
  this.addPendingToResults = function() {
    data = data.concat(pending);
    pending = [];
  };
  
  this.addToPending = function(results) {
    var isInitialData = ( data.length === 0 ) ? true : false;
    pending = pending.concat(results);
    
    if ( isInitialData ) {
      this.addPendingToResults();
    }
  }
  
  //API internal methods
  
  this.idCall = function(searchParams) {
    merchantApi.getIds(searchParams).then(this.handleIdResponse.bind(this));
  }
  
  this.handleIdResponse = function(responseIds) {
    ids = responseIds;
    totalCalls = ids.length;
    
    this.batchCall(ids);
  }
  
  this.batchCall = function(ids) {
    var min = currentCalls,
        max = Math.min(currentCalls + batchSize, currentCalls);
    
    var batchIds = ids.slice(min, max);
    
    merchantApi.batchCall(batchIds).then(this.handleBatchResponse.bind(this));
  }
  
  this.handleBatchResponse = function(response) {
    currentCalls += response.length;
    
    this.addToPending(response);
    
    if ( currentCalls < totalCalls ) {
      this.batchCall(ids);
    }
  }
   
}])