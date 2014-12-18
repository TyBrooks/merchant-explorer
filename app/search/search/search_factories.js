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
       */
      keyword: "",
      industryIds: 100, // Figure out these ids
      countryIds: 100,
      coverage: "B",
      starsOnly: false,
      unrestrictedOnly: false,
      affiliatableOnly: true,
      userId: 0,
      
      /*
       * Returns a hash representation of the current search
       * Necessary for caching search metadata
       */
      hash: function() {
        var insider = ( this.starsOnly ) ? "1" : "0",
            unrestricted = ( this.unrestrictedOnly ) ? "1" : "0",
            affiliated = ( this.affiliatableOnly ) ? "1" : "0";
        
        return  insider +
                unrestricted +
                affiliated +
                this.keyword +
                this.industryIds +
                this.country +
                this.coverage;
      },
      
      /*
       * Return an object that represents the parameters in the form that the backend needs via the API
       * ... for the initial fetch Id's request
       */
      asApiSearchParams: function() {
        return {
          keyword:      this.keyword,
          industryIds:  [ this.industryIds ],
          countryIds:   [ this.countryIds ],
          coverage:     this.coverage,
          starsOnly:    this.starsOnly,
          unrestrictedOnly:  this.unrestrictedOnly,
        }
      },
      
      /*
       * Returns object representing the filters needed for retrieving merchant data in a batch call
       */
      asApiRetrieveParams: function( ids ) {
        return {
          unrestrictedOnly: this.unrestrictedOnly,
          userId: this.userId,
          merchantGroupIds: ids
        }
      },
      
      getFilterState: function() {
        filterStateFactory.create({
          affiliatableOnly: this.affiliatableOnly
        })
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
            if ( !merchantData.aff_status ) {
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