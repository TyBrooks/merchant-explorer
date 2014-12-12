var app = angular.module('merchantExplorer');

app.controller('ShowcaseCtrl', ['showcaseService', function(showcaseService, config) {
  var merchantData = [],
      numShowcases = 3;
  
  //Build initial blank data array based on num of showcases
  var initialData = ( function(showcases) {
    var data = [];
    
    for ( var i = 0; i < showcases; i++ ) {
      data.push({ img: "", commission: "" });
    }
    
    return data;
  })(numShowcases)
  
  this.getMerchants = function() {
    if (merchantData.length === 0) {
      showcaseService.getShowcaseData().then(angular.bind(this, this.handleShowcaseData));
      return initialData;
    } else {
      console.log("merchantData, ", merchantData)
      return merchantData;
    }
  }
  
  this.handleShowcaseData = function(data) {
    merchantData = data;
  }
  
}]);