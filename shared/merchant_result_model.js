var app = angular.module('merchantExplorer');

//TODO make the data stores themselves private

app.service('merchantResultModel', ["merchantCacheFactory", "searchCacheFactory", function( merchantCacheFactory, searchCacheFactory ) {
  var model = this;

  // The data storage models
  var searchCache = searchCacheFactory.create(),
      merchantCache = merchantCacheFactory.create();

  //Main Data retrieval method
  this.getDataForIdRange = function( startPos, endPos, currentSearch ) {
    var idList = searchCache.getIds( startPos, endPos, currentSearch );
    return merchantCache.lookup( idList );
  }
  
  // Other getter/setter methods
  
  this.getTotalCalls = function( currentSearch ) {
    return searchCache.getNumLoaded( currentSearch );
  }
  
  this.getNumIds = function( currentSearch ) {
    return searchCache.getNumIds( currentSearch );
  }
  
  this.getNextIds = function( numIds, currentSearch ) {
    var numLoaded = searchCache.getNumLoaded( currentSearch );
    return searchCache.getIds( numLoaded, numLoaded + numIds, currentSearch );
  }
  
  this.filterCachedIds = function( ids ) {
    return merchantCache.filterExisting( ids );
  }
  
  //Create a new info hash in the searchInfo object if only the default one exists
  // otherwise use existing for caching effect
  this.setIds = function( ids, currentSearch ) {
    searchCache.initializeIds( ids, currentSearch );
  }
  
  this.addResults = function( merchantResults, numCached, currentSearch ) {
    merchantCache.add( merchantResults );
    
    var additionalLoaded = merchantResults.length + numCached;
    //Update the current search index
    searchCache.addToNumLoaded( additionalLoaded, currentSearch );
  }

  // Methods to get meta search data
  
  // number of merchants loaded but after the currently viewed page
  //TODO replace with generic info... resultService handles all page calculations!
  this.getNumPreloaded = function( pageNum, perPage, currentSearch ) {
    var numLoaded = searchCache.getNumLoaded( currentSearch ),
        numAlreadyDisplayed = pageNum * perPage;
    
    return Math.max( numLoaded - numAlreadyDisplayed, 0 );
  }
  
  // number of remaining merchants that haven't been loaded yet.
  this.getNumNotLoaded = function( currentSearch ) {
    var numIds = searchCache.getNumIds( currentSearch ),
        numLoaded = searchCache.getNumLoaded( currentSearch );
    
    return numIds - numLoaded;
  }
  
}])