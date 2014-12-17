/*
 * Responsibilities
 * --------
 *
 * 1. Handle all logic necessary for the view/html layer
 *
 */


var app = angular.module('merchantExplorer');

app.controller('ResultsCtrl', ['merchantResultService', '$location', 'config', function( resultsService, $location, config ) {
  var currentPage = 1,
      perPage = config.lookup('perPage');
  
  // Pass through methods
  
  this.getCurrentPageData = function() {
    //Hrmmm, not sure if this is the best way to do this
    if ( resultsService.isNewSearch() ) {
      currentPage = 1;
    }
    
    return resultsService.getCurrentPageData( currentPage, perPage );
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
  
  this.redirectTo = function( result ) {
    console.log(result);
    $location.path('/merchants/' + result.id);
    $location.replace();
  }
  
}]);