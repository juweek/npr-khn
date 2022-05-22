var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");

pym.then((child) => {
  /*
------------------------------
METHOD: set the size of the canvas
------------------------------
*/

  let height = 400;
  let width = 700;
  let margin = { top: 0, right: 40, bottom: 34, left: 40 };

  // Data structure describing volume of displayed data
  let Count = {
    total: "medical_debt_collections_pct",
    perCap: "six_chronic_pct",
    population: "population",
  };

  // Data structure describing legend fields value
  let Legend = {
    total: "% with medical debt ",
    perCap: "Per Capita Deaths",
  };

  let chartState = {};

  chartState.measure = Count.total;
  chartState.radius = 0;
  chartState.scale = "scaleLinear";
  chartState.legend = Legend.total;
  chartState.radiusSize = Count.total;

  /*
------------------------------
METHOD: select the d3 div and set the width and height
------------------------------
*/

  let svg = d3.select("#svganchor").append("svg")
  .attr("width", width)
 .attr("height", height);

    /*
  d3.select(window).on("resize", function () {
    var targetWidth = svg.node().getBoundingClientRect().width;
    svg.attr("width", targetWidth);
    svg.attr("height", targetWidth / aspect);
  });
*/

  /*
------------------------------
METHOD: add in the x-axis
------------------------------
*/
  let xScale = d3.scaleLinear().range([margin.left, width - margin.right]);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")");

  // Create line that connects circle and X axis
  let xLine = svg
    .append("line")
    .attr("stroke", "rgb(96,125,139)")
    .attr("stroke-dasharray", "1,2");

  // Create tooltip div and make it invisible
  let tooltip = d3
    .select("#svganchor")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  /*
------------------------------
METHOD: load in and process data
------------------------------
*/
  d3.csv(
    "https://raw.githubusercontent.com/juweek/beeswarm/main/medicalDebt_KHN_NPR/datasets/top20Counties.csv"
  )
    .then(function (data) {
      let dataSet = data;

      let listOfValues = [];

      data.forEach((element) => {
        listOfValues.push(element.collection_debt_state_avg);
      });

      // Set chart domain max value to the highest total value in data set. this will affect the key
      xScale.domain(
        d3.extent(data, function (d) {
          return +d.total;
        })
      );

      // Listen to click on "total" and "per capita" buttons and trigger redraw when they are clicked
      d3.selectAll(".measure").on("click", function () {
        let thisClicked = this.value;
        //chartState.measure = thisClicked;
        if (thisClicked == "nonSize") {
          chartState.radius = 5;
        } else {
          chartState.radius = 0;
        }
        redraw();
      });

      redraw();

      function redraw() {
        svg.selectAll(".countries").remove();

        //set the scale based off the range from the dataset
        xScale = d3.scaleLinear().range([margin.left, width - margin.right]);

        xScale.domain(
          d3.extent(dataSet, function (d) {
            return +d[chartState.measure];
          })
        );

        /*
        var rscale = d3.scaleLinear().domain(d3.extent(dataSet, function(d) {
            return +d[chartState.radiusSize];
        })).range([3, 9]) 
        */

        var rscale = d3
          .scaleLinear()
          .domain([300, d3.max(listOfValues)])
          .range([1, 15]);

        // Set X axis based on new scale. If chart is set to "per capita" use numbers with one decimal point
        let xAxis;
        if (chartState.measure === Count.perCap) {
          xAxis = d3.axisBottom(xScale).ticks(7, ".1f").tickSizeOuter(0);
        } else {
          xAxis = d3.axisBottom(xScale).ticks(7, ".1s").tickSizeOuter(0);
        }

        //include a transition for the x axis if you change the scale
        d3.transition(svg)
          .select(".x.axis")
          .transition()
          .duration(1000)
          .call(xAxis);

        // Create simulation with specified dataset
        let simulation = d3
          .forceSimulation(dataSet)
          // Apply positioning force to push nodes towards desired position along X axis
          .force(
            "x",
            d3
              .forceX(function (d) {
                // Mapping of values from total/perCapita column of dataset to range of SVG chart (<margin.left, margin.right>)
                return xScale(+d[chartState.measure]); // This is the desired position
              })
              .strength(10)
          ) // Increase velocity
          .force("y", d3.forceY(height / 2 - margin.bottom / 2)) // // Apply positioning force to push nodes towards center along Y axis
          .force("collide", d3.forceCollide(20)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
          .stop(); // Stop simulation from starting automatically

        // Manually run simulation
        for (let i = 0; i < dataSet.length; ++i) {
          simulation.tick(10);
        }

        // Create country circles
        let countriesCircles = svg
          .selectAll(".countries")
          .data(dataSet, function (d) {
            return d.FIPS;
          });

        countriesCircles
          .exit()
          .transition()
          .duration(1000)
          .attr("cx", 0)
          .attr("cy", height / 2 - margin.bottom / 2)
          .remove();

        //for every FIPS in the dataset, create a circle, set the r, and set the circles
        countriesCircles
          .enter()
          .append("circle")
          .attr("class", "countries")
          .attr("cx", 0)
          .attr("cy", height / 2 - margin.bottom / 2)
          .attr("r", function (d) {
            if (chartState.radius == 5) {
              return 7;
            } else {
              return parseInt(rscale(d.collection_debt_state_avg));
            }
            //else 	{ return parseInt(d.collection_debt_state_avg)/80}
          })
          //else 	{ return parseInt(d.collection_debt_state_avg)/80}
          .attr("fill", function (d) {
            return "#2FACD3";
          })
          .attr("fill-opacity", 0.5)
          .attr("stroke", "#2FACD3")
          .attr("stroke-width", 2)
          .merge(countriesCircles)
          .transition()
          .duration(2000)
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });

        countriesCircles
          .enter()
          .append("text")
          .attr("class", "textGraph")
          .attr("x", function (d) {
            return d.x;
          })
          .attr("y", function (d) {
            return d.y;
          })
          .text(function (d) {
            return d.County;
          });

        // Show tooltip when hovering over circle (data for respective country)
        // Show tooltip when hovering over circle (data for respective country)
        d3.selectAll(".countries")
          .on("mousemove", function (d) {
            tooltip
              .html(
                `<strong>${d.target.__data__.County}, ${
                  d.target.__data__.State
                }</strong><br>
                          <strong>${chartState.legend.slice(
                            0,
                            chartState.legend.indexOf(",")
                          )}</strong>: 
                          ${d.target.__data__.medical_debt_collections_pct}%<br>
                          <strong>Avg amount of debt: </strong>${
                            d.target.__data__.collection_debt_state_avg
                          }`
              )
              .style("top", d.pageY - 12 + "px")
              .style("left", d.pageX + 25 + "px")
              .style("opacity", 0.9);

            xLine
              .attr("x1", d3.select(this).attr("cx"))
              .attr("y1", d3.select(this).attr("cy"))
              .attr("y2", height - margin.bottom)
              .attr("x2", d3.select(this).attr("cx"))
              .attr("opacity", 1);
          })
          .on("mouseout", function (_) {
            tooltip.style("opacity", 0);
            xLine.attr("opacity", 0);
          });
      }

      // Add annotation to the chart
    })
    .catch(function (error) {
      if (error) throw error;
    });

  child.sendHeight();

  // child.onMessage("on-screen", function(bucket) {
  //     ANALYTICS.trackEvent("on-screen", bucket);
  // });
  // child.onMessage("scroll-depth", function(data) {
  //     data = JSON.parse(data);
  //     ANALYTICS.trackEvent("scroll-depth", data.percent, data.seconds);
  // });

  window.addEventListener("resize", () => child.sendHeight());
});
