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

var renderColumnChart = require("./renderColumnChart");

// Initialize the graphic.
var onWindowLoaded = function() {
  render(window.DATA);

  window.addEventListener("resize", () => render(window.DATA));

  pym.then(child => {
    pymChild = child;
    child.sendHeight();
  });
};

// Render the graphic(s)
var render = function(data) {
  // Render the chart!
  var container = "#column-chart";
  var element = document.querySelector(container);
  var width = element.offsetWidth;
  renderColumnChart({
    container,
    width,
    data,
    labelColumn: "label",
    valueColumn: "amt"
  });

  // Update iframe
  if (pymChild) {
    pymChild.sendHeight();
  }
};

//Initially load the graphic
window.onload = onWindowLoaded;
