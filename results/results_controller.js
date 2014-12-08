var app = angular.module('merchantExplorer');

app.controller('ResultsCtrl', ['merchantResultsService', function(resultsService) {
  //Grab results data from merchant results service
  this.results = resultsService.data;
  this.currentCalls = resultsService.currentCalls;
  this.totalCalls = resultsService.totalCalls;
  this.refreshable = resultsService.refreshable;
  
  //pass through function
  this.refreshResults = function() {
    console.log('refreshing');
    resultsService.addPendingToResults();
  }
}]);