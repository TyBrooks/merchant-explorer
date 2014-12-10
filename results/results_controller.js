var app = angular.module('merchantExplorer');

//PROBLEMS:
// how to know when the search button is clicked

app.controller('ResultsCtrl', ['merchantResultService', function(resultsService) {
  var currentPage = 1,
      perPage = 10;
  
  // Pass through methods
  
  this.getCurrentPageData = function() {
    var results = resultsService.getCurrentPageData(currentPage, perPage);
    return results;
  }
  
  this.getTotalPages = function() {
    return resultsService.getTotalPages(perPage);
  }
  

  //Page Methods
  
  this.currentPage = function() {
    return currentPage;
  }
  
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
    var numPages = this.getTotalPages();
    return (currentPage < numPages);
  }
  
}]);