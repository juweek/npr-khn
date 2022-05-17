var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");

pym.then((child) => {

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  let svg = d3
    .selectAll("circle")
    .on("mousemove", function (d) {
      console.log(d.pageY);
      console.log(d.pageX);
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
