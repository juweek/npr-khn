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

  const annotations = [
    {
      note: {
        label: "Here is the annotation label",
        title: "Annotation title",
      },
      type: d3.annotationCalloutCircle,
      subject: {
        radius: 20, // circle radius
        radiusPadding: 20, // white space around circle befor connector
      },
      color: ["red"],
      x: 40,
      y: 160,
      dy: 70,
      dx: 70,
    },
  ];

  var containerElement = document.querySelector("#svganchor");
  var width = containerElement.offsetWidth;
  var height = 30;

  let margin = ({top: 0, right: 6, bottom: 0, left: 6});

  var data = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];

  let svgAxis = d3
    .select("#svganchor")
    .append("svg")
    .attr("width", "auto")
    .attr("height", height)
    .style("margin-left", margin.left);

  // Create scale
  var scale = d3
    .scaleLinear()
    .domain([d3.min(data), d3.max(data)])
    .range([ 7, width - 20 ]);

  // Add scales to axis
  var x_axis =
    d3.axisBottom()
      .scale(scale)
      .tickFormat(function(d) {
        return d.toFixed(0) + "%";
      });

  //Append group and insert axis
  svgAxis
    .append("g")
    .attr("class", "x axis")
    .call(x_axis);


  pymChild.sendHeight();
};
