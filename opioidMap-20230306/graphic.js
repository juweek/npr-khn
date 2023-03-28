var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");
var { policies, states, listOfArrays } = require("./partials/object");
var { eventHandlers, dropdown, policyDropdown, stateDropdown } = require("./partials/dropdownHandlers");
var { clickHandlers } = require("./partials/buttonHandlers");
var { tooltipHandlers, tooltip } = require("./partials/tooltipHandlers");
var { modalFunctions } = require("./partials/modal");

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

  /*
  ------------------------------
  METHOD: fetch the data and draw the chart
  ------------------------------
  */
  function update(svg, us) {
    d3.csv("./medicalState.csv").then(function (data) {

      console.log(data)
      console.log('////////////////')

      let path = d3.geoPath();

      svg
        .select("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
  .join(
    enter => {
      // create a new <text> element for each state
      const text = enter.append("text")
        .attr("class", "state-abbr")
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("dy", "0.35em") // offset the text slightly for centering
        .attr("stroke", "#000")
        .attr("pointer-events", "none")
        .attr("stroke-width", 1.5)
        .text((d) => {
          return states[d.properties.name]
        }); // get the abbreviation based on state name

      // position the text at the center of the state shape
      text.attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1]);
      
      // return the <path> element for further manipulation
      return enter.append("path")
        .attr("class", "state")
        .attr("fill", (d) => {
          //get the current state name from the topojson
          let stateName = d.properties.name.toLowerCase();

          //from the csv, get the entry where the state_name matches the current state name
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          let currentDebt = stateData.reported_publicly
          //have the color of the state change based on the transparency. make it a gradient from green to grey
          return d3.interpolateRgb("#cdccc5", "#0c7c16")(currentDebt / 100);
        })
        .attr('data-state', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['state_name']
          }
        })
        .attr('data-settlement', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['Total']
          }
        })
        .attr('data-Total', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['Total']
          }
        })
        .attr('data-stateShare', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['stateShare']
          }
        })
        .attr('data-fundShare', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['fundShare']
          }
        })
        .attr('data-localShare', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['localShare']
          }
        })
        .attr('data-otherShare', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['otherShare']
          }
        })
        .attr('data-website', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['website']
          }
        })
        .attr('data-websiteLink', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['websiteLink']
          }
        })
        .attr('data-reportedPublicly', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['reported_publicly']
          }
        })
        .attr('data-notReportedPublicly', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['not_reported_publicly']
          }
        })
        .attr('data-distributors', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['Distributors']
          }
        })
        .attr('data-JJ', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['JJ']
          }
        })
        .attr('data-CVS', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['CVS']
          }
        })
        .attr('data-Walgreens', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['Walgreens']
          }
        })
        .attr('data-Walmart', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['Walmart']
          }
        })
        .attr('data-Allergan', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['Allergan']
          }
        })
        .attr('data-Teva', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['Teva']
          }
        })
        .attr('data-otherSettlements', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['applies_to_other_settlements']
          }
        })
        .attr('data-otherDescription', (d) => {
          let stateName = d.properties.name.toLowerCase();
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          if (stateData != undefined) {
            return stateData['otherDescription']
          }
        })
        
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("d", path)
        .attr("data-coordinates", (d) => `${path.centroid(d)}`);
    },
    // update existing <path> elements
    update => update,
    // remove old <path> elements that are no longer needed
    exit => exit.remove()
  );

      /*
     ------------------------------
     METHOD: attach the click events to each of the state paths
     ------------------------------
     */
      svg
        .selectAll(".state")
        .on("click", function (d) {
          modalFunctions.clickCircle(d.srcElement, data)
        })

      /*
      ------------------------------
      METHOD: attach hover event handlers to the states to call the tooltip
      ------------------------------
      */
      svg
        .selectAll(".state")
        .on("mousemove", function (d) {
          tooltipHandlers.mouseEnter(d.pageX, d.pageY, d.srcElement, data)
        })
        .on("mouseout", function (d) {
          tooltipHandlers.mouseOut(d.srcElement)
          //change the fill color of the circle back to its original color
        })

      const sortedData = Object.values(data).sort(function (a, b) {
        if (a['state_name'] < b['state_name']) {
          return -1;
        }
        if (a['state_name'] > b['state_name']) {
          return 1;
        }
      });

      //create a dropdown event listener that listens to the dropdown, takes in the text, and calls clickCircle using the text as the state name
      let dropdown = document.getElementById('stateDropdownSelector')
      dropdown.addEventListener('change', function (e) {
        let stateName = e.target.value
        //let stateSvg = document.querySelector(`[data-state="${stateName}"]`)
        let stateSvg = document.querySelector('.state[data-state="' + stateName + '"]');
        modalFunctions.clickCircle(stateSvg, data)
      })
    });
  }


  /*
------------------------------
METHOD: load in the map
------------------------------
*/
  d3.json(
    "https://raw.githubusercontent.com/xuanyoulim/fcc-internet-complaints-map/master/counties-albers-10m.json"
  )
    .then(function (us) {
      let path = d3.geoPath();

      const svg = d3
        .select("#svganchor")
        .append("svg")
        .attr("viewBox", [-10, 0, 975, 610]);

      // outline us map
      svg
        .append("path")
        .datum(topojson.feature(us, us.objects.nation))
        .attr("fill", "#ddd")
        .attr("d", path);

      // outline state border
      svg
        .append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

      // for the states
      svg
        .append("g")
        .attr("class", "state")
        .attr("fill-opacity", 0.6)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      update(svg, us);
      child.sendHeight();

      window.addEventListener("resize", () => child.sendHeight());
    })
    .catch(function (error) {
      console.log(error);
    });
});