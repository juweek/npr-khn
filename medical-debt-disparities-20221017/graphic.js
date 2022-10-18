var mode = null;
if (document.querySelector("body").classList.contains("npr")) {
  mode = "npr";
}
if (document.querySelector("body").classList.contains("khn")) {
  mode = "khn";
}

var pym = require("./lib/pym");
var { isMobile } = require("./lib/breakpoints");
var d3 = {
  ...require("d3-selection/dist/d3-selection.min")
};

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
var renderDotChart = require("./renderDotChart");

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
  var container = "#dot-chart";
  var element = document.querySelector(container);
  var width = element.offsetWidth;

  // Clear existing graphic (for redraw)
  element.innerHTML = "";


  // draw the charts
  if (isMobile.matches) {
    for (var i = 0; i < data.length; i++) {
      var chartElement = d3.select(container).append('div')
        .attr('class', 'chart chart-' + i);

      // Render the chart!
      renderDotChart({
        container: container + ' .chart-' + i,
        width,
        data: [ data[i] ],
        idx: i,
        labelColumn: "label",
        minColumn: "white",
        maxColumn: "black"
      });
    }
  } else {
    // Render the chart!
    renderDotChart({
      container,
      width,
      data,
      labelColumn: "label",
      minColumn: "white",
      maxColumn: "black"
    });
  }

  // Update iframe
  if (pymChild) {
    pymChild.sendHeight();
  }
};

//Initially load the graphic
window.onload = onWindowLoaded;
