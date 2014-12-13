var app = angular.module('merchantExplorer')

app.factory('searchParamsFactory', function() {
  var factory = {};
  
  factory.createDefault = function() {
    return {
      phrase: "",
      category: "All Categories",
      country: "All Countries",
      cpc_cat: "CPC + CPA",
      affiliatable: true,
      insider: false,
      unrestricted: false
    }
  }
  
  return factory;
});

app.factory('hashedSearchParamsFactory', function() {
  var factory = {};
  
  factory.create = function( searchParams ) {
    var affiliatable = ( searchParams.affiliatable ) ? "1" : "0";
    var insider = ( searchParams.insider ) ? "1" : "0";
    var unrestricted = ( searchParams.unrestricted ) ? "1" : "0";
    
    return searchParams.phrase +
      searchParams.category +
      searchParams.country +
      searchParams.cpc_cat +
      affiliatable +
      insider +
      unrestricted;
  }
  
  return factory;
})

app.factory('filterFactory', function() {
  var factory = {};
  
  factory.create = function( filter_options ) {
    //all filter values
    var affilitable = Boolean( filter_object.affiliatable );
    
    return {
      // doFilter<attribute> section
      
      this.doFilterAffiliatable = function() {
        return affiliatable;
      }
      
      // create a unique, deterministic value for the filter options (necessary for caching)
      
      this.hashFilters = function() {
        var hashed = "";
        
        if ( this.doFilterAffiliatable() ) {
          hashed += "aff";
        }
        
        return hashed;
      }
      
      // So we know if we should filter at all
      
      this.hasAnyFilters = function() {
        return ( this.doFilterAffiliatable() ) // in future, add other front end filters here
      }
      
    }
    
  }
})