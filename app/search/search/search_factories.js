var app = angular.module('merchantExplorer')

/*
 * This factory maintains the state of the search params at the time the search button was clicked
 * It has methods for returning information about this state
 */
app.factory('searchParamsFactory', ["filterStateFactory", function( filterStateFactory ) {
  var factory = {};
  
  factory.createDefault = function() {
    return {
      /*
       * The actual params themselves, which will be set by the UI on the frontend.
       * "" and false values will be filtered
       * Default options for select dropdowns need to have these values to initialize with the option selected
       */
      keyword: "",
      industryIds: "", // Figure out these ids
      countryIds: "",
      coverage: "",
      starsOnly: false,
      unrestrictedOnly: false,
      affiliatableOnly: true,
      userId: "",
      
      /*
       * Returns a hash representation of the current search
       * Necessary for caching search metadata
       * Note: for cacheing search metadata, we want the hash without the affiliability status....
       * ... but for testing whether the search button is active, we do want to include it
       */
      hash: function( options ) {
        if ( !options ) {
          options = {};
        }
        
        var affiliatable = ( this.affiliatableOnly ) ? "1" : "0",
            unrestricted = ( this.unrestrictedOnly ) ? "1" : "0",
            insider = ( this.starsOnly ) ? "1" : "0",
            optionalInfoHash = ( options.includeOptional ) ? affiliatable + unrestricted + insider : "",
            userId = ( options.includeUserId ) ? this.userId : "";
        
        return this.keyword +
               this.industryIds +
               this.countryIds +
               this.coverage +
               optionalInfoHash +
               userId;
      },
      
      /*
       * Return an object that represents the parameters in the form that the backend needs via the API
       * ... for the initial fetch Id's request
       */
      asApiSearchParams: function( isSignedIn ) {
        var signedOutParams = ( isSignedIn ) ? {} : { unrestrictedOnly: this.unrestrictedOnly };
        
        return this._filterEmptyParams( angular.extend( {
          keyword:      this.keyword,
          industryIds:  [ this.industryIds ],
          // countryIds:   [ this.countryIds ],
          coverage:     this.coverage,
          starsOnly:    this.starsOnly
        }, signedOutParams ) );
      },
      
      /*
       * Returns object representing the filters needed for retrieving merchant data in a batch call
       */
      asApiRetrieveParams: function( ids, isSignedIn ) {
        var signedInParams = ( isSignedIn ) ? { userId: this.userId } : {};
        
        return this._filterEmptyParams(angular.extend({
          unrestrictedOnly: this.unrestrictedOnly,
          merchantGroupIds: ids
        }, signedInParams ) );
      },
      
      getFilterState: function() {
        return filterStateFactory.create({
          affiliatableOnly: this.affiliatableOnly
        })
      },
      
      _filterEmptyParams: function( params ) {
        return _.omit( params, function( value ) {
          return value === "" || value === false || ( value.length === 1 && value[0] === "" ) ;
        } )
      }
    }
  }
  
  return factory;
}]);

/*
 * This is a factory that returns an object 
 */
app.factory('filterStateFactory', function() {
  var factory = {};
  
  factory.create = function( filterParams ) {
    //all filter values
    var affiliatable = Boolean( filterParams.affiliatableOnly );
    
    return {
      
      /*
       * Whether or not this filter state filters affiliatbable merchants
       * TODO is this necessary? Is this used outside of this object?
       */
      doFilterAffiliatable: function() {
        return affiliatable;
      },
  
      /*
       * Return a deterministic hash for this set of filters
       */
      hash: function() {
        var hashed = "";
        
        if ( this.doFilterAffiliatable() ) {
          hashed += "aff";
        }
        
        return hashed;
      },
      
      /*
       * Returns whether or not the request has any filters associated with it
       * There's different logic in the data model depending on whether or not we need to filter anything
       */ 
      hasAnyFilters: function() {
        return ( this.doFilterAffiliatable() ) // in future, add other front end filters here
      },
      
      /*
       * Takes in merchant data and returns and array of Ids that match.
       * TODO: this logic probably doesn't belong here
       */
      getFilteredIdsFromData: function( merchantDataArr ) {
        var filteredIds = [],
            filterInfo = this;
        
        merchantDataArr.forEach( function( merchantData ) {
          var doAdd = true;
          
          // The idea is that we'll have one block per filter.
          if ( filterInfo.doFilterAffiliatable() ) {
            if ( !merchantData.overallAffiliable ) {
              doAdd = false;
            }
          }
          
          // If the data passes all the blocks, add its ID to the return array
          if ( doAdd ) {
            filteredIds.push( merchantData.id );
          }
          
        });
        
        return filteredIds;
      }
    }
  }
  
  return factory;
})