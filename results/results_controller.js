var app = angular.module('merchantExplorer');

app.controller('ResultsCtrl', ['merchantResultsService', function(resultsService) {
  //Grab results data from merchant results service
  this.results = resultsService.getResults;
  this.currentCalls = resultsService.currentCalls;
  this.totalCalls = resultsService.totalCalls;
  this.refreshable = resultsService.refreshable;
  
  //pass through function
  this.refreshResults = function() {
    resultsService.addPendingToResults();
  }
  
  this.isPendingResults = function() {
    return !(resultsService.pending.length === 0);
  }
  
  this.getCurrentResults = function() {
    return resultsService.getResults();
  }
  
}]);