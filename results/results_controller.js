var app = angular.module('merchantExplorer');

app.controller('ResultsCtrl', ['merchantResultsService', function(resultsService) {
  var currentPage = 1,
      perPage = 10,
      results = [];
  
  this.getCurrentPageData = function() {
    return resultsService.getPageData(currentPage);
  }
  
  this.getCurrentResults = function() {
    
  }
  
  
  
  
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