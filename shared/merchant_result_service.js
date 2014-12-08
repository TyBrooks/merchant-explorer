var app = angular.module('merchantExplorer');

app.service('merchantResultsService', ["merchantApi", function() {
  //TODO make private methods private.
  
  var idUrl = "",
      batchUrl = "",
      batchSize = 20,
      resultsService = this;
  
  //Initial settings
  this.totalCalls = 0;
  this.currentCalls = 0;
  this.data = {};
  this.pending = {};
  this.refreshable = false;
  this.ids = [];
  
  this.getResults = function(searchParams) {
    var promise = merchantApi.getIds(searchParams);
    
    promise.then(function(ids) {
      resultsService.ids = ids;
      resultsService.totalCalls = ids.length;
      
      resultsService.batchCall(ids);
    });
  };
  
  this.addPendingToResults = function() {
    this.data.concat(this.pending);
    this.pending = {};
    
    this.refreshable = false;
  };
  
  this.addToPending = function(results) {
    this.pending.concat(results);
    
    this.refreshable = true;
  }
  
  this.isDone = function() {
    return this.totalCalls === this.currentCalls;
  };
  
  this.batchCall = function(ids) {
    var min = this.currentCalls,
        max = Math.min(this.currentCalls + this.batchSize, this.currentCalls);
    
    var batchIds = ids.slice(min, max);
    
    var promise = merchantApi.batchCall(batchIds);
    
    promise.then(handleBatchResponse.bind(this));
    //TODO failed promise
  }
  
  this.handleBatchResponse = function(response) {
    this.currentCalls += response.length;
    
    this.addToPending(response);
    
    if ( this.currentCalls < this.totalCalls ) {
      this.batchCall(this.ids);
    }
  }
 
   
}])