var app = angular.module('merchantExplorer');

app.service('merchantApi', ["$q", function($q) {
  var idUrl = "",
      batchUrl = "",
      currentPromise = null,
      ids = [],
      currentIdx = 0;
  
  this.getIds = function(searchParams) {
    //TODO make actual calls
    var deferred = $q.defer();
    currentPromise = deferred;
    
    var pending = [];
    for (var i = 0; i < 35; i++) {
      pending.push(Math.floor(Math.random() * 10000));
    }
    ids.concat(pending);
    
    setTimeout(function() {
      deferred.resolve(pending);
    }, 200)
    
    return deferred.promise;
  }
  
  this.getMerchantData = function(ids) {
    //TODO make actual calls
    var deferred = $q.defer();
    currentPromise = deferred;
    
    toReturn = [];
    ids.forEach(function(id) {
      toReturn.push({
        name: "Merchant " + id,
        id: id,
        domain: "www.whatever.com",
        country: "US",
        cpc: "CPC and CPA",
        aff_status: true,
        commission: "5% on all products"
      });
    });
    

    
    currentIdx += 16;
    
    setTimeout(function() {
      deferred.resolve(toReturn);
    }, 1000);
    
    return deferred.promise;
  }
  
  this.cancelCurrentCall = function() {
    if ( currentPromise ) {
      currentPromise.reject();
    }
  }
}]);



    //
// var id1 = ids[currentIdx];
// var id2 = ids[currentIdx + 1];
// var id3 = ids[currentIdx + 2];
// var id4 = ids[currentIdx + 3];
// var id5 = ids[currentIdx + 4];
// var id6 = ids[currentIdx + 5];
// var id7 = ids[currentIdx + 6];
// var id8 = ids[currentIdx + 7];
// var id9 = ids[currentIdx + 8];
// var id10 = ids[currentIdx + 9];
// var id11 = ids[currentIdx + 10];
// var id12 = ids[currentIdx + 11];
// var id13 = ids[currentIdx + 12];
// var id14 = ids[currentIdx + 13];
// var id15 = ids[currentIdx + 14];
// var id16 = ids[currentIdx + 15];
//



        // [{
//             name: "Merchant " + id1,
//             id: id1,
//             domain: "D1",
//             country: "US",
//             cpc: "CPC and CPA",
//             aff_status: true,
//             commission: "5% on all products"
//         }, {
//             name: "Merchant " + id2,
//             id: id2,
//             domain: "D2",
//             country: "UK",
//             cpc: "CPC Only",
//             aff_status: true,
//             commission: "8% on all products"
//         },{
//             name: "Merchant " + id3,
//             id: id3,
//             domain: "D1",
//             country: "US",
//             cpc: "CPC and CPA",
//             aff_status: true,
//             commission: "5% on all products"
//         }, {
//             name: "Merchant " + id4,
//             id: id4,
//             domain: "D2",
//             country: "UK",
//             cpc: "CPC Only",
//             aff_status: true,
//             commission: "8% on all products"
//         },{
//             name: "Merchant " + id5,
//             id: id5,
//             domain: "D1",
//             country: "US",
//             cpc: "CPC and CPA",
//             aff_status: true,
//             commission: "5% on all products"
//         }, {
//             name: "Merchant " + id6,
//             id: id6,
//             domain: "D2",
//             country: "UK",
//             cpc: "CPC Only",
//             aff_status: true,
//             commission: "8% on all products"
//         },{
//             name: "Merchant " + id7,
//             id: id7,
//             domain: "D1",
//             country: "US",
//             cpc: "CPC and CPA",
//             aff_status: true,
//             commission: "5% on all products"
//         }, {
//             name: "Merchant " + id8,
//             id: id8,
//             domain: "D2",
//             country: "UK",
//             cpc: "CPC Only",
//             aff_status: true,
//             commission: "8% on all products"
//         },{
//             name: "Merchant " + id9,
//             id: id9,
//             domain: "D1",
//             country: "US",
//             cpc: "CPC and CPA",
//             aff_status: true,
//             commission: "5% on all products"
//         }, {
//             name: "Merchant " + id10,
//             id: id10,
//             domain: "D2",
//             country: "UK",
//             cpc: "CPC Only",
//             aff_status: true,
//             commission: "8% on all products"
//         },{
//             name: "Merchant " + id11,
//             id: id11,
//             domain: "D1",
//             country: "US",
//             cpc: "CPC and CPA",
//             aff_status: true,
//             commission: "5% on all products"
//         }, {
//             name: "Merchant " + id12,
//             id: id12,
//             domain: "D2",
//             country: "UK",
//             cpc: "CPC Only",
//             aff_status: true,
//             commission: "8% on all products"
//         },{
//             name: "Merchant " + id13,
//             id: id13,
//             domain: "D1",
//             country: "US",
//             cpc: "CPC and CPA",
//             aff_status: true,
//             commission: "5% on all products"
//         }, {
//             name: "Merchant " + id14,
//             id: id14,
//             domain: "D2",
//             country: "UK",
//             cpc: "CPC Only",
//             aff_status: true,
//             commission: "8% on all products"
//         },{
//             name: "Merchant " + id15,
//             id: id15,
//             domain: "D1",
//             country: "US",
//             cpc: "CPC and CPA",
//             aff_status: true,
//             commission: "5% on all products"
//         }, {
//             name: "Merchant " + id16,
//             id: id16,
//             domain: "D2",
//             country: "UK",
//             cpc: "CPC Only",
//             aff_status: true,
//             commission: "8% on all products"
//         }]