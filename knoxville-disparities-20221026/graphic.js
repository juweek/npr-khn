var mode = null;
if (document.querySelector("body").classList.contains("npr")) {
  mode = "npr";
}
if (document.querySelector("body").classList.contains("khn")) {
  mode = "khn";
}

var pym = require("./lib/pym");

switch(mode) {
  case "khn":
    require("../_base/webfonts_khn.js");
    break;
  case "npr":
    require("../_base/webfonts_npr.js");
    break;
  default:
    require("./lib/webfonts");
    break;
}

// Global vars
var pymChild = null;

// Initialize the graphic.
var onWindowLoaded = function() {
  render();
  window.addEventListener("resize", () => render());

  pym.then(child => {
    pymChild = child;
    child.sendHeight();
  });
};

// Render the graphic(s)
var render = function() {
  // Update iframe
  if (pymChild) {
    pymChild.sendHeight();
  }
};

//Initially load the graphic
window.onload = onWindowLoaded;
