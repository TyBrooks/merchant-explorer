var app = angular.module('merchantExplorer');

//TODO get page logic out of here!!!
//TODO pending promise cancel

app.service('merchantResultService', ["merchantApi", "merchantResultModel", "hashedSearchParamsFactory", "config", function( api, results, hashedParamsFactory, config ) {
  
      // Constants loaded from config
  var batchSize = config.lookup( 'batchSize' ),
      minBuffer = config.lookup( 'minBuffer' ),
      perPage = config.lookup( 'perPage' )
    
      // A pointer in case we need to cancel a pending call
      pendingPromise = null,
    
      // Store data about the filters and params of the current search
      currentSearch = "",
      currentFilter = "",
      
      // Slightly hacky vars that should probably eventually be refactored out. :-(
      numCached = 0, //needed as workaround to scope issue w/ async function
      isNewSearch = false; // Needed to pass info about button press to the results controller from search controller
      
  
  this.makeInitialCall = function( searchParams, filterInfo ) {
    isNewSearch = true;
      
    // results.setCurrentFilterParams( filterInfo );
    this.setCurrentSearchParams( searchParams );
    api.getIds( searchParams ).then( angular.bind( this, handleInitialCall ) );
  }
  
  function handleInitialCall( ids ) {
    results.setIds( ids, currentSearch );
    
    this.batchCall();
  }
  
  this.batchCall = function() {
    var nextIds = results.getNextIds( batchSize, currentSearch ),
        toFetch = results.filterCachedIds( nextIds );
  
    numCached = nextIds.length - toFetch.length;
    
    //TODO check cache in results first
    pendingPromise = api.getMerchantData( toFetch );
    pendingPromise.then( angular.bind( this, this.handleBatchCall ) );
  }
  
  this.handleBatchCall = function ( merchantData ) {
    results.addResults( merchantData, numCached, currentSearch );
    numCached = 0;
    pendingPromise = null;
  }
  
  //Main Data retrieval method
  this.getCurrentPageData = function( pageNum ) {
    var startPos = ( pageNum - 1 ) * perPage,
        endPos = pageNum * perPage;
    
    this.checkBuffer( pageNum );

    var returned = results.getDataForIdRange( startPos, endPos, currentSearch );
    
    if ( returned.length < perPage ) {
      return returned.concat( this.getBlankResults().slice(0, perPage - returned.length) );
    } else {
      return returned;
    }
  }
  
  this.getTotalPages = function( perPage ) {
    return Math.ceil( results.getNumIds( currentSearch ) / perPage );
  }
  
  this.getBlankResults = ( function() {
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
    var totalLoaded = results.getTotalCalls( currentSearch ),
        needed = pageNum * perPage,
        stillToLoad = results.getNumNotLoaded( currentSearch );
    
    return (totalLoaded < needed && stillToLoad > 0)
  }
  
  this.checkBuffer = function( pageNum ) {
    if ( pendingPromise ) {
      // console.log('BUFFER CHECK passed: promise pending');
      return;
    }

    var buffer = results.getNumPreloaded( pageNum, perPage, currentSearch );
    
    if ( buffer < minBuffer && results.getNumNotLoaded( currentSearch ) > 0 ) {
      this.batchCall();
    }
  }
  
  this.hashSearchParams = function ( params ) {
    //TODO do this
    return hashedParamsFactory.create( params );
  }
  
  this.isNewSearch = function() {
    if ( isNewSearch ) {
      isNewSearch = false;
      return true;
    } else {
      return false;
    }
  }
  
  this.setCurrentSearchParams = function( searchParams ) {
    var hashed = this.hashSearchParams( searchParams );
    
    currentSearch = hashed;
  }
  
}])