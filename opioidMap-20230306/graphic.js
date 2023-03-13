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
        .join("path")
        .attr("d", path)
        .attr("class", "state")
        .attr("fill", (d) => {
          //get the current state name from the topojson
          let stateName = d.properties.name.toLowerCase();

          //from the csv, get the entry where the state_name matches the current state name
          let stateData = data.find((d) => (d.state_name).toLowerCase() == stateName);
          let currentDebt = stateData.avg_medical_debt
          if (currentDebt > 800) {
            return "#d1505b";
          } else if (currentDebt > 600) {
            return "#88595d";
          } else {
            return "#a0363f";
          }
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
            return stateData['avg_medical_debt']
          }
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("data-coordinates", (d) => `${path.centroid(d)}`)


       /*
      ------------------------------
      METHOD: attach the click events to each of the state paths
      ------------------------------
      */
      svg
      .selectAll(".state")
      .on("click", function (d) {
        console.log(d)
        console.log('///////')
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


      /*
      ------------------------------
      METHOD: build out and populate the side column
      ------------------------------
      */
      let fixedSideColumn = document.getElementById("fixedSideColumn");
      //let fixedSideColumnTop = document.getElementById('fixedSideColumnTop')
      //print size of dataForModal
      svg.select("g")
        .selectAll(".state")
        .attr("data-state", function (d) {
          //find the 
          console.log(d)
          console.log(data)
          if (d.properties.name != undefined) {
            let stateData = data.find((currentData) => currentData.state_name == d.properties.name);
            console.log(stateData)
            console.log('///////')
            return stateData['state_name']
          }
          else {

            return 'undefined'
          }
        })

      const sortedData = Object.values(data).sort(function (a, b) {
        if (a['state_name'] < b['state_name']) {
          return -1;
        }
        if (a['state_name'] > b['state_name']) {
          return 1;
        }
      });

      console.log(sortedData)
      console.log(data)
      console.log('============')

      for (const entry in sortedData) {
        console.log(entry)
        let currentState = (data[entry])
        console.log('+++++++++++++')
        let sideColumnDiv = document.createElement("div");
        sideColumnDiv.className = "sideColumnHospital";
        sideColumnDiv.setAttribute("data-state", currentState['state_name'])
        sideColumnDiv.setAttribute("data-settlement", currentState['avg_medical_debt'])
        sideColumnDiv.innerHTML = `<div class="hoverableContent ${currentState['state_name']}"><div><b>${currentState['state_name']}</b></div><div><b>Amount owed: </b>${'$' + currentState['avg_medical_debt']}</div></div>`
        fixedSideColumn.appendChild(sideColumnDiv);
      }
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
