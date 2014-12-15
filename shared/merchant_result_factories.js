var app = angular.module('merchantExplorer');

app.factory('searchInfoFactory', function() {
  var factory = {};
  
  factory.create = function() {
    
  }
})

app.factory('dataCacheEntryFactory', function() {
  var dataCache = {};
  
  return {
    /* 
     * Returns an object for a given id
     */
    lookup: function( id ) {
      return dataCache[id];
    },
    
    /*
     * Returns a boolean depending on whether the id exists
     */
    doesExist: function( id ) {
      if ( dataCache[id] ) {
        return true;
      } else {
        return false;
      }
    },
    
    /*
     * Adds data to the dataCache
     *  If input is object, adds to cache using object's id
     *  If input is array, loops through array and calls itself recursively for each item
     */
    add: function( results ) {
      if ( angular.isObject( results ) ) {
        dataCache[results.id] = results;
      } else if ( angular.isArray( results) ) {
        results.forEach( function( dataObj ) {
          this.add( dataObj );
        }
      }
    }
    
  }
}