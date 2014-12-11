var app = angular.module('merchantExplorer');

app.controller('ShowcaseCtrl', ['showcaseService', function(showcaseService) {
  var merchantData = [],
      numShowcases = 3;
  
  //Build initial blank data array based on num of showcases
  var initialData = ( function(showcases) {
    var data = [];
    
    for ( var i = 0; i < showcases; i++ ) {
      data.push({ src: "", commission: "" });
    }
    
    return data;
  })(numShowcases)
  
  this.getMerchants = function() {
    if (merchantData.length === 0) {
      showcaseService.getMerchantData();
      return initialData;
    } else {
      return merchantData;
    }
  }
  
}]);