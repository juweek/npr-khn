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
if (document.querySelector("body").classList.contains("khnSpanish")) {
  mode = "khnSpanish";
}

switch (mode) {
  case "khn":
    require("../_base/webfonts_khn.js");
    break;
  case "khnSpanish":
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
  /*
------------------------------
METHOD: set the size of the canvas
------------------------------
*/
  const width = 1300; // Chart width
  const height = 800; // Chart height
  const margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const svg = d3
  .select("#svganchor")
  .append("svg")
  .attr("viewBox", [-10, 0, 975, 610]);

  //create a row of three HTML buttons
  let states = {
    arizona: "AZ",
    alabama: "AL",
    alaska: "AK",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    "district of columbia": "DC",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
    "american samoa": "AS",
    guam: "GU",
    "northern mariana islands": "MP",
    "puerto rico": "PR",
    "us virgin islands": "VI",
    "us minor outlying islands": "UM",
  };

  /*
------------------------------
METHOD: fetch the data and draw the chart
------------------------------
*/
  function update(svg, data) {
         // List of groups (here I have one group per column)
      var allGroup = ["valueA", "valueB", "valueC"]

      console.log(data)
    
      // Reformat the data: we need an array of arrays of {x, y} tuples
      var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
        return {
          name: grpName,
          values: data.map(function(d) {
            return {time: d.time, value: +d[grpName]};
          })
        };
      });
      // I strongly advise to have a look to dataReady with
      // console.log(dataReady)
    
      // A color scale: one color for each group
      var myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);
    
      // Add X axis --> it is a date format
      var x = d3.scaleLinear()
        .domain([0,10])
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
      // Add Y axis
      var y = d3.scaleLinear()
        .domain( [0,20])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
    
      // Add the lines
      var line = d3.line()
        .x(function(d) { return x(+d.time) })
        .y(function(d) { return y(+d.value) })
      svg.selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
          .attr("d", function(d){ return line(d.values) } )
          .attr("stroke", function(d){ return myColor(d.name) })
          .style("stroke-width", 4)
          .style("fill", "none")
    
      // Add the points
      svg
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataReady)
        .enter()
          .append('g')
          .style("fill", function(d){ return myColor(d.name) })
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(function(d){ return d.values })
        .enter()
        .append("circle")
          .attr("cx", function(d) { return x(d.time) } )
          .attr("cy", function(d) { return y(d.value) } )
          .attr("r", 5)
          .attr("stroke", "white")
    
      // Add a legend at the end of each line
      svg
        .selectAll("myLabels")
        .data(dataReady)
        .enter()
          .append('g')
          .append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
            .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(function(d) { return d.name; })
            .style("fill", function(d){ return myColor(d.name) })
            .style("font-size", 15);
    }

     /*
------------------------------
METHOD: load in the map
------------------------------
*/
  d3.csv("./medicalState.csv")
    .then(function (us) {
      let path = d3.geoPath();

      const svg = d3
        .select("#svganchor")
        .append("svg")
        .attr("viewBox", [-10, 0, 975, 610]);

      update(svg, us);
      child.sendHeight();

      window.addEventListener("resize", () => child.sendHeight());
    })
    .catch(function (error) {
      console.log(error);
    })
});
