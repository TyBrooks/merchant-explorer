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
  ["searchParamsFactory", "merchantResultsService", "bootstrapService",
  function( searchParamsFactory, merchantResultsService, bootstrap ) {
  
  /*
   * This section contains the data for the select boxes. However, it probably needs to be bootstrapped from rails.
   * this.params.userId = __ needs to reference that bootstrap as well
   */
  this.categories = [ ["All Categories", ""] ].concat( bootstrap.categories );
  this.countries = [ [ "All Countries", 100 ], [ "US|International", 101 ], [ "Brazil|International", 102 ] ];
  this.coverages = [ [ "CPC + CPA", "B" ], [ "CPC Only", "C" ], [ "CPA Only", "A" ] ];
  this.campaigns = ["Ty's Campaign", "Shoe Campaign", "Dress Campaign" ]
  
  
  // Search parameters initialization
  this.params = searchParamsFactory.createDefault();
  this.params.userId = this.campaigns[0];
    
  //Information needed for the search button display logic
  var lastSearch = "";
  
  /*
   * Kicks off the search process by sending the result service a copy of the current search state
   */
  this.search = function() {
    lastSearch = this.params.hash();
    
    merchantResultsService.makeInitialCall( angular.copy( this.params ) );
  }
  
  /*
   * Whether or not we should disable the search button
   * Returns a boolean
   */
  this.isSearchable = function() {
    var input = this.params,
        hashedCurrent = this.params.hash( true );
        hashedDefault = searchParamsFactory.createDefault().hash( true );
        
    return ( ( hashedCurrent !== lastSearch ) && ( hashedCurrent !== hashedDefault ) );
  }
  
}]);