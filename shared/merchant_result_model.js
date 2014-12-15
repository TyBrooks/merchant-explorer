var app = angular.module('merchantExplorer');

//TODO make the data stores themselves private

app.service('merchantResultModel', function() {
  var model = this;
  
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

  //Main Data retrieval method
  this.getDataForIdRange = function( startPos, endPos, currentSearch ) {
    var idList = this.searchInfo[currentSearch]["ids"].slice( startPos, endPos );

    return idList.map( function( id ) {
      return model.dataCache[id];
    });
  }
  
  // Other getter/setter methods
  
  this.getTotalCalls = function( currentSearch ) {
    return this.searchInfo[currentSearch]["totalCalls"];
  }
  
  this.getNumIds = function( currentSearch ) {
    return this.searchInfo[currentSearch]["ids"].length;
  }
  
  this.getNextIds = function( num, currentSearch ) {
    var searchInfo = this.searchInfo[currentSearch],
        totalCalls = searchInfo["totalCalls"];
    
    return searchInfo["ids"].slice(totalCalls, totalCalls + num);
  }
  
  this.filterCachedIds = function( ids ) {
    return ids.filter( function( id ) {
      return !model.dataCache[id];
    } )
  }
  
  this.ensureSearchExists = function( currentSearch ) {
    if ( !this.searchInfo[currentSearch] || this.searchInfo[currentSearch]["ids"].length === 0 ) {
       this.searchInfo[currentSearch] = { ids: [], totalCalls: 0 }
    }
  }
  
  //Create a new info hash in the searchInfo object if only the default one exists
  // otherwise use existing for caching effect
  this.setIds = function( ids, currentSearch ) {
    if ( this.searchInfo[currentSearch]["ids"].length === 0 ) {
      var initialInfo = {
        ids: ids,
        totalCalls: 0
      }
      
      this.searchInfo[currentSearch] = initialInfo;
    }
  }
  
  this.addResults = function( merchantResults, numCached, currentSearch ) {
    merchantResults.forEach( function( result ) {
      //TODO make sure we get id with results
      model.dataCache[result.id] = result;
    } );
    //Update the current search index
    this.searchInfo[currentSearch]["totalCalls"] += ( merchantResults.length + numCached);
  }

  // Methods to get meta search data
  
  // number of merchants loaded but after the currently viewed page
  //TODO replace with generic info... resultService handles all page calculations!
  this.getNumPreloaded = function( pageNum, perPage, currentSearch ) {
    return Math.max( this.searchInfo[currentSearch]["totalCalls"] - (pageNum * perPage), 0 )
  }
  
  // number of remaining merchants that haven't been loaded yet.
  this.getNumNotLoaded = function( currentSearch ) {
    var searchInfo = this.searchInfo[currentSearch];
    return searchInfo["ids"].length - searchInfo["totalCalls"];
  }
  
})