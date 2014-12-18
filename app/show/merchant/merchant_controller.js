var app = angular.module('merchantExplorer');

app.controller("MerchantCtrl", function() {
  this.name = "Firestone";
  this.description = "Firestone Complete Auto Care is the leading industry provider for vehicle maintenance, tires, batteries and repairs. Since 1926, when Harvey Firestone opened the doors to Firestone Tire and Rubber Company, we have provided the right solutions for our customers' vehicles. Through almost 90 years in the industry we understand that no one looks forward to the time when their vehicle needs attention, but with the help from our affiliate partners, high quality services, and dedicated teammates we can help alleviate this experience for them. We have about 1,700 conveniently located stores across the country which can easily be found by your visitors.";
  this.isInsider = true;
  this.logoSrc = "http://localhost:3000/mock_data/firestone.gif";
  this.rates = ["5% on all commissions", "10% during December"];
  this.countries = ["US|International", "Canada"];
  this.domains = [{
    domain: "www.firestone.com",
    cpc: "CPC / CPA",
    aff: true
  }]
})