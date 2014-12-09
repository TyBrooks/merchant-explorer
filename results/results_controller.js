var app = angular.module('merchantExplorer');

app.controller('ResultsCtrl', ['merchantResultService', 'merchantResultModel', function(resultsService, resultsModel) {
  var currentPage = 1,
      perPage = 10,
      results = [];
  
  this.getCurrentPageData = function() {
    var results = resultsModel.getCurrentPageData(currentPage, perPage);
    console.log(results);
    return results;
  }
  
  //Page Methods
  
  this.nextPage = function() {
    currentPage += 1;
  }
  
  this.previousPage = function() {
    currentPage -= 1;
  }
  
  this.setPage = function(pageNum) {
    currentPage = pageNum
  }
  
}]);