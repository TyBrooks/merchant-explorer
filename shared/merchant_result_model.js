var app = angular.module('merchantExplorer');

app.service('merchantResultModel', function() {
  function hashSearchParams(params) {
    //TODO do this
    return String(Math.floor(Math.random(10)));
  }
  
  /*
   *  Data storage
   *  ------------
   *
   *  searchInfo:
   *  {
   *    <hashedSearchParam> : {
   *      ids: [<id>, <id>, ...],
   *      totalCalls: <#>
   *    }, ...
   *  }
   *
   *  dataCache = { <id> : <dataObj>, ... }
   *
   */
  this.searchInfo = {};
  this.dataCache = {};
  //initialize results for when no query exists
  this.searchInfo[""] = { ids: [], totalCalls: 0 }
  
  //Other storage
  this.currentSearch = ""; //hash of the current search

  //Main Data retrieval method
  this.getDataForIdRange = function(startPos, endPos) {
    var results = [],
        model = this,
        idList = this.searchInfo[this.currentSearch]["ids"].slice( startPos, endPos );

    idList.forEach( function( id ) {
      if ( model.dataCache[id] ) {
        results.push( model.dataCache[id] );
      }
    });
    
    return results;
  }
  
  // Other getter/setter methods
  
  this.getTotalCalls = function() {
    this.searchInfo[this.currentSearch]["totalCalls"];
  }
  
  this.getNextIds = function(num) {
    var searchInfo = this.searchInfo[this.currentSearch],
        totalCalls = searchInfo["totalCalls"];
    
    return searchInfo["ids"].slice(totalCalls, totalCalls + num);
  }
  
  this.setCurrentSearchParams = function(queryParams) {
    this.currentSearch = hashSearchParams(queryParams);
    this.searchInfo[this.currentSearch] = { ids: [], totalCalls: 0 }
  }
  
  //Create a new info hash in the searchInfo object if only the default one exists
  // otherwise use existing for caching effect
  this.setIds = function(ids) {
    if ( this.searchInfo[this.currentSearch]["ids"].length === 0 ) {
      var initialInfo = {
        ids: ids,
        totalCalls: 0
      }
      
      this.searchInfo[this.currentSearch] = initialInfo;
    }
  }
  
  this.addResults = function(merchantResults) {
    var model = this;
    
    merchantResults.forEach( function( result ) {
      //TODO make sure we get id with results
      model.dataCache[result.id] = result;
    } );
    
    //Update the current search index
    this.searchInfo[this.currentSearch]["totalCalls"] += merchantResults.length;
  }
  
  this.clear = function() {
    this.currentSearch = "";
  }
  
  // Methods to get meta search data
  
  // number of merchants loaded but after the currently viewed page
  this.getNumPreloaded = function(pageNum, perPage) {
    return Math.ceil( this.searchInfo[this.currentSearch]["totalCalls"] - (pageNum * perPage), 0 )
  }
  
  // number of remaining merchants that haven't been loaded yet.
  this.getNumNotLoaded = function() {
    var searchInfo = this.searchInfo[this.currentSearch];
    return searchInfo["ids"].length - searchInfo["totalCalls"];
  }
  
})