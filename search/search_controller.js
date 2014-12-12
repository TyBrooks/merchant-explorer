var app = angular.module('merchantExplorer');
  
app.controller('SearchCtrl', ["searchParamsFactory", "merchantResultService", function(searchParamsFactory, merchantResultService) {
  var params = searchParamsFactory.createDefault(),
    lastSearch = "";
  
  this.getParams = function() {
    return params;
  }
  
  //Search Methods
  this.search = function() {
    lastSearch = merchantResultService.hashSearchParams(this.getParams());
    
    merchantResultService.makeInitialCall(this.getParams());
  }
  
  this.currentResults = function() {
    merchantResultService.getResults();
  }
  
  this.isSearchable = function() {
    var input = this.getParams();
    
    return ( merchantResultService.hashSearchParams(input) !== lastSearch)
  }
  
  
  //Dropdown options
  //TODO complete these
  this.categories = ["All Categories", "Automotive", "Consumer Electronics"];
  this.countries = ["All Countries", "US|International", "Brazil|International"];
  this.cpc_cats = ["CPC + CPA", "CPC Only", "CPA Only"];
}]);