var app = angular.module('merchantExplorer');

app.service('bootstrapService', function() {
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

  var categories = [];
  angular.forEach( categoryBootstrap.categories, function( catName, catId ) {
    categories.push( [catName, catId] );
  });

  categories.sort( function( prev, next ) {
    var prevBigger = prev[0].toLowerCase() >= next[0].toLowerCase();

    if ( prevBigger ) {
      return 1;
    } else {
      return -1;
    }
  });
  
  
  this.categories = categories;
  
  //TODO make a call to /account/users?
  this.userIds = [ [ "Ty's Campaign", 1569178 ], [ "Shoe Campaign", 1569934 ], [ "Dress Campaign", 1573667 ] ];
  
  
})