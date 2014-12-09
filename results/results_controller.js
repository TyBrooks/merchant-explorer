var app = angular.module('merchantExplorer');

app.controller('ResultsCtrl', ['merchantResultService', function(resultsService) {
  var currentPage = 1,
      perPage = 10,
      results = [];
  
  this.getCurrentPageData = function() {
    var results = resultsService.getCurrentPageData(currentPage, perPage);
    console.log(results);
    return results;
  }
  
  //Page Methods
  
  this.nextPage = function() {
    currentPage += 1;
    resultsService.checkBuffer();
  }
  
  this.previousPage = function() {
    currentPage -= 1;
    resultsService.checkBuffer();
  }
  
  this.setPage = function(pageNum) {
    currentPage = pageNum;
    resultsService.checkBuffer();
  }
  
  this.doShowPrevious = function() {
    return currentPage !== 1;
  }
  
  this.doShowNext = function() {
    return true;
  }
  
}]);