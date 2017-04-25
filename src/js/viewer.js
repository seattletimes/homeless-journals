var $ = require("./lib/qsa");
var closest = require("./lib/closest");

var viewers = $(".page-viewer");

viewers.forEach(function(v) {

  var start = v.getAttribute("data-start");
  var thumbs = $(".thumb", v);
  var feature = $.one(".feature img", v);
  var text = $.one(".text", v);

  var selectImage = function(page) {
    feature.src = `./assets/pages/${page.scan}`;
    text.innerHTML = `
<h1>${page.name}, ${page.age}</h1>
<p >${page.text}
    `
  };

  thumbs.forEach(t => t.addEventListener("click", function() {
    var index = this.getAttribute("data-index");
    var page = window.journalData[index];
    selectImage(page);
  }));

  selectImage(window.journalData[start]);

});