var pym = require("./lib/pym");
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

pym.then((child) => {
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

  let svg = d3
    .selectAll("circle")
    .on("mousemove", function (d) {
      tooltip
        .html(`<strong>'${d}Bro?</strong>`)
        .style("top", d.pageY - 12 + "px")
        .style("left", d.pageX + 25 + "px")
        .style("opacity", 0.9);
    })
    .on("mouseout", function (_) {
      tooltip.style("opacity", 0);
    });

    console.log(isMobile)

    if (isMobile.matches) {
      var width = 430,
      height = 30;
    }
    else {
      var width = 800,
      height = 50;
    }

  let margin = ({top: 0, right: 40, bottom: 34, left: 10});


  var data = [0, 15, 20, 25, 30, 45, 50];

  let svgAxis = d3
    .select("#svganchor")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin-left", "4px");

  // Create scale
  var scale = d3
    .scaleLinear()
    .domain([d3.min(data), d3.max(data)])
    .range([0, width - 100]);

  // Add scales to axis
  var x_axis = d3.axisBottom().scale(scale);

  //Append group and insert axis
  svgAxis.append("g").call(x_axis);
  child.sendHeight();

  window.addEventListener("resize", () => child.sendHeight());
});
