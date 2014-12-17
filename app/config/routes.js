var app = angular.module('merchantExplorer');

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  
  $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  
  $routeProvider
  .when('/merchants/:id', {
    templateUrl: "../show/merchant.html"
  })
  .when('/merchants', {
    templateUrl: "../search/explorer.html",
  })
}])