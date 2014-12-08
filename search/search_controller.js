var app = angular.module('merchantExplorer');
  
app.controller('SearchCtrl', ["searchParamsFactory", "merchantResultsService", "$log", function(searchParamsFactory, merchantResultsService, $log) {
  var params = searchParamsFactory.createDefault();
  
  this.activeTab = "search";
  this.tabs = ["search", "filter"];
  
  this.searchParams = params["search"];
  this.filterParams = params["filter"];
  this.sharedParams = params["shared"];
  
  this.activateTab = function(clicked) {
    if(this.tabs.indexOf(clicked) !== -1) {
      this.activeTab = clicked;
    }
  };
  
  this.isActive = function(tabName) {
    return tabName === this.activeTab;
  }
  
  this.activeParams = function() {
    return angular.extend(this.params[this.activeTab], this.params["shared"]);
  };
  
  this.search = function() {
    merchantResultsService.getResults(this.activeParams);
  }
  
  
  //Dropdown options
  //TODO complete these
  this.categories = ["All Categories", "Automotive", "Consumer Electronics"];
  this.countries = ["All Countries", "US|International", "Brazil|International"];
  this.cpc_cats = ["CPC + CPA", "CPC Only", "CPA Only"];
}]);