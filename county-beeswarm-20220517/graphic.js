var pym = require("./lib/pym");
var pymChild = null;
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");

var mode = null;
if (document.querySelector("body").classList.contains("npr")) {
  mode = "npr";
}
if (document.querySelector("body").classList.contains("khn")) {
  mode = "khn";
}

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

/* INITIALIZE */
pym.then((child) => {
  pymChild = child;

  renderChart();
  pymChild.sendHeight();

  window.addEventListener("resize", renderChart);
});


/* RENDER THE CHART */
var renderChart = function() {
  // clear out existing chart
  var containerElement = document.querySelector("#svganchor");
  containerElement.innerHTML = "";


  // var width = containerElement.offsetWidth;

  if (isMobile.matches) {
    var width = 430,
    height = 30;
  }
  else {
    var width = 840,
    height = 50;
  }

  let svgImage = document.querySelector('.svgImage')
  let currentWidth = svgImage.width


  let margin = ({top: 0, right: 60, bottom: 34, left: 6});

  var data = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];

  let svgAxis = d3
    .select("#svganchor")
    .append("svg")
    .attr("width", svgImage.width)
    .attr("height", height)
    .style("margin-left", margin.left);

  // Create scale
  var scale = d3
    .scaleLinear()
    .domain([d3.min(data), d3.max(data)])
    .range([3, width - 100]);

  // Add scales to axis
  var x_axis = d3.axisBottom().scale(scale);

  //Append group and insert axis
  svgAxis.append("g").call(x_axis);

  pymChild.sendHeight();
};
