var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");
var { policies, states } = require("./partials/object");
var { eventHandlers, dropdown, policyDropdown } = require("./partials/dropdownHandlers");
var { clickHandlers } = require("./partials/buttonHandlers");
var { tooltipHandlers, tooltip } = require("./partials/tooltipHandlers");
var { modalFunctions } = require("./partials/modal");

const { zip } = require("d3-array");

var mode = null;
if (document.querySelector("body").classList.contains("npr")) {
  mode = "npr";
}
if (document.querySelector("body").classList.contains("khn")) {
  mode = "khn";
}

switch (mode) {
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
  /*
  ------------------------------
  METHOD: set the size of the canvas
  ------------------------------
  */
  const width = 1300; // Chart width
  const height = 800; // Chart height

  let currentStateDropdown = document.getElementById("stateDropdownSelector");
  let currentPolicyDropdown = document.getElementById("policyDropdownSelector");
  let showResultsButton = document.getElementById("showResultsButton");
  let countedNames = {};
  let listOfCountedNames = [];

  let dataState = ["state"],
    dataHospitalType = ["HOSPITAL_TYPE"],
    dataFap = ["FAP"],
    dataCollections = ["COLLECTIONS"],
    dataReported = ["REPORTED"],
    dataDebt = ["DEBT"],
    dataSued = ["SUED"],
    dataDenied = ["DENIED"];

  let listOfArrays = [dataState, dataHospitalType, dataFap, dataCollections, dataReported, dataDebt, dataSued, dataDenied];

  //create a list of buttons with the button text corresponding to the policies (FAP, COLLECTIONS, REPORTED, DEBT, SUED, DENIED)
  let listOfButtons = document.querySelectorAll(".button");
  let listOfButtonNames = []

  //iterate over listOfArrays (except for State and Hospital Type) and add a button for each policy
  let tempArray = listOfArrays.slice(2);
  tempArray.forEach((array) => {
    let button = document.createElement("button");
    button.classList.add("button");
    button.id = array[0];
    button.innerText = array[0];
    button.addEventListener("click", function (d) {
      let policyKey = Object.keys(policies).find((key) => policies[key] === button.innerText);
      eventHandlers.policydropdownChange(listOfCountedNames, policyKey);
      child.sendHeight();
    }
    );
    document.getElementById("buttonContainer").appendChild(button);
  });

  listOfButtons.forEach((button) => {
    listOfButtonNames.push(button.innerText);
  });

  currentStateDropdown.addEventListener("change", function (d) {
    eventHandlers.stateDropdownChange(states[d.target.value], listOfArrays, d);
    child.sendHeight();
  })

  /*
  currentPolicyDropdown.addEventListener("change", function (d) {
    let currentQuestion = d.target.value
    console.log(currentQuestion)
    eventHandlers.policydropdownChange(listOfCountedNames, currentQuestion);
    //eventHandlers.changeTheKey(listOfCountedNames, d)
    child.sendHeight();
  })
  */

  showResultsButton.addEventListener("click", function () {
    clickHandlers.buttonClicked();
    child.sendHeight();
  });

  /*
  ------------------------------
  METHOD: fetch the data and draw the chart
  ------------------------------
  */
  function update(svg, us, radius) {
    let path = d3.geoPath();
    let originalData = {}

    d3.csv('./hospitalScores.csv').then(function (data) {
      data.forEach(function (d) {
        // extract only c_fips and per_capita (or total)
        d.total = +d.total;
        d.per_capita = +d.per_capita
        let currentEntry = {
          fips: (d.c_fips.length > 4) ? d.c_fips : '0' + d.c_fips,
          total: d.total,
          per_capita: d.per_capita,
          hospitalName: d.county,
          county: d.county,
          state: d.state,
          HOSPITAL_TYPE: d.HOSPITAL_TYPE,
          Beds: d.Beds,
          FAP: d.FAP,
          FAP_LINK: d.FAP_LINK,
          COLLECTIONS: d.COLLECTIONS,
          COLLECTIONS_LINK: d.COLLECTIONS_LINK,
          REPORTED: d.REPORTED,
          DEBT: d.DEBT,
          SUED: d.SUED,
          DENIED: d.DENIED,
        }
        delete d['county'];
        delete d['state'];
        delete d['total'];
        //transform the fips code so all the counties are 5 digits; prepend the ones that are 4 digits with a 0
        if (d.c_fips.length > 4) {
          d.c_fips = d.c_fips;
        } else {
          d.c_fips = '0' + d.c_fips;
        }
        originalData[d.c_fips] = currentEntry; // add to the original data
      });

      //transform the data so all the counties with a fips code with 4 digits are prepended with a 0
      let transformedData = data.map(function (d) {
        if (d.c_fips.length > 4) {
          return d;
        } else {
          d.c_fips = '0' + d.c_fips;
          return d;
        }
      });

      // transform data to Map of c_fips => per_capita
      data = transformedData.map(x => Object.values(x));
      data = new Map(data);

      let format = d3.format(",.7f");
      // radius = d3.scaleSqrt([0, d3.quantile([...data.values()].sort(d3.ascending), 0.985)], [0, 10])

      /*
      ------------------------------
      SECTION: draw the map with the circles; attach the appropriate data to each circle
      ------------------------------
      */

      svg.select("g")
        .selectAll("circle")
        .data(topojson.feature(us, us.objects.counties).features
          .map(d => {
            d.value = data.get(d.id), d;
            return d;
          }).filter(d => {
            return d.value != null;
          }) //filter the results of the data to exclude counties with null or undefined values
          .sort((a, b) => b.value - a.value))
        .join("circle")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("transform", d => `translate(${path.centroid(d)})`)
        .attr('class', function (d) { return "hoverableContent " + d.id })
        .attr("fill", "#000")
        .attr("data-fips", function (d) { return d.id })
        .attr("data-state", function (d) {
          let id = d.id
          if (originalData[id]) {
            dataState.push(originalData[id].state)
            return originalData[id].state
          }
          else {
            return 'none'
          }
        })
        .attr("data-hospitalType", function (d) {
          let id = d.id
          if (originalData[id]) {
            dataHospitalType.push(originalData[id].HOSPITAL_TYPE);
            return originalData[id].HOSPITAL_TYPE
          }
          else {
            return 'none'
          }
        })
        .attr("data-beds", function (d) {
          let id = d.id
          if (originalData[id]) {
            return originalData[id].Beds
          }
          else {
            return 'none'
          }
        })
        .attr("data-FAP", function (d) {
          let id = d.id
          if (originalData[id]) {
            dataFap.push(originalData[id].FAP);
            return originalData[id].FAP
          }
          else {
            return 'none'
          }
        })
        .attr("data-COLLECTIONS", function (d) {
          let id = d.id
          if (originalData[id]) {
            dataCollections.push(originalData[id].COLLECTIONS);
            return originalData[id].COLLECTIONS
          }
          else {
            return 'none'
          }
        })
        .attr("data-REPORTED", function (d) {
          let id = d.id
          if (originalData[id]) {
            dataReported.push(originalData[id].REPORTED);
            return originalData[id].REPORTED
          }
          else {
            return 'none'
          }
        })
        .attr("data-DEBT", function (d) {
          let id = d.id
          if (originalData[id]) {
            dataDebt.push(originalData[id].DEBT);
            return originalData[id].DEBT
          }
          else {
            return 'none'
          }
        })
        .attr("data-SUED", function (d) {
          let id = d.id
          if (originalData[id]) {
            dataSued.push(originalData[id].SUED);
            return originalData[id].SUED
          }
          else {
            return 'none'
          }
        })
        .attr("data-DENIED", function (d) {
          let id = d.id
          if (originalData[id]) {
            dataDenied.push(originalData[id].DENIED);
            return originalData[id].DENIED
          }
          else {
            return 'none'
          }
        })
        .attr("r", d => radius(d.value));

      svg.select("g")
        .selectAll("circle")
        .append("title")
        .text(d => `${d.properties.name}${format(d.value)}`);

      //for every array in List of Arrays, filter the items to display the count of unique items
      listOfArrays.forEach(function (array) {
        countedNames = array.reduce((allAnswers, answer) => {
          const currCount = allAnswers[answer] ?? 0;
          return {
            ...allAnswers,
            [answer]: currCount + 1,
          };
        }, {})
        listOfCountedNames.push(countedNames)
      })
      /*
  ------------------------------
  SECTION: attach hover event handlers to the circles
  ------------------------------
  */
      svg
        .selectAll(".state")
        .on("mousemove", function (d) {
          tooltipHandlers.mouseEnter(d.pageX, d.pageY, d.srcElement, originalData)
        })
        .on("mouseout", function (d) {
          tooltipHandlers.mouseOut(d.srcElement)
        })

      /*
      ------------------------------
      SECTION: build out and populate the side column
      ------------------------------
      */
      let fixedSideColumn = document.getElementById("fixedSideColumn");
      //let fixedSideColumnTop = document.getElementById('fixedSideColumnTop')

      svg.select("g")
        .selectAll("circle")
        .attr("data-state", function (d) {
          let currentEntry = originalData[d.id]
          if (currentEntry) {
            return currentEntry.state
          }
          else
            return 'none'
        })

      for (const entry in originalData) {
        let currentEntry = originalData[entry]
        let newDiv = document.createElement("div");
        newDiv.className = "sideColumnHospital";
        newDiv.setAttribute("data-fips", currentEntry.fips)
        newDiv.setAttribute("data-county", currentEntry.county)
        newDiv.setAttribute("data-state", currentEntry.state)
        newDiv.setAttribute("data-hospitalType", currentEntry.HOSPITAL_TYPE)
        newDiv.setAttribute("data-beds", currentEntry.Beds)
        newDiv.innerHTML = `<div class="hoverableContent ${currentEntry.fips}"><div><b>${currentEntry.hospitalName} Hospital</b> </div><div>${currentEntry.Beds} beds</div><div>${currentEntry.county}, ${currentEntry.state}</div></div>`
        fixedSideColumn.appendChild(newDiv);
      }
      /*
      ------------------------------
      SECTION: create a modal that pops up when a d3 circle is clicked on. The modal should have the hospital name, the county name, the state name, and the total number of opioid prescriptions. 
      ------------------------------
      */

      //create close button and append it as a child to the modal element
      svg
        .selectAll("circle")
        .on("click", function (d) {
          modalFunctions.clickCircle(d.srcElement, originalData)
        })
      /*
------------------------------
SECTION: hover over each of the sections in the side column. Attach hover and click events to each of the elements that bring up the modal
------------------------------
*/
      let hoverableContent1 = document.getElementsByClassName("sideColumnHospital");

      for (let i = 0; i < hoverableContent1.length; i++) {
        hoverableContent1[i].addEventListener("mousemove", function (d) {
          let currentFips = d.target.getAttribute("data-fips")
          let currentCircle = document.querySelector(`circle[data-fips="${currentFips}"]`)
          if (currentCircle) {
            let rect = currentCircle.getBoundingClientRect();
            tooltipHandlers.mouseEnter(rect.x, rect.y, currentCircle, originalData)
          }
          else {
            console.log("no circle found")
          }
        })
        hoverableContent1[i].addEventListener("mouseout", function (d) {
          let currentFips = d.target.getAttribute("data-fips")
          let currentCircle = document.querySelector(`circle[data-fips="${currentFips}"]`)
          if (currentCircle) {
            tooltipHandlers.mouseOut(currentCircle)
          }
        })
        hoverableContent1[i].addEventListener("click", function (d) {
          let currentFips = d.target.getAttribute("data-fips")
          let currentCircle = document.querySelector(`circle[data-fips="${currentFips}"]`)
          if (currentCircle) {
            modalFunctions.clickCircle(currentCircle, originalData)
          }
        })
      }

      /*
      //dispatch the policy selected event so the default map option is loaded
      let policyDropdown = document.getElementById("policyDropdownSelector")
      let event = new Event('change');
      policyDropdown.dispatchEvent(event);
      */
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

      // for circle
      svg
        .append("g")
        .attr("class", "state")
        .attr("fill-opacity", 0.6)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      let radius = d3.scaleSqrt([0, 10], [8, 8]);

      const legend = svg
        .append("g")
        .attr("fill", "#777")
        .attr("transform", "translate(925,608)")
        .attr("text-anchor", "middle")
        .style("font", "10px sans-serif")
        .selectAll("g")
        .data([0.001, 0.005, 0.01])
        .join("g");

      legend
        .append("circle")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("cy", (d) => -radius(d))
        .attr("r", radius);

      legend
        .append("text")
        .attr("y", (d) => -2 * radius(d))
        .attr("dy", "1.3em")
      //  .text(d3.format(".4"));

      update(svg, us, radius);
      //fire the click event for the FAP button, click, then click again after 3 seconds
      let fapButton = document.getElementById("FAP")
      setTimeout(function () {
        fapButton.click()
      }, 100)

      //call the policy dropdown change handler so the circles are changed to the default policy on page load
      child.sendHeight();


      window.addEventListener("resize", () => child.sendHeight());
    })
    .catch(function (error) {
      console.log(error);
    });
});
