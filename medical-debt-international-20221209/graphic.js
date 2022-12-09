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

var { classify } = require("./lib/helpers");
var { isMobile } = require("./lib/breakpoints");

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
  var container = "#bar-chart";
  var element = document.querySelector(container);
  var width = element.offsetWidth;

  var containerElement = d3.select(container);
  containerElement.html("");

  // charts.forEach(function(d,i) {
  [ "expenses", "deaths" ].forEach(function(d,i) {
    var chartData = data.filter(function(v) {
      return v.chart == d;
    });

    var units = (d == "expenses") ? "pct" : "num";

    var ceilings = chartData.map(
      d => Math.ceil(d.amt / 20) * 20
    );
    var min = 0;
    var max = Math.max.apply(null, ceilings);

    var chartElement = containerElement.append('div')
      .attr('class', 'chart ' + classify(d));

    var chartWidth = width;
    if (!isMobile.matches) {
      chartWidth = Math.floor((width - 22) / 2);
      chartElement.attr("style", `width: ${ chartWidth }px;`)
    }

    renderBars({
      container: container + ' .chart.' + classify(d),
      width: chartWidth,
      data: chartData,
      title: LABELS["hed_" + d],
      labelColumn: "label",
      valueColumn: "amt",
      id: d,
      xDomain: [ min, max ],
      units
    });
  });

  // make sure side-by-side heds stay balanced
  if (!isMobile.matches) {
    var labelHeds = d3.selectAll('.chart h3');
    var labelMaxHeight = 0;
    labelHeds["_groups"][0].forEach(function(d,i) {
      var thisHeight = d.getBoundingClientRect().height;
      if (thisHeight > labelMaxHeight) {
        labelMaxHeight = thisHeight;
      }
    });
    labelHeds.style('height', labelMaxHeight + 'px');
  }

  // Update iframe
  if (pymChild) {
    pymChild.sendHeight();
  }
};

// Format graphic data for processing by D3.
var formatData = function() {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#sorting_array_of_objects
  DATA.sort((a, b) => b.amt - a.amt);

  charts = DATA.map(o => o['chart']); // equivalent of underscore _.pluck
  charts = Array.from(new Set(charts)); // dedupe / _.uniq
  console.log(charts);
};

//Initially load the graphic
window.onload = onWindowLoaded;
