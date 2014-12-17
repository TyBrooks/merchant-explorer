var app = angular.module('merchantExplorer');

app.controller("MerchantCtrl", function() {
  this.name = "Firestone";
  this.description = "These guys sell some serious tires";
  this.isInsider = true;
  this.logoSrc = "http://www.viglink.com/merchants/40024-firestone-complete-auto-care.gif";
  this.rates = ["5% on all commissions", "10% during December"];
  this.countries = ["US|International", "Canada"];
  this.domains = [{
    domain: "www.firestone.com",
    cpc: "CPC / CPA",
    aff: true
  }]
})