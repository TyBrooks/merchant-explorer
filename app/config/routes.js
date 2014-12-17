var app = angular.module('merchantExplorer');

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  
  $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  
  $routeProvider
  .when('/merchants/:id', {
    controller: "MerchantCtrl",
    templateUrl: "merchant.html"
  })
    // .when('/merchants', {
    //   templateUrl: 'explorer.html'
    // })
}])