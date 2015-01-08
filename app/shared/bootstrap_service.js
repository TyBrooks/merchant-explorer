/*
 * This service is responsible for handling the loading of bootstrapped data from Rails
 * For dev purposes, it may load up mock data as well
 */
var app = angular.module('merchantExplorer');

app.service('bootstrapService', ['$http', 'config', '$q', function($http, config, $q) {
  var loadExternalUsers = config.lookup('loadExternalUsers'),
      usersApi = ( loadExternalUsers ) ? config.lookup('userApiUrl') : "";
      
  var bootstrap = this;
      
  /*
   * Categories section
   * In prod, this will probably be bootstrapped from Rails
   */
  
  //The hardcoded category data
  var categoryBootstrap = {
  	"categories": {
  		"134": "Food & Drink",
  		"117": "Consumer Electronics",
  		"135": "Home & Garden",
  		"132": "Dating",
  		"133": "Music & Musicians",
  		"138": "Collectibles",
  		"139": "Online Services",
  		"136": "Adult & Gambling",
  		"137": "Career & Employment",
  		"118": "Automotive",
  		"119": "Fashion & Accessories",
  		"131": "Other",
  		"130": "Education",
  		"125": "Travel",
  		"143": "Jewelry & Watches",
  		"126": "Financial Services",
  		"144": "Lifestyle",
  		"127": "Pets",
  		"145": "Motorcycles & PowerSports",
  		"146": "Shopping & Coupons",
  		"128": "Cell Phones & Mobile",
  		"147": "Toys & Hobbies",
  		"121": "Real Estate",
  		"148": "Cameras & Photo",
  		"122": "Art & Entertainment",
  		"123": "Sports & Fitness",
  		"124": "Self-Help",
  		"129": "News, Books & Magazines",
  		"120": "Health & Beauty",
  		"140": "Family & Baby",
  		"142": "Gaming",
  		"141": "Firearms and Hunting"
  	}
  }

  this.categories = [];
  //The category data has to be formatted into an arrray of arrays
  angular.forEach( categoryBootstrap.categories, function( catName, catId ) {
    bootstrap.categories.push( [ catName, catId ] );
  });
  // Finally we want to sort the categories so that they're in alphabetical order
  this.categories.sort( function( prev, next ) {
    var prevBigger = prev[0].toLowerCase() >= next[0].toLowerCase();

    if ( prevBigger ) {
      return 1;
    } else {
      return -1;
    }
  });
  
  
  /*
   * User Ids section
   * In production, this should also be bootstrappable from rails
   */
  
  this.userIds = null;
  
  this.getUserInfo = function() {
    if ( !_.isNull( this.userIds ) ) {
      var deferred = $q.defer();
      deferred.resolve( this.userIds );
      return deferred.promise;
    } else if ( loadExternalUsers ) {
      var userInfoPromise = $http({
        method: "GET",
        url: usersApi,
        withCredentials: true
      })

      var formattedPromise = userInfoPromise.then( function( response ) {
        var data = response.data;
        var userIds = [];
        if ( data && data.users ) {
          _.each( data.users, function( user ) {
             userIds.push( [ user.name, user.id ] );
          } );
        }
        bootstrap.userIds = userIds;
        return userIds;
      } )
      
      return formattedPromise;
    } else {
      var deferred = $q.defer();
      deferred.resolve( [ [ "Ty's Campaign", 1569178 ], [ "Shoe Campaign", 1569934 ], [ "Dress Campaign", 1573667 ] ] )
      return deferred.promise;
    }
  }
  
  
  this.isSignedIn = function() {
    return ( this.userIds && this.userIds.length !== 0 );
  }
  
  
}])