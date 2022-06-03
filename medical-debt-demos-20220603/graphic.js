var mode = null;
if (document.querySelector("body").classList.contains("npr")) {
  mode = "npr";
}
if (document.querySelector("body").classList.contains("khn")) {
  mode = "khn";
}

var charts = [];
var pym = require("./lib/pym");
var skipLabels = ["label", "values", "offset", "chart"];

var d3 = {
  // ...require("d3-axis/dist/d3-axis.min"),
  // ...require("d3-scale/dist/d3-scale.min"),
  ...require("d3-selection/dist/d3-selection.min")
};

var {classify } = require("./lib/helpers");

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

var renderBars = require("./renderBars");

// Initialize the graphic.
var onWindowLoaded = function() {
  formatData();  
  render(DATA);

  window.addEventListener("resize", () => render(DATA));

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

  var containerElement = d3.select(container);
  containerElement.html("");

  charts.forEach(function(d,i) {
    var chartData = data.filter(function(v) {
      return v.chart == d;
    });

    containerElement.append('div')
      .attr('class', 'chart ' + classify(d));

    renderBars({
      container: container + ' .chart.' + classify(d),
      width,
      data: chartData,
      title: d,
      labelColumn: "label",
      valueColumn: "amt"
    });
  })



  // Update iframe
  if (pymChild) {
    pymChild.sendHeight();
  }
};

// Format graphic data for processing by D3.
var formatData = function() {
  DATA.forEach(function(d) {
    var x0 = 0;

    d.values = [];

    for (var key in d) {
      if (skipLabels.indexOf(key) > -1) {
        continue;
      }

      d[key] = d[key];

      var x1 = x0 + d[key];

      d.values.push({
        name: key,
        x0: x0,
        x1: x1,
        val: d[key]
      });

      x0 = x1;
    }
  });

  charts = DATA.map(o => o['chart']); // equivalent of underscore _.pluck
  charts = Array.from(new Set(charts)); // dedupe / _.uniq
};

//Initially load the graphic
window.onload = onWindowLoaded;
