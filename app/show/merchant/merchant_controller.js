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
    //TODO - derive the url from the path (it's just the url.gif)
    
    return "//localhost:3000/mock_data/firestone.gif";
  }
  
  this.isSignedIn = function() {
    return bootstrap.isSignedIn();
  }

  this.back = function() {
    if ( selectedService.searchState && selectedService.searchState.userId ) {
      selectedService.searchState.userId = this.userId;
    }
    $location.path('/merchants');
    $location.replace();
  }
  
  
  
}])