var app = angular.module('merchantExplorer');

app.service('merchantResultsService', ["merchantApi", function(merchantApi) {
  //TODO make private methods private.
  
  var idUrl = "",
      batchUrl = "",
      batchSize = 20,
      resultsService = this;
  
  //Initial settings
  this.totalCalls = 0;
  this.currentCalls = 0;
  this.data = [];
  this.pending = [];
  this.refreshable = false;
  this.ids = [];
  
  
  this.getResults = function() {
    return this.data;
  }
  
  this.search = function(searchParams) {
    var deferred = merchantApi.getIds(searchParams);
    
    deferred.promise.then(function(ids) {
      resultsService.ids = ids;
      resultsService.totalCalls = ids.length;
      
      resultsService.batchCall(ids);
    });
  };
  
  this.addPendingToResults = function() {
    this.data = this.data.concat(this.pending);
    this.pending = [];
    
        console.log('data: ', this.data);
    
    this.refreshable = false;
  };
  
  this.addToPending = function(results) {
    var isInitialData = ( this.data.length === 0 ) ? true : false;
    this.pending = this.pending.concat(results);
    console.log('pending: ', this.pending);
    
    if ( isInitialData ) {
      this.addPendingToResults();
    } else {
      this.refreshable = true;
    }
    
  }
  
  this.isDone = function() {
    return this.totalCalls === this.currentCalls;
  };
  
  this.batchCall = function(ids) {
    var min = this.currentCalls,
        max = Math.min(this.currentCalls + this.batchSize, this.currentCalls);
    
    var batchIds = ids.slice(min, max);
    
    var deferred = merchantApi.batchCall(batchIds);
    
    deferred.promise.then(this.handleBatchResponse.bind(this));
  }
  
  this.handleBatchResponse = function(response) {
    this.currentCalls += response.length;
    
    this.addToPending(response);
    
    if ( this.currentCalls < this.totalCalls ) {
      this.batchCall(this.ids);
    }
  }
 
   
}])