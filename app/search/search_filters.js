var app = angular.module("merchantExplorer");

app.filter('titleize', function() {
  return function(input) {
    return input.slice(0, 1).toUpperCase() + input.slice(1);
  }
})