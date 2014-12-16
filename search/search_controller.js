/*
 * Responsibilities
 * ------
 *
 * 1. Keep track of state of the search params and filters
 * 2. Convert that state into objects and pass through to the results service
 * 3. Store the drop down lists
 *
 */


var app = angular.module('merchantExplorer');
  
app.controller( 'SearchCtrl',
  ["searchParamsFactory", "hashedSearchParamsFactory", "filterInfoFactory", "merchantResultService",
  function( searchParamsFactory, hashedParamsFactory, filterInfoFactory, merchantResultService ) {
  
  
  this.params = searchParamsFactory.createDefault();
  this.filters = { affiliatable: true };
    
  var lastSearch = "";
  
  //Search Methods
  this.search = function() {
    var params = this.params,
        hashedParams = this.hashSearchParams( params ),
        filterObj = this.filters,
        filterInfo = filterInfoFactory.create( filterObj );
      
    lastSearch = hashedParams;
    
    merchantResultService.makeInitialCall( params, hashedParams, filterInfo ); //, filterInfo
  }
  
  this.currentResults = function() {
    merchantResultService.getResults();
  }
  
  this.isSearchable = function() {
    var input = this.params,
        hashedCurrent = this.hashSearchParams( input );
    
    return hashedCurrent !== lastSearch;
  }
  
  this.hashSearchParams = function( params ) {
    return hashedParamsFactory.create( params );
  }
  
  //Dropdown options
  //TODO complete these
  this.categories = ["All Categories", "Automotive", "Consumer Electronics"];
  this.countries = ["All Countries", "US|International", "Brazil|International"];
  this.cpc_cats = ["CPC + CPA", "CPC Only", "CPA Only"];
}]);