var app = angular.module('merchantExplorer');

//TODO get page logic out of here!!!
//TODO pending promise cancel
//TODO search state here or in model?

app.service('merchantResultService', ["merchantApi", "merchantResultModel", "hashedSearchParamsFactory", "config", function( api, results, hashedParamsFactory, config ) {
  
  var batchSize = config.lookup( 'batchSize' ),
      minBuffer = config.lookup( 'minBuffer' ),
      perPage = config.lookup( 'perPage' ),
      pendingPromise = null,
      page = 1,
      isNewSearch = false,
      numCached = 0; // A little hacky, using top level var for async callback
  
  this.makeInitialCall = function( searchParams, filterInfo ) {
    isNewSearch = true;
      
    //TODO probably store this logic here instead
    results.setCurrentFilterParams( filterInfo );
    results.setCurrentSearchParams( this.hashSearchParams( searchParams ) );
    api.getIds( searchParams ).then( angular.bind( this, handleInitialCall ) );
  }
  
  function handleInitialCall( ids ) {
    results.setIds( ids );
    
    //TODO check if you have enough
    this.batchCall();
  }
  
  this.batchCall = function() {
    var nextIds = results.getNextIds( batchSize ),
        toFetch = results.filterCachedIds( nextIds );
    
    numCached = nextIds.length - toFetch.length;
    
    //TODO check cache in results first
    pendingPromise = api.getMerchantData( toFetch );
    pendingPromise.then( angular.bind( this, this.handleBatchCall ) );
  }
  
  this.handleBatchCall = function ( merchantData ) {
    results.addResults( merchantData, numCached );
    numCached = 0;
    pendingPromise = null;
    //TODO check buffer...
    this.checkBuffer();
  }
  
  //Main Data retrieval method
  this.getCurrentPageData = function( pageNum ) {
    var startPos = ( pageNum - 1 ) * perPage,
        endPos = pageNum * perPage;
    
    page = pageNum;
    
    this.checkBuffer( pageNum );
    
    var returned = results.getDataForIdRange( startPos, endPos );
    
    if ( returned.length < perPage ) {
      return returned.concat( this.getBlankResults().slice(0, perPage - returned.length) );
    } else {
      return returned;
    }
  }
  
  this.getTotalPages = function( perPage ) {
    return Math.ceil( results.getNumIds() / perPage );
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
    var totalLoaded = results.getTotalCalls(),
        needed = pageNum * perPage,
        stillToLoad = results.getNumNotLoaded();
    
    return (totalLoaded < needed && stillToLoad > 0)
  }
  
  this.checkBuffer = function( pageNum ) {
    if ( pendingPromise ) {
      // console.log('BUFFER CHECK passed: promise pending');
      return;
    }
    
    if ( !pageNum ) {
      var pageNum = page;
    }

    var buffer = results.getNumPreloaded( pageNum, perPage );
    
    if ( buffer < minBuffer && results.getNumNotLoaded() > 0 ) {
      this.batchCall();
    } else {
      // console.log("BUFFER CHECK passed: buffer sufficient OR results already loaded")
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
  
}])