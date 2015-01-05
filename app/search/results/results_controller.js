/*
 * Responsibilities
 * --------
 *
 * 1. Handle all logic necessary for the view/html layer
 *
 */


var app = angular.module('merchantExplorer');

app.controller('ResultsCtrl',
  ['merchantResultsService', 'selectedMerchantService', 'bootstrapService', '$location', 'config',
  function( resultsService, selectedService, bootstrap, $location, config ) {
  
  var currentPage = 1,
      perPage = config.lookup('perPage');
  
  // Pass through methods
  
  this.getCurrentPageData = function() {
    //Hrmmm, not sure if this is the best way to do this
    if ( resultsService.isNewSearch() ) {
      currentPage = 1;
    }
    
    return resultsService.getCurrentPageData( currentPage, perPage );
  }
  
  this.getTotalPages = function() {
    return resultsService.getTotalPages( perPage );
  }
  
  this.isLoading = function() {
    return resultsService.isLoading( currentPage, perPage );
  }
  
  this.isInsider = function( merchantData ) {
    return merchantData.promotionType === "STAR";
  }
  

  //Page Methods
  
  this.currentPage = function() {
    return currentPage;
  }
  
  this.nextPage = function() {
    currentPage += 1;
  }
  
  this.previousPage = function() {
    currentPage -= 1;
  }
  
  this.setPage = function( pageNum ) {
    if ( this.pageLoadable( pageNum ) ) {
      currentPage = pageNum;
    }
  }
  
  this.doShowPrevious = function() {
    return currentPage !== 1;
  }
  
  this.doShowNext = function() {
    var numPages = this.getTotalPages();
    return ( currentPage < numPages && !this.isLoading() );
  }
  
  this.doShowLeadingDots = function() {
    return ( ( currentPage - 2 ) > 1 ) && ( this.getTotalPages() > 0 );
  }
  
  this.doShowTrailingDots = function() {
    return ( currentPage + 2 ) < this.getTotalPages();
  }
  
  this.pageLoadable = function(pageNum) {
    if ( pageNum > currentPage ) {
      return !this.isLoading();
    } else {
      return true;
    }
  }
  
  this.isSignedIn = function() {
    return bootstrap.isSignedIn();
  }
  
  this.displayAffiliatableOrb = function( result ) {
    return angular.isDefined( result.overallAffiliable );
  }
  
  this.displayRestrictedInfo = function( result ) {
    return angular.isDefined( result.overallRestricted );
  }
  
  this.additionalInfoString = function( resultArr, excludeNum ) {
    if ( resultArr ) {
      if ( excludeNum ) {
        if (resultArr.length > 1 ) {
          return " + Others";
        }
      } else {
        if ( resultArr.length === 2 ) {
          return " + 1 Other";
        } else if ( resultArr.length  > 2 ) {
          return " + " + resultArr.length + "Others";
        }
      }
    }
    
    return "";
  }
  
  this.countryInfoString = function( result ) {
    if ( result.countries ) {
      var additionalInfoString = this.additionalInfoString( result.countries );
    
      return result.countries[0] + additionalInfoString;
    }
  }
  
  this.domainInfoString = function( result ) {
    if ( result.domains ) {
      var additionalInfoString = this.additionalInfoString( result.domains );
      
      return result.displayDomain + additionalInfoString;
    }
  }
  
  this.commissionInfoString = function( result ) {
    if ( result.rates ) {
      var additionalInfoString = this.additionalInfoString( result.rates, true );
      
      return result.displayCommission + additionalInfoString;
    }
  }
  
  this.redirectTo = function( result ) {
    //This check is arbitrary -- just need to check for a field that doesn't appear in the blank results
    if ( angular.isDefined( result.overallAffiliable ) ) {
      selectedService.setSelected( result );
      $location.path('/merchants/' + result.id);
      $location.replace();
    }
  }
  
}]);