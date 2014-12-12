var app = angular.module('merchantExplorer');

app.service('showcaseService', ['$http', '$q', function($http, $q) {
  this.getShowcaseData = function() {
    var deferred = $q.defer();
    
    var returnData = [{
      img: "mock_data/shopbop.gif",
      commission: "10%"
    },{
      img: "mock_data/singer22.gif",
      commission: "8%"
    },{
      img: "mock_data/wayfair.gif",
      commission: "10%"
    }];
    
    setTimeout(function() {
      deferred.resolve(returnData);
    }, 500);
    
    return deferred.promise;
  }
}]);