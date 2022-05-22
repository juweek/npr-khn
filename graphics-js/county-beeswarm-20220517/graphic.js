var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");

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

  // Add annotation to the chart
  const makeAnnotations = d3.annotation().annotations(annotations);
  d3.select("#designated").append("g").call(makeAnnotations);

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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

  child.sendHeight();

  window.addEventListener("resize", () => child.sendHeight());
});
