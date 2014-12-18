/*
 * Responsibilities
 * -----
 *
 * 1. Handle all communication between the Merchant Data cache and the Search Info cache
 * 2. Provide an API the results service can use to fetch data while abstracting away details
 * 3. Handle filter logic
 *
 */


var app = angular.module('merchantExplorer');

//TODO make the data stores themselves private

app.service('merchantResultModel', ["merchantCacheFactory", "searchCacheFactory", function( merchantCacheFactory, searchCacheFactory ) {
  var model = this;

  /*
   * Data storage models
   * Look in merchant_result_factories.js for more details
   */
  var searchCache = searchCacheFactory.create(),
      merchantCache = merchantCacheFactory.create();

  /*
   * The main data retrieval method
   * Retrieves either a range of ids for a given search
   * OR a range of filtered ids, if the optional filter object is present
   */
  this.getDataForIdRange = function( startPos, endPos, searchName, filterState ) {
    var idList;
    if ( filterState && filterState.hasAnyFilters() ) {
      idList = searchCache.getFilteredIds( startPos, endPos, searchName, filterState.hash() );
    } else {
      idList = searchCache.getIds( startPos, endPos, searchName );
    }
    
    return merchantCache.lookup( idList );
  }
  
  /*
   * A method for determining the number of ids that have currently been loaded
   * If the filterState obj is present, returns number of loaded filtered Ids
   */
  this.getNumIdsLoaded = function( currentSearch, filterState ) {
    if ( filterState && filterState.hasAnyFilters() ) {
      return searchCache.getNumFilteredLoaded( currentSearch, filterState.hash() );
    } else {
      return searchCache.getNumLoaded( currentSearch );
    }
  }
  
  /*
   * A method for determining the number of ids still to load
   * Note - this shouldn't be affected by any filters
   */
  this.getNumIdsNotLoaded = function( currentSearch ) {
    var numIds = searchCache.getNumIds( currentSearch ),
        numLoaded = searchCache.getNumLoaded( currentSearch );
  
    return numIds - numLoaded;
  }
  
  /* 
   * A method to get the total number of ids
   *   If a filter is passed, this will be the number of filtered ids + ALL unloaded ids (don't know their status)
   */
  this.getTotalIdCount = function( currentSearch, filterState ) {
    if ( filterState && filterState.hasAnyFilters() ) {
      return searchCache.getNumFilteredLoaded( currentSearch, filterState.hash() ) + this.getNumNotLoaded( currentSearch );
    } else {
      return searchCache.getNumIds( currentSearch );
    }
  }
  
  /* 
   * A method to get the next set of Ids to load
   */
  this.getNextIdsForBatch = function( numIds, currentSearch ) {
    var numLoaded = searchCache.getNumLoaded( currentSearch );
    return searchCache.getIds( numLoaded, numLoaded + numIds, currentSearch );
  }
  
  /*
   * This takes an array of ids, and removes any that we already have data for
   */
  this.removeCachedIds = function( ids ) {
    return merchantCache.removeCachedIds( ids );
  }
  
  
  /*
   * This one sets the ids for a given search
   */
  this.initializeIdsForSearch = function( ids, currentSearch ) {
    searchCache.initializeIds( ids, currentSearch );
  }
  
  /*
   * This one takes the results of an api call to grab merchant data
   * .. and updates both the merchant data cache and the search metadata cache
   */
  this.addResults = function( merchantResults, numCached, searchName, filterState ) {
    merchantCache.add( merchantResults );
    
    var additionalLoaded = merchantResults.length + numCached;
    searchCache.addToNumLoaded( additionalLoaded, searchName );
    
    if ( filterState && filterState.hasAnyFilters() ) {
      var previousIdx = searchCache.getNumLoaded( searchName ) - additionalLoaded;
      var addedIds = searchCache.getIds( previousIdx, previousIdx + additionalLoaded, searchName );
      var merchantData = merchantCache.lookup( addedIds );
      var filteredIds = filterState.getFilteredIdsFromData( merchantData );

      searchCache.addFilteredIds( filteredIds, searchName, filterState.hash() );
    }
  }
  
}])