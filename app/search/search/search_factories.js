var app = angular.module('merchantExplorer')

//TODO just combine these into a single object

app.factory('searchParamsFactory', function() {
  var factory = {};
  
  factory.createDefault = function() {
    return {
      keyword: "",
      industryIds: 100, // Figure out these ids
      countryIds: 100,
      coverage: "B",
      starsOnly: false,
      unrestrictedOnly: false,
      affiliatableOnly: true,
      
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
      
      asApiParams: function() {
        return {
          keyword:      this.keyword,
          industryIds:  [ this.industryIds ],
          countryIds:   [ this.countryIds ],
          coverage:     this.coverage,
          starsOnly:    this.starsOnly,
          unrestrictedOnly:  this.unrestrictedOnly,
        }
      },
      
      asFilterObject: function() {
        return {
          affilitable: this.affiliatableOnly
        }
      }
      
    }
  }
  
  return factory;
});

app.factory('filterInfoFactory', function() {
  var factory = {};
  
  factory.create = function( searchParams ) {
    //all filter values
    var affiliatable = Boolean( searchParams.affiliatable );
    
    return {
      // doFilter<attribute> section
      
      doFilterAffiliatable: function() {
        return affiliatable;
      },
      
      // create a unique, deterministic value for the filter options (necessary for caching)
      
      hashFilters: function() {
        var hashed = "";
        
        if ( this.doFilterAffiliatable() ) {
          hashed += "aff";
        }
        
        return hashed;
      },
      
      // So we know if we should filter at all
      
      hasAnyFilters: function() {
        return ( this.doFilterAffiliatable() ) // in future, add other front end filters here
      },
      
      filter: function( merchantDataArr ) {
        var filteredIds = [],
            filterInfo = this;
        
        merchantDataArr.forEach( function( merchantData ) {
          var doAdd = true;
          //Filter section... need one for every filter.
          //  so far it's just affiliatable though
          
          if ( filterInfo.doFilterAffiliatable() ) {
            if ( !merchantData.aff_status ) {
              doAdd = false;
            }
          }
          // end filter section
          
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