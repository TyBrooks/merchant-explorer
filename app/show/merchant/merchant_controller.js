//TODO: handle not signed in

var app = angular.module('merchantExplorer');

app.controller("MerchantCtrl",
  ['selectedMerchantService', 'bootstrapService', '$location',
  function(selectedService, bootstrap, $location) {
  
  var merchantCtrl = this;
  
  var loc = $location.path();
  this.id = loc.match(/\/merchants\/(\d+)/i)[1];

  this.selected = {};
  this.isLoading = true;
  this.isRefreshingAffStatus = false;
  
  var campaignsPromise = bootstrap.getUserInfo();
  campaignsPromise.then( function( userIds ) {
    merchantCtrl.campaigns = ( !_.isEmpty(userIds) ) ? userIds : [ ["", ""] ];
    merchantCtrl.userId = ( selectedService.searchState && selectedService.searchState.userId ) ? selectedService.searchState.userId : merchantCtrl.campaigns[0][1];
  
    var dataPromise = selectedService.getDataPromiseForSelected( merchantCtrl.id, merchantCtrl.userId );
  
    dataPromise.then( function( merchantData ) {
      merchantCtrl.selected = merchantData;
      merchantCtrl.isLoading = false;
    });
  } );
  
  
  
  this.buildCommissionRates = function() {
    return _.map( this.selected.rates, function( rate ) {
      if ( rate.min === rate.max ) {
        return "" + rate.min + rate.type + " " + rate.description;
      } else {
        return "" + rate.min + " - " + rate.max + rate.type + " " + rate.description;
      }
    })
  }
  
  this.isInsider = function() {
    if ( !this.isLoading ) {
      return this.selected.promotionType && this.selected.promotionType.toLowerCase() === "star";
    }
  }
  
  this.logoSrc = function() {
    var slug = this.slugify("" + this.selected.id + " " + this.selected.name);
    // TODO fix this up
    return "//www.viglink.com/merchants/" + slug + ".gif";
  }
  
  this.isSignedIn = function() {
    return bootstrap.isSignedIn();
  }

  this.back = function() {
    //TODO make selectedService's params defaults? OR just scrap the changes altogether?
    // if ( selectedService.searchState && selectedService.searchState.userId ) {
  //     selectedService.searchState.userId = this.userId;
  //   }
    $location.path('/merchants');
    $location.replace();
  }
  
  this.changeCampaign = function() {
    var dataPromise = selectedService.getDataPromiseForSelected( this.id, this.userId );
    this.isRefreshingAffStatus = true;
    
    dataPromise.then( function( merchantData ) {
      merchantCtrl.isRefreshingAffStatus = false;
      merchantCtrl.selected.domains = merchantData.domains;
    });
  }
  
  this.hasImage = function() {
    if ( !this.isLoading ) {
      return !!this.selected.imgId;
    } else {
      return false;
    }
  }
  
  this.doShowTrafficPlaceholder = function() {
    if ( !this.isLoading ) {
      return !this.selected.countriesByRegion || this.selected.countriesByRegion.length === 0;
    } else {
      return false;
    }
  }
  
  this.doShowCommissionPlaceholder = function() {
    if ( !this.isLoading ) {
      return !this.selected.rates || this.selected.rates.length === 0;
    } else {
      return false;
    }
  }
  
  this.slugify = function( text ) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }
  
}])