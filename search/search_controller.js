var app = angular.module('merchantExplorer');
  
app.controller('SearchCtrl', ["searchParamsFactory", "merchantResultService", "$log", function(searchParamsFactory, merchantResultService, $log) {
  var params = searchParamsFactory.createDefault(),
    lastSearch = "";
  
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
    if ( this.isActive( "search" ) ) {
      lastSearch = this.searchParams["phrase"];
    }
    
    merchantResultService.makeInitialCall(this.activeParams);
  }
  
  this.currentResults = function() {
    merchantResultService.getResults();
  }
  
  this.isSearchable = function() {
    var input = this.searchParams["phrase"];
    if ( this.isActive( "search" ) ) {
      return ( input !== "" && input !== lastSearch );
    } else {
      //TODO test if any categories selected
      return true;
    }
  }
  
  
  //Dropdown options
  //TODO complete these
  this.categories = ["All Categories", "Automotive", "Consumer Electronics"];
  this.countries = ["All Countries", "US|International", "Brazil|International"];
  this.cpc_cats = ["CPC + CPA", "CPC Only", "CPA Only"];
}]);