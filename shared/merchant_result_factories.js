var app = angular.module('merchantExplorer');

app.factory('searchInfoFactory', function() {
  var factory = {};
  
  factory.create = function() {
    
  }
})

app.factory('dataCacheFactory', function() {
  var dataCache = {},
      factory = {};
  
  
  factory.create = function() {
    return {
      /*
       * Adds data to the dataCache
       *  If input is object, adds to cache using object's id
       *  If input is array, loops through array and calls itself recursively for each item
       */
      add: function( input ) {
        var cache = this;
        
        if ( angular.isArray( input ) ) {
          input.forEach( function( dataObj ) {
            cache.add( dataObj );
          } );
        } else if ( angular.isObject( input ) ) {
          dataCache[input.id] = input;
        }
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
       * Given an array of ids, return all ids that aren't in the cache
       */
      filterExisting: function( ids ) {
        var cache = this;
        
        return ids.filter( function( id ) {
          return !cache.doesExist( id );
        })
      },
      
      /* 
       * Returns information for an id or ids
       *   If input is an array, returns an array of merchant objects
       *   If input is a number ( or is it string? ) returns a single object
       */
      lookup: function( input ) {
        var cache = this;
        if ( angular.isArray( input ) ) {
          return input.map( function( id ) {
            return cache.lookup( id );
          })
        } else {
          return dataCache[input];
        }
      }
      
    }
  }
  
  return factory;
  
} );