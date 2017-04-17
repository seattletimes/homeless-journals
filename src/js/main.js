// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");
var animateScroll = require("./lib/animateScroll");

var chainFrames = function(...args) {
  var index = 0;
  var next = function() {
    args[index++]();
    if (index == args.length) return;
    window.requestAnimationFrame(next);
  };
  window.requestAnimationFrame(next);
};

var waterfall = function(...chain) {
  var index = 0;
  var next = function() {
    var fn = chain[index++];
    if (fn) fn(next);
  }
  next();
};

var raf = function() {
  return new Promise(function(ok, fail) {
    window.requestAnimationFrame(ok);
  });
};

var wait = function(ms) {
  return new Promise(function(ok, fail) {
    window.setTimeout(ok, ms);
  });
};

var tick = function(c) {
  return raf().then(c);
};

var once = function(element, event, fn) {
  var listener = function(e) {
    element.removeEventListener(event, listener);
    fn(e);
  };
  element.addEventListener(event, listener);
};

//boot up
$.one(".journal-pages").classList.remove("no-js");

$(".grid-item").forEach(el => el.addEventListener("click", function(e) {
  e.preventDefault();
  animateScroll(".journal-pages");
}));

var flipPages = function(element, direction) {
  var fwd = direction == "forward";
  var nextPage = fwd ? element.nextElementSibling : element.previousElementSibling;
  if (!nextPage) return;
  var outPageOriginal = element.querySelector(fwd ? ".text" : ".scan");
  var outPage = outPageOriginal.cloneNode(true);
  var outbounds = outPageOriginal.getBoundingClientRect();
  element.classList.add("outgoing");
  nextPage.classList.remove("hidden", "outgoing", "flip-forward", "flip-backward");
  outPage.style.height = `${outbounds.height}px`;
  outPage.classList.add("illusory");
  if (fwd) {
    nextPage.appendChild(outPage);
  } else {
    nextPage.insertBefore(outPage, nextPage.querySelector(".scan"));
  }
  nextPage.classList.add(`flip-${direction}`);
  once(nextPage, "animationend", function() {
    element.classList.add("hidden");
    nextPage.removeChild(outPage);
  });
};

$(".journal-pages .page").forEach(function(el, i) {
  if (i > 0) el.classList.add("hidden");
  $.one(".scan", el).addEventListener("click", () => flipPages(el, "backward"));
  $.one(".text", el).addEventListener("click", () => flipPages(el, "forward"));
});