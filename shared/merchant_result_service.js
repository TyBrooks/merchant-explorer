var app = angular.module('merchantExplorer');

//TODO get page logic out of here!!!

app.service('merchantResultService', ["merchantApi", "merchantResultModel", 'config', function(api, results, config) {
  
  var batchSize = config.lookup('batchSize'),
      minBuffer = config.lookup('minBuffer'),
      perPage = config.lookup('perPage'),
      pendingPromise = null,
      page = 1;
  
  this.makeInitialCall = function(searchParams) {
    //TODO decide whether to clear the results at click time, or api time.
    // probably click time with a loading screen
    results.clear();
    results.setCurrentSearchParams( this.hashSearchParams( searchParams ) );
    api.getIds(searchParams).then( angular.bind( this, handleInitialCall ) );
  }
  
  function handleInitialCall(ids) {
    results.setIds(ids);
    
    //TODO check if you have enough
    this.batchCall();
  }
  
  this.batchCall = function() {
    var nextIds = results.getNextIds(batchSize);
    
    //TODO check cache in results first
    pendingPromise = api.getMerchantData(nextIds);
    pendingPromise.then( angular.bind( this, this.handleBatchCall ) );
  }
  
  this.handleBatchCall = function (merchantData) {
    results.addResults(merchantData);
    pendingPromise = null;
    //TODO check buffer...
    this.checkBuffer();
  }
  
  //Main Data retrieval method
  this.getCurrentPageData = function(pageNum) {
    var startPos = (pageNum - 1) * perPage,
        endPos = pageNum * perPage;
    
    page = pageNum;
    
    this.checkBuffer(pageNum);
    
    var returned = results.getDataForIdRange(startPos, endPos);
    
    if ( returned.length < perPage ) {
      return returned.concat( this.getBlankResults().slice(0, perPage - returned.length) );
    } else {
      return returned;
    }
  }
  
  this.getTotalPages = function(perPage) {
    return Math.ceil(results.getNumIds() / perPage);
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
  
  this.isLoading = function(pageNum) {
    var totalLoaded = results.getTotalCalls(),
        needed = pageNum * perPage,
        stillToLoad = results.getNumNotLoaded();
    
    return (totalLoaded < needed && stillToLoad > 0)
  }
  
  this.checkBuffer = function(pageNum) {
    if (pendingPromise) {
      // console.log('BUFFER CHECK passed: promise pending');
      return;
    }
    
    if (!pageNum) {
      var pageNum = page;
    }

    var buffer = results.getNumPreloaded(pageNum, perPage);
    
    if ( buffer < minBuffer && results.getNumNotLoaded() > 0 ) {
      var nextIds = results.getNextIds(batchSize);
      //Check if a batch call is in process, if not make one.
      pendingPromise = api.getMerchantData(nextIds)
      pendingPromise.then( angular.bind( this, this.handleBatchCall ) );
    } else {
      // console.log("BUFFER CHECK passed: buffer sufficient OR results already loaded")
    }
  }
  
  this.hashSearchParams = function ( params ) {
    //TODO do this
    return String( Math.floor( Math.random( 10 ) ) );
  }
  
}])