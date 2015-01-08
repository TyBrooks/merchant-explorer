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
  ["searchParamsFactory", "merchantResultsService", "bootstrapService", "selectedMerchantService",
  function( searchParamsFactory, merchantResultsService, bootstrap, selectedService ) {
  var search = this,
      isLoading = true;
  
  /*
   * This section contains the data for the select boxes. However, it probably needs to be bootstrapped from rails.
   * this.params.userId = __ needs to reference that bootstrap as well
   */
  this.categories = [ ["All Categories", ""] ].concat( bootstrap.categories );
  this.countries = [ [ "All Countries", "" ], [ "US|International", 101 ], [ "Brazil|International", 102 ] ];
  this.coverages = [ [ "CPC + CPA", "" ], [ "Has CPC", "CPC" ], [ "Has CPA", "CPA" ] ];
  
  //TODO clean this up -- put logic in app initialization?
  campaignPromise = bootstrap.getUserInfo();
  campaignPromise.then( function( userIds ) {
    if ( !_.isEmpty( userIds ) ) {
      search.campaigns = userIds;
    } else {
      search.campaigns = [ ["", ""] ];
    }
    
    // Search parameters initialization
    search.params = selectedService.searchState || searchParamsFactory.createDefault();
    search.params.userId = ( selectedService.searchState && selectedService.searchState.userId ) ? selectedService.searchState.userId : search.campaigns[0][1];
    // this.params.userId = angular.element( document.findElementById( "campaign" ) ).find( "option" ).first().val();
    isLoading = false;
    
    /*
     * Need to make sure the aff status param isn't automatically on for this
     */
    if ( !bootstrap.isSignedIn() ) {
      search.params.affiliatableOnly = false;
    }
  })
  
  
  
  /*
   * Figures out whether the current user is logged in or not
   * Reason: Aff status / Restricted info is mutually exclusive depending on login status
   */
  this.isSignedIn = function() {
    return bootstrap.isSignedIn();
  }


    
  //Information needed for the search button display logic
  var lastSearch = "";
  
  /*
   * Kicks off the search process by sending the result service a copy of the current search state
   */
  this.search = function() {
    lastSearch = this.params.hash({ includeOptional: true, includeUserId: this.isSignedIn() });
    
    merchantResultsService.makeInitialCall( angular.copy( this.params ) );
  }
  
  /*
   * Whether or not we should disable the search button
   * Returns a boolean
   */
  this.isSearchable = function() {
    if ( isLoading ) {
      return false;
    }
    
    var input = this.params,
        hashedDefault = searchParamsFactory.createDefault().hash({ includeOptional: false, includeUserId: false }),
        hashedCurrentNoUser = this.params.hash({ includeOptional: false, includeUserId: false }),
        hashedCurrentAllParams = this.params.hash({ includeOptional: true, includeUserId: this.isSignedIn() });
        
        
    return ( ( hashedCurrentAllParams !== lastSearch ) && ( hashedCurrentNoUser !== hashedDefault ) );
  }
  
}]);