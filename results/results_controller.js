var app = angular.module('merchantExplorer');

//PROBLEMS:
// how to know when the search button is clicked

app.controller('ResultsCtrl', ['merchantResultService', 'config', function( resultsService, config ) {
  var currentPage = 1,
      perPage = config.lookup('perPage');
  
  // Pass through methods
  
  this.getCurrentPageData = function() {
    //Hrmmm, not sure if this is the best way to do this
    if ( resultsService.isNewSearch() ) {
      currentPage = 1;
    }
    
    if ( this.isLoading() ) {
      return resultsService.getBlankResults();
    } else {
      var results = resultsService.getCurrentPageData( currentPage, perPage );
      return results;
    }
  }
  
  this.getTotalPages = function() {
    return resultsService.getTotalPages( perPage );
  }
  
  this.isLoading = function() {
    return resultsService.isLoading( currentPage, perPage );
  }
  

  //Page Methods
  
  this.currentPage = function() {
    return currentPage;
  }
  
  this.nextPage = function() {
    currentPage += 1;
  }
  
  this.previousPage = function() {
    currentPage -= 1;
  }
  
  this.setPage = function( pageNum ) {
    if ( this.pageLoadable( pageNum ) ) {
      currentPage = pageNum;
    }
  }
  
  this.doShowPrevious = function() {
    return currentPage !== 1;
  }
  
  this.doShowNext = function() {
    var numPages = this.getTotalPages();
    return ( currentPage < numPages && !this.isLoading() );
  }
  
  this.doShowLeadingDots = function() {
    return ( ( currentPage - 2 ) > 1 ) && ( this.getTotalPages() > 0 );
  }
  
  this.doShowTrailingDots = function() {
    return ( currentPage + 2 ) < this.getTotalPages();
  }
  
  this.pageLoadable = function(pageNum) {
    if ( pageNum > currentPage ) {
      return !this.isLoading();
    } else {
      return true;
    }
  }
  
}]);