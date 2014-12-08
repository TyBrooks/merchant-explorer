var app = angular.module('merchantExplorer');
  
app.controller('SearchCtrl', ["searchParamsFactory", "merchantResultsService", "$log", function(searchParamsFactory, merchantResultsService, $log) {
  var params = searchParamsFactory.createDefault();
  
  //Tab management
  this.activeTab = "search";
  this.tabs = ["search", "filter"];
  
  // Search param groups
  this.searchParams = params["search"];
  this.filterParams = params["filter"];
  this.sharedParams = params["shared"];
  
  //Tab methods
  this.activateTab = function(clicked) {
    if(this.tabs.indexOf(clicked) !== -1) {
      this.activeTab = clicked;
    }
  };
  
  this.isActive = function(tabName) {
    return tabName === this.activeTab;
  }
  
  
  //Param Methods
  this.activeParams = function() {
    return angular.extend(this.params[this.activeTab], this.params["shared"]);
  };
  
  
  //Search Methods
  this.search = function() {
    merchantResultsService.search(this.activeParams);
  }
  
  this.currentResults = function() {
    merchantResultsService.getResults();
  }
  
  
  //Dropdown options
  //TODO complete these
  this.categories = ["All Categories", "Automotive", "Consumer Electronics"];
  this.countries = ["All Countries", "US|International", "Brazil|International"];
  this.cpc_cats = ["CPC + CPA", "CPC Only", "CPA Only"];
}]);