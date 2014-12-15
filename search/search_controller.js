var app = angular.module('merchantExplorer');
  
app.controller('SearchCtrl', ["searchParamsFactory", "merchantResultService", "filterInfoFactory", function(searchParamsFactory, merchantResultService, filterFactory) {
  var params = searchParamsFactory.createDefault(),
    lastSearch = "";
  
  this.getParams = function() {
    return params;
  }
  
  //Search Methods
  this.search = function() {
    var params = this.getParams(),
        filterInfo = filterFactory.create( params );
    
    lastSearch = merchantResultService.hashSearchParams( params );
    
    merchantResultService.makeInitialCall( params, filterInfo );
  }
  
  this.currentResults = function() {
    merchantResultService.getResults();
  }
  
  this.isSearchable = function() {
    var input = this.getParams(),
        hashedCurrent = merchantResultService.hashSearchParams( input );
    
    return hashedCurrent !== lastSearch;
  }
  
  
  //Dropdown options
  //TODO complete these
  this.categories = ["All Categories", "Automotive", "Consumer Electronics"];
  this.countries = ["All Countries", "US|International", "Brazil|International"];
  this.cpc_cats = ["CPC + CPA", "CPC Only", "CPA Only"];
}]);