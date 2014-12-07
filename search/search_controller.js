var app = angular.module('merchantExplorer', []);
  
app.controller('searchController', ["searchParamsFactory", "MerchantResultsService", function(searchParamsFactory, merchantResultsService) {
  var params = searchParamsFactory.createDefault();
  
  this.activeTab = "search";
  this.tabs = ["Search", "Filter"];
  
  this.searchParams = params["search"];
  this.filterParams = params["filter"];
  this.sharedParams = params["shared"];
  
  this.activateTab = function(activeTab) {
    if(this.tabs.indexOf(activeTab) !== -1) {
      this.activeTab = activeTab;
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
}