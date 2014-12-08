var app = angular.module('merchantExplorer');

app.service('merchantApi', function() {
  var idUrl = "",
      batchUrl = "";
  
  this.getIds = function(searchParams) {
    //TODO make actual calls
    
    return [1,2,3,4,5];
  }
  
  this.batchCall = function(ids) {
    //TODO make actual calls
    
    return [{
        name: "A"
      }, {
        name: "B"
    }];
  }
});