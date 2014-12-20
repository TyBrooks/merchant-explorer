/* 
 * Responsibilities
 * ----
 *
 * 1. Mediate interaction between Data layer and API layer
 * 2. Mediate interaction between the Search and Results controllers.
 * 3. Convert page logic from results ctrl into raw numbers for the data side
 * 4. Store info on state of current search/ filters
 * 5. Provide an API that the results controller can interact with to retrieve info necessary for display logic
 *
 */

var app = angular.module('merchantExplorer');

//TODO pending promise cancel

app.service('merchantResultsService',
  ["merchantApi", "merchantDataService", "config",
  function( api, dataService, config ) {
  
  /*
   * All the variables / state info for the service
   */
  var // Constants loaded from config
      batchSize = config.lookup( 'batchSize' ),
      minBuffer = config.lookup( 'minBuffer' ),
      perPage = config.lookup( 'perPage' ),
    
      service = this;
    
      // A pointer in case we need to cancel a pending call
      pendingPromise = null,
    
      // Information about the CURRENT search and its state
      searchState = { userId: 0 },
      searchName = "",
      filterState = null,
      
      // Slightly hacky vars that should probably eventually be refactored out. :-(
      numCached = 0, //needed as workaround to scope issue w/ async function
      isNewSearch = false; // Needed to pass info about button press to the results controller from search controller
      
  /*
   * Triggered when the user clicks the search button
   *   checks to see if the given search has already been made, if not, fetches an id list via the api
   */
  this.makeInitialCall = function( searchParams ) {
    isNewSearch = true;
    searchState = searchParams;
    searchName = searchParams.hash();
    filterState = searchParams.getFilterState();
      
    if ( dataService.getNumIdsLoaded( searchName, filterState ) === 0 ) {
      var apiSearchParams = searchParams.asApiSearchParams();
      
      pendingPromise = api.searchApiCall( apiSearchParams );
      pendingPromise.then( angular.bind( this, this._handleInitialCall ) );
    }
  }
  
  /*
   * Handle the id's returned from the api and go ahead and fetch the first batch
   */
  this._handleInitialCall = function( returnedIds ) {
    dataService.initializeIdsForSearch( returnedIds, searchName );
    
    this._batchCall();
  }
  
  /*
   * Make an api call to grab the data from a batch of Ids
   */
  this._batchCall = function() {
    //TODO add an optional batch size param for initial call?
    var nextIds = dataService.getNextIdsForBatch( batchSize, searchName ),
        toFetch = dataService.removeCachedIds( nextIds, searchState.userId ),
        apiRetrieveParams = searchState.asApiRetrieveParams( toFetch );
    
    //TODO.. might be problematic if batch size is less than sent size
    numCached = nextIds.length - toFetch.length;
    
    pendingPromise = api.retrieveApiCall( apiRetrieveParams );
    pendingPromise.then( angular.bind( this, this._handleBatchCall ) );
  }
  
  /*
   * Process the merchant data returned from a batch call
   */
  this._handleBatchCall = function( merchantData ) {
    dataService.addResults( merchantData, numCached, searchName, filterState, searchState.userId );
    numCached = 0;
    pendingPromise = null;
  }
  
  /*
   * Fetches the merchant data for the given page number
   *  AND appends blank results to get the returned results up to 10
   *
   * If page is currently loading, just returns an array of blank results
   *
   * This is where the buffer is regularly checked
   */
  this.getCurrentPageData = function( pageNum ) {
    var startPos = ( pageNum - 1 ) * perPage,
        endPos = pageNum * perPage;
    
    this._checkBuffer( pageNum ); // IMPORTANT THIS COMES BEFORE THE LOADING CHECK
    
    if ( this.isLoading( pageNum ) ) {
      return getBlankResults();
    }


    var returned = dataService.getDataForIdRange( startPos, endPos, searchName, filterState, searchState.userId );
    
    if ( returned.length < perPage ) {
      return returned.concat( getBlankResults().slice(0, perPage - returned.length) );
    } else {
      return returned;
    }
  }
  
  /*
   * Get the total number of pages of results for a given search
   */
  this.getTotalPages = function() {
    //TODO see below
    if ( filterState && filterState.hasAnyFilters() ) {
      var loadedIds = dataService.getNumIdsLoaded( searchName, filterState ),
          notLoadedIds = dataService.getNumIdsNotLoaded( searchName, filterState );
      
      var ensuredPages = Math.floor( loadedIds / perPage ),
          leftover = loadedIds % perPage;
      
      var possiblePages = Math.ceil( (notLoadedIds + leftover) / perPage );
      
      //Conservative estimate
      //TODO base estimate on percentage of affiliatable so far
      var estimatedPossiblePages = Math.min( Math.ceil(possiblePages / 2), 4);
      
      // If there are addt'l to load, we need at least one more
      if ( notLoadedIds > 0 ) {
        estimatedPossiblePages = Math.max( estimatedPossiblePages, 1);
      }
      return ensuredPages + estimatedPossiblePages;
    } else {
      return Math.ceil( dataService.getTotalIdCount( searchName ) / perPage ); 
    }
  }
  
  /*
   * Returns an array of 10 blank results for display purposes
   */
  var getBlankResults = ( function() {
    //TODO fix this
    var results = []
    for ( var i = 0; i < 10; i++ ) {
      results.push({
        name: " "
      })
    }
    return function() {
      return results;
    }
  } )();
  
  /*
   * returns a boolean corresponding to whether or not the page is in the process of loading data for that page
   */
  this.isLoading = function( pageNum ) {
    var totalLoaded = dataService.getNumIdsLoaded( searchName, filterState ),
        needed = pageNum * perPage,
        stillToLoad = dataService.getNumIdsNotLoaded( searchName );
    
    
    // console.log('lading check: loaded, needed', totalLoaded, needed)
    return ( totalLoaded < needed && stillToLoad > 0 );
  }
  
  /*
   * Performs a check to see whether or not we need to prefetch additional data
   */
  this._checkBuffer = function( pageNum ) {
    if ( pendingPromise ) {
      return;
    }

    var buffer = this.getNumIdsPreLoaded( pageNum );
    
    if ( buffer < minBuffer && dataService.getNumIdsNotLoaded( searchName ) > 0 ) {
      this._batchCall();
    }
  }
  
  /*
   * A method that returns a boolean depending on whether or not we've changed searches
   * ... necessary to pass this info between the search controller and the results controller
   */ 
  this.isNewSearch = function() {
    if ( isNewSearch ) {
      isNewSearch = false;
      return true;
    } else {
      return false;
    }
  }
  
  /*
   * Returns the number of ids that have been loaded but aren't yet being displayed
   */
  this.getNumIdsPreLoaded = function( pageNum ) {
    var numLoaded = dataService.getNumIdsLoaded( searchName, filterState ),
        numAlreadyDisplayed = pageNum * perPage;
    
    return Math.max( numLoaded - numAlreadyDisplayed, 0 );
  }

  
}])