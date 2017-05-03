var $ = require("./lib/qsa");
var closest = require("./lib/closest");
var animateScroll = require("./lib/animateScroll");

var viewers = $(".page-viewer");

viewers.forEach(function(v) {

  var start = v.getAttribute("data-start") * 1;
  var count = v.getAttribute("data-count") * 1;
  var thumbs = $(".thumb", v);
  var feature = $.one(".feature img", v);
  var text = $.one(".text .content", v);
  var current = start;

  var selectImage = function(page) {
    feature.src = `./assets/pages/${page.scan}`;
    text.innerHTML = `
<h1>${page.name.trim()}, ${page.age || "no age given"}</h1>
<a class="toggle-text">show caption &raquo;</a>
<p>${page.text}
    `
  };

  thumbs.forEach(t => t.addEventListener("click", function() {
    var index = this.getAttribute("data-index");
    $(".active.thumb", v).forEach(el => el.classList.remove("active"));
    this.classList.add("active");
    current = index;
    var page = window.journalData[index];
    selectImage(page);
  }));

  selectImage(window.journalData[start]);

  v.addEventListener("click", function(e) {
    if (e.target.classList.contains("toggle-text")) {
      v.classList.toggle("show-text");
    }
  });

  var stepImage = function() {
    var increment = this.classList.contains("next") ? 1 : -1;
    var index = current += increment;
    if (index >= start + count) index = start;
    if (index < start) index = start + count - 1;
    current = index;
    var page = window.journalData[index];
    selectImage(page);
    animateScroll(feature);
  };

  $(".goto", v).forEach(el => el.addEventListener("click", stepImage));

});