// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var animateScroll = require("./lib/animateScroll");

//boot up
$.one(".journal-pages").classList.remove("no-js");

$(".grid-item").forEach(el => el.addEventListener("click", function(e) {
  e.preventDefault();
  animateScroll(".journal-pages");
}));

require("./flipbook");