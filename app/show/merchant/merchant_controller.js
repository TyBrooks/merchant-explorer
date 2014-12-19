var app = angular.module('merchantExplorer');

app.controller("MerchantCtrl", ['selectedMerchantService', '$location', function(selectedService, $location) {
  var controller = this;
  
  //TODO how to set this?
  this.userId = 1111;
  this.id = 10;
  
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

  this.back = function() {
    $location.path('/merchants');
    $location.replace();
  }
  
  
  
}])