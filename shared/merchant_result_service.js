var app = angular.module('merchantExplorer');

//TODO get page logic out of here!!!
//TODO pending promise cancel

app.service('merchantResultService',
  ["merchantApi", "merchantResultModel", "hashedSearchParamsFactory", "filterInfoFactory", "config",
  function( api, results, hashedParamsFactory, filterInfoFactory, config ) {
  
      // Constants loaded from config
  var batchSize = config.lookup( 'batchSize' ),
      minBuffer = config.lookup( 'minBuffer' ),
      perPage = config.lookup( 'perPage' ),
    
      service = this;
    
      // A pointer in case we need to cancel a pending call
      pendingPromise = null,
    
      // Store data about the filters and params of the current search
      currentSearch = "",
      currentFilterInfo = null,
      
      // Slightly hacky vars that should probably eventually be refactored out. :-(
      numCached = 0, //needed as workaround to scope issue w/ async function
      isNewSearch = false; // Needed to pass info about button press to the results controller from search controller
      
  
  this.makeInitialCall = function( searchParams, searchName, filterInfo ) {
    
    isNewSearch = true;
    currentSearch = searchName;
    currentFilterInfo = filterInfo;
    
    api.getIds( searchParams ).then( angular.bind( this, handleInitialCall ) );
  }
  
  function handleInitialCall( ids ) {
    results.setIds( ids, currentSearch );
    
    batchCall();
  }
  
  function batchCall() {
    var nextIds = results.getNextIds( batchSize, currentSearch ),
        toFetch = results.filterCachedIds( nextIds );
    
    numCached = nextIds.length - toFetch.length;
    
    //TODO check cache in results first
    pendingPromise = api.getMerchantData( toFetch );
    pendingPromise.then( handleBatchCall );
  }
  
  function handleBatchCall( merchantData ) {
    results.addResults( merchantData, numCached, currentSearch );
    numCached = 0;
    pendingPromise = null;
  }
  
  //Main Data retrieval method
  this.getCurrentPageData = function( pageNum ) {
    if ( this.isLoading( pageNum ) ) {
      return getBlankResults();
    }
    
    var startPos = ( pageNum - 1 ) * perPage,
        endPos = pageNum * perPage;
    
    checkBuffer( pageNum );

    var returned = results.getDataForIdRange( startPos, endPos, currentSearch, currentFilterInfo );
    
    if ( returned.length < perPage ) {
      return returned.concat( getBlankResults().slice(0, perPage - returned.length) );
    } else {
      return returned;
    }
  }
  
  this.getTotalPages = function( perPage ) {
    //TODO this is where I left off
    if ( currentFilterInfo.hasAnyFilters() ) {
      // return results.
    }
    
    return Math.ceil( results.getNumIds( currentSearch ) / perPage );
  }
  
  var getBlankResults = ( function() {
    //TODO fix this
    var results = []
    for ( var i = 0; i < 10; i++ ) {
      results.push({
        name: " ",
        id: " ",
        domain: " ",
        country: " ",
        cpc: " ",
        aff_status: " ",
        commission: " "
      })
    }
    return function() {
      return results;
    }
  } )();
  
  this.isLoading = function( pageNum ) {
    var totalLoaded = results.getTotalCalls( currentSearch, currentFilterInfo ),
        needed = pageNum * perPage,
        stillToLoad = results.getNumNotLoaded( currentSearch );
    
    return (totalLoaded < needed && stillToLoad > 0)
  }
  
  function checkBuffer( pageNum ) {
    if ( pendingPromise ) {
      // console.log('BUFFER CHECK passed: promise pending');
      return;
    }

    var buffer = results.getNumPreloaded( pageNum, perPage, currentSearch, currentFilterInfo );
    
    if ( buffer < minBuffer && results.getNumNotLoaded( currentSearch ) > 0 ) {
      batchCall();
    }
  }
  
  this.isNewSearch = function() {
    if ( isNewSearch ) {
      isNewSearch = false;
      return true;
    } else {
      return false;
    }
  }
  
  
}])