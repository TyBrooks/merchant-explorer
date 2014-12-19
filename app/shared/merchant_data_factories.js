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
            ids: [],
            lastNumLoaded: 0
          };
        }
        
      },
      
      addToNumLoaded: function( numToAdd, searchName ) {
        this._ensureExists( searchName );
        
        searchMetaData[searchName].numLoaded += numToAdd;
      },
      
      getIds: function( startPos, endPos, searchName ) {
        this._ensureExists( searchName );
        
        return searchMetaData[searchName].ids.slice( startPos, endPos );
      },
      
      getFilteredIds: function( startPos, endPos, searchName, filterName ) {
        this._ensureFilter( searchName, filterName );

        return searchMetaData[ searchName ][ "filters" ][ filterName ].ids.slice( startPos, endPos );
      },
      
      getNotYetFilteredIds: function( searchName, filterName ) {
        this._ensureFilter( searchName, filterName );
        
        var lastNumLoaded = searchMetaData[ searchName ]["filters"][filterName].lastNumLoaded,
          newNumLoaded = searchMetaData[ searchName ].numLoaded;
      
        return this.getIds( lastNumLoaded, newNumLoaded, searchName );
      },
      
      getNumLoaded: function( searchName ) {
        this._ensureExists( searchName );
        
        return searchMetaData[searchName].numLoaded;
      },
      
      getNumFilteredLoaded: function( searchName, filterName ) {
        this._ensureFilter( searchName, filterName);

        return searchMetaData[ searchName ][ "filters" ][ filterName ].ids.length
      },
      
      getNumIds: function( searchName ) {
        this._ensureExists( searchName );
        return searchMetaData[searchName].ids.length;
      },
      
      initializeIds: function( ids, searchName ) {
        this._ensureExists( searchName );
        
        searchMetaData[ searchName ].ids = ids;
      },
      
      addFilteredIds: function( newIds, searchName, filterName ) {
        this._ensureFilter( searchName, filterName );
        
        var newIdArr = searchMetaData[ searchName][ "filters" ][ filterName ].ids.concat( newIds );
         
        searchMetaData[ searchName ][ "filters" ][ filterName ].ids = newIdArr;
      }
    }
    
  }
  return factory;
})


/*
 * A data structure designed to hold merchant data
 *
 * Format:  { <userId> : { <merchantId> : <merchantDataObj> } }
 * This allows caching by userId
 * userId 0 === when user isn't signed in
 * TODO cache data separate from aff status (which is the only thing that depends on userId)
 */
app.factory('merchantCacheFactory', function() {
  var dataCache = { 0: {} },
      factory = {};
  
  
  factory.create = function() {
    return {
      /*
       * Adds data to the dataCache
       *  If input is object, adds to cache using object's id
       *  If input is array, loops through array and calls itself recursively for each item
       */
      add: function( input, userId ) {
        var I = this,
            userId = this._userIdOrGeneric( userId );
            
        if ( angular.isArray( input ) ) {
          input.forEach( function( dataObj ) {
            I.add( dataObj, userId );
          } );
        } else if ( angular.isObject( input ) ) {
            dataCache[ userId ][ input.id ] = input;
        }
      },
      
      /*
       * Returns a boolean depending on whether the id exists
       */
      doesExist: function( merchantId, userId ) {
        var userId = this._userIdOrGeneric( userId );
        return !!dataCache[ userId ][ merchantId ];
      },
      
      /*
       * Given an array of ids, return all ids that aren't in the cache
       */
      removeCachedIds: function( merchantIds, userId ) {
        var I = this;
        
        return merchantIds.filter( function( merchantId ) {
          return !I.doesExist( merchantId, userId );
        })
      },
      
      /* 
       * Returns information for an id or ids
       *   If input is an array, returns an array of merchant objects
       *   If input is a number returns a single object
       */
      lookup: function( input, userId ) {
        var I = this;
        
        if ( angular.isArray( input ) ) {
          var toReturn = [];
          
          _.each( input, function( merchantId ) {
            if ( I.doesExist( merchantId, userId ) ) {
              toReturn.push( I.lookup( merchantId, userId ) )
            }
          });
          
          return toReturn;
          
        } else {
          var userId = this._userIdOrGeneric( userId );
          
          return dataCache[ userId ][ input ];
        }
      },
      
      /*
       * A helper function that ensures userId is set correctly
       * ... even if it's not passed to the function ( in which case we use generic, non-logged in value )
       */
      _userIdOrGeneric: function( userId ) {
        if ( angular.isDefined( userId ) ) {
          this._ensureExists( userId );
          return userId;
        } else {
          return 0;
        }
      },
      
      _ensureExists: function( userId ) {
        if ( !angular.isDefined( dataCache[ userId ] ) ) {
          dataCache[ userId ] = {};
        }
      }
      
    }
  }
  
  return factory;
  
} );