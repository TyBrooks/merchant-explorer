var app = angular.module('merchantExplorer')

//TODO just combine these into a single object

app.factory('searchParamsFactory', function() {
  var factory = {};
  
  factory.createDefault = function() {
    return {
      phrase: "",
      category: "All Categories",
      country: "All Countries",
      cpc_cat: "CPC + CPA",
      insider: false,
      unrestricted: false
    }
  }
  
  return factory;
});

app.factory('hashedSearchParamsFactory', function() {
  var factory = {};
  
  factory.create = function( searchParams ) {
    var insider = ( searchParams.insider ) ? "1" : "0";
    var unrestricted = ( searchParams.unrestricted ) ? "1" : "0";
    
    return searchParams.phrase +
      searchParams.category +
      searchParams.country +
      searchParams.cpc_cat +
      insider +
      unrestricted;
  }
  
  return factory;
})

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