var $ = require("./lib/qsa");
var flip = require("./lib/flip");

var journal = $.one(".journal-pages");

var once = function(element, event, fn) {
  var listener = function(e) {
    element.removeEventListener(event, listener);
    fn(e);
  };
  element.addEventListener(event, listener);
};

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

var toggleZoom = function(page) {
  var scan = $.one(".scan", page);
  flip(scan, function() {
    journal.classList.toggle("zoom");
  });
};

journal.addEventListener("doubleclick", e => e.preventDefault());
journal.addEventListener("click", function(e) {

});

$(".journal-pages .page").forEach(function(el, i) {
  if (i > 0) el.classList.add("hidden");
  var image = $.one(".scan img", el);
  image.addEventListener("click", () => toggleZoom(el));
  var leftEdge = $.one(".scan .edge", el);
  if (leftEdge) leftEdge.addEventListener("click", () => flipPages(el, "backward"));
  var rightEdge = $.one(".text .edge", el);
  if (rightEdge) rightEdge.addEventListener("click", () => flipPages(el, "forward"));
});