var app = angular.module('merchantExplorer');
  
app.controller( 'SearchCtrl',
  ["searchParamsFactory", "hashedSearchParamsFactory", "filterInfoFactory", "merchantResultService",
  function( searchParamsFactory, hashedParamsFactory, filterInfoFactory, merchantResultService ) {
  
  
  var params = searchParamsFactory.createDefault(),
    lastSearch = "";
  
  this.getParams = function() {
    return params;
  }
  
  this.getFilters = function() {
    return { affiliatable: false }
  }
  
  //Search Methods
  this.search = function() {
    var params = this.getParams(),
        hashedParams = this.hashSearchParams( params ),
        filterObj = this.getFilters(),
        filterInfo = filterInfoFactory.create( filterObj );
      
    lastSearch = hashedParams;
    
    merchantResultService.makeInitialCall( hashedParams, filterInfo ); //, filterInfo
  }
  
  this.currentResults = function() {
    merchantResultService.getResults();
  }
  
  this.isSearchable = function() {
    var input = this.getParams(),
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