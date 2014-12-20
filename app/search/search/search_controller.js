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
  this.countries = [ [ "All Countries", "" ], [ "US|International", 101 ], [ "Brazil|International", 102 ] ];
  this.coverages = [ [ "CPC + CPA", "" ], [ "CPC Only", "C" ], [ "CPA Only", "A" ] ];
  this.campaigns = bootstrap.userIds;
  
  
  // Search parameters initialization
  this.params = searchParamsFactory.createDefault();
  this.params.userId = this.campaigns[0][1];
  // this.params.userId = angular.element( document.findElementById( "campaign" ) ).find( "option" ).first().val();
  
  
  /*
   * Figures out whether the current user is logged in or not
   * Reason: Aff status / Restricted info is mutually exclusive depending on login status
   */
  this.isSignedIn = function() {
    return bootstrap.isSignedIn();
  }
  
  /*
   * Need to make sure the aff status param isn't automatically on for this
   */
  if ( !this.isSignedIn() ) {
    this.params.affiliatableOnly = false;
    this.params.userId = "";
  }
  
  
    
  //Information needed for the search button display logic
  var lastSearch = "";
  
  /*
   * Kicks off the search process by sending the result service a copy of the current search state
   */
  this.search = function() {
    lastSearch = this.params.hash({ includeAffiliatable: true });
    
    merchantResultsService.makeInitialCall( angular.copy( this.params ) );
  }
  
  /*
   * Whether or not we should disable the search button
   * Returns a boolean
   */
  this.isSearchable = function() {
    var input = this.params,
        hashedCurrent = this.params.hash({ includeAffiliatable: true }),
        hashedCurrentNoUserId,
        hashedDefaultNoUserId;
    
    if ( this.isSignedIn() ) {
      hashedCurrentNoUserId = this.params.hash({ includeAffiliatable: true, excludeUserId: true })
      hashedDefaultNoUserId = searchParamsFactory.createDefault().hash({ includeAffiliatable: true, excludeUserId: true });
    } else {
      hashedCurrentNoUserId = this.params.hash({ includeAffilatable: false, excludeUserId: true });
      hashedDefaultNoUserId = searchParamsFactory.createDefault().hash({ includeAffiliatable: false, excludeUserId: true });
    }
        
    return ( ( hashedCurrent !== lastSearch ) && ( hashedCurrentNoUserId !== hashedDefaultNoUserId ) );
  }
  
}]);