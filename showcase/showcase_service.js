var app = angular.module('merchantExplorer');

app.service('showcaseService', ['$http', function($http) {
  this.getShowcaseData = function() {
    return [{
      img: "mock_data/shopbop.gif",
      commission: "10%";
    },{
      img: "mock_data/singer22.gif",
      commission: "8%";
    },{
      img: "mock_data/wayfair.gif",
      commission: "10%";
    }];
  }
}]);