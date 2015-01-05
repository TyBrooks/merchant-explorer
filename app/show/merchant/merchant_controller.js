var app = angular.module('merchantExplorer');

app.controller("MerchantCtrl",
  ['selectedMerchantService', 'bootstrapService', '$location',
  function(selectedService, bootstrap, $location) {
  
  var controller = this;
  
  this.campaigns = bootstrap.userIds;
  //TODO how to set this?
  if ( !this.userId ) {
    this.userId = this.campaigns[0][1];
  }
  
  var loc = $location.path();
  this.id = loc.match(/\/merchants\/(\d+)/i);
  
  this.selected = {};
  this.isLoading = true;
  
  var dataPromise = selectedService.getDataPromiseForSelected( this.id, this.userId );
  
  dataPromise.then( function( merchantData ) {
    controller.selected = merchantData;
    controller.isLoading = false;
  });
  
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
    return this.selected.promotionType && this.selected.promotionType.toLowerCase() === "star";
  }
  
  this.logoSrc = function() {
    //TODO - derive the url from the path (it's just the url.gif)
    
    return "//localhost:3000/mock_data/firestone.gif";
  }
  
  this.isSignedIn = function() {
    return bootstrap.isSignedIn();
  }

  this.back = function() {
    $location.path('/merchants');
    $location.replace();
  }
  
  
  
}])