var app = angular.module('merchantExplorer');

app.controller('ResultsCtrl', ['merchantResultsService', function(resultsService) {
  //pass through functions
  this.refreshResults = function() {
    resultsService.addPendingToResults();
  }
  
  this.isPendingResults = function() {
    return resultsService.isPendingResults();
  }
  
  this.getCurrentResults = function() {
    return resultsService.getResults();
  }
  
  this.getCallCountInfo = function() {
    return resultsService.getCallCountInfo();
  }
  
}]);