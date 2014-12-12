var app = angular.module('merchantExplorer');

//PROBLEMS:
// how to know when the search button is clicked

app.controller('ResultsCtrl', ['merchantResultService', 'config', function(resultsService, config) {
  var currentPage = 1,
      perPage = config.lookup('perPage');
  
  // Pass through methods
  
  this.getCurrentPageData = function() {
    if ( this.isLoading() ) {
      console.log(resultsService.getBlankResults())
      return resultsService.getBlankResults();
    } else {
      var results = resultsService.getCurrentPageData(currentPage, perPage);
      return results;
    }
  }
  
  this.getTotalPages = function() {
    return resultsService.getTotalPages(perPage);
  }
  
  this.isLoading = function() {
    return resultsService.isLoading(currentPage, perPage);
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
    if ( this.pageLoadable(pageNum) ) {
      currentPage = pageNum;
      resultsService.checkBuffer();
    }
  }
  
  this.doShowPrevious = function() {
    return currentPage !== 1;
  }
  
  this.doShowNext = function() {
    var numPages = this.getTotalPages();
    return (currentPage < numPages && !this.isLoading());
  }
  
  this.pageLoadable = function(pageNum) {
    if (pageNum > currentPage) {
      return !this.isLoading();
    } else {
      return true;
    }
  }
  
}]);