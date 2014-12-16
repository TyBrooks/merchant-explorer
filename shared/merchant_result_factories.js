var app = angular.module('merchantExplorer');

app.factory('searchCacheFactory', function() {
  var factory = {};
  
  factory.create = function() {
    //The actual data store -- initialized with empty search data
    var searchMetaData = {
      "": {
        ids: [],
        numLoaded: 0
      }
    };
    
    return {
      _ensureExists: function( searchName ) {
        if ( !searchMetaData[searchName] ) {
          searchMetaData[searchName] = { ids: [], numLoaded: 0 };
        }
      },
      
      _ensureFilter: function( searchName, filterName ) {
        this._ensureExists( searchName );
          
        if ( !searchMetaData[ searchName ][ "filters" ] ) {
          searchMetaData[ searchName ][ "filters" ] = {};
        }
        
        if ( !searchMetaData[ searchName ][ "filters" ][ filterName ] ) {
          searchMetaData[ searchName ][ "filters" ][ filterName ] = {
            ids: []
          };
        }
        
      },
      
      addToNumLoaded: function( numToAdd, searchName ) {
        this._ensureExists( searchName );
        searchMetaData[searchName].numLoaded += numToAdd;
      },
      
      getIds: function( startPos, endPos, searchName, filterName ) {
        this._ensureExists( searchName );
        
        if ( filterName ) {
          return searchMetaData[ searchName ][ "filters" ][ filterName ].ids.slice( startPos, endPos );
        } else {
          return searchMetaData[searchName].ids.slice( startPos, endPos );
        }
        
      },
      
      getAllLoadedIds: function( searchName ) {
        var numLoaded = this.getNumLoaded( searchName );
        return this.getIds( 0, numLoaded, searchName );
      },
      
      getNumLoaded: function( searchName ) {
        this._ensureExists( searchName );
        return searchMetaData[searchName].numLoaded;
      },
      
      getNumIds: function( searchName ) {
        this._ensureExists( searchName );
        return searchMetaData[searchName].ids.length;
      },
      
      initializeIds: function( ids, searchName ) {
        this._ensureExists( searchName );
        
        //TODO currently this only sets the data if it doens't exist. Change this?
        if ( searchMetaData[searchName].ids.length === 0 ) {
          searchMetaData[searchName].ids = ids;
        }
      },
      
      setFilteredIds: function( ids, searchName, filterName ) {
        this._ensureFilter( searchName, filterName );
        
        //TODO, keep track of how many we've done so far, instead of doing this every time.
        searchMetaData[ searchName ][ "filters" ][ filterName ][ "ids" ] = ids;

      }
    }
    
  }
  return factory;
})

app.factory('merchantCacheFactory', function() {
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
          var toReturn = [];
          
          input.forEach( function( id ) {
            if ( dataCache[id] ) {
              toReturn.push( dataCache[id] );
            }
          });
          return toReturn;
        } else {
          return dataCache[input];
        }
      }
      
    }
  }
  
  return factory;
  
} );