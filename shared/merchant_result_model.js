var app = angular.module('merchantExplorer');

app.service('merchantResultModel', function() {
  function hashSearchParams(params) {
    //TODO do this
    return Math.floor(Math.random(10));
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
  
  //Other storage
  this.currentSearch = null; //hash of the current search
  
  this.getCurrentPageData = function(pageNum, perPage) {
    
  }
  
  // Methods to get meta search data
  
  this.getNumPreloaded = function(pageNum, perPage) {
    return searchInfo[currentSearch]["totalCalls"] - (pageNum * perPage)
  }
  
  this.getNumNotLoaded = function() {
    var searchInfo = searchInfo[currentSearch];
    return searchInfo["ids"].length - searchInfo["totalCalls"];
  }
  
})