var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");
var { policies, states, listOfArrays } = require("./partials/object");
var { eventHandlers, dropdown, policyDropdown } = require("./partials/dropdownHandlers");
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
  VARIABLES: set the size of the canvas, 
  ------------------------------
  */
  const width = 1300; // Chart width
  const height = 800; // Chart height

  /*
  ------------------------------
  VARIABLES: fetch all of the interactive elements
  ------------------------------
  */
  let currentStateDropdown = document.getElementById("stateDropdownSelector");
  let currentPolicyDropdown = document.getElementById("policyDropdownSelector");
  let showResultsButton = document.getElementById("showResultsButton");

  //create a list of buttons with the button text corresponding to the policies (FAP, COLLECTIONS, REPORTED, DEBT, SUED, DENIED)
  let listOfButtons = document.querySelectorAll(".button");
  let listOfButtonNames = []
  let countedNames = {};
  let listOfCountedNames = [];
  let buttonTextOption = window.BUTTONS
  buttonTextOption = JSON.parse(buttonTextOption);


  /*
  ------------------------------
  VARIABLES: iterate over listOfArrays (except for State and Hospital Type) and add a button for each policy
  ------------------------------
  */
  //
  let tempArray = listOfArrays.slice(2);
  tempArray.forEach((array) => {
    let button = document.createElement("button");
    button.classList.add("button");
    button.id = array[0];
    button.innerText = array[0];

    //for each button, find the corresponding policy in the BUTTONS object and set the button text to that
    let currentButtonText = buttonTextOption.find((entry) => entry['Abbreviation'] === array[0]);
    if (currentButtonText != undefined) {
      button.innerText = currentButtonText['Policy']
    }

    /*
    ------------------------------
    FUNCTION: add an event listener to each button
    1. first, remove the class 'active' from all of the buttons
    2. then, add the class 'active' to the button that was clicked
    3. find the policy that corresponds to the button that was clicked. then, call the policydropdownChange function
    4. then, append the button to the buttonContainer
    ------------------------------
    */
    button.addEventListener("click", function (d) {
      let listofButtons = document.getElementsByClassName("button");

      for (let i = 0; i < listofButtons.length; i++) {
        let currentButton = listofButtons[i];
        let currentClassList = currentButton.classList;
        currentClassList.remove("active");
      }
      //add the class 'active' to the button that was clicked
      button.classList.add("active");

      //find the policy that corresponds to the button that was clicked. then, call the policydropdownChange function
      let policyKey = Object.keys(policies).find((key) => policies[key] === button.id);
      eventHandlers.policydropdownChange(listOfCountedNames, policyKey);
      child.sendHeight();
    }
    );
    document.getElementById("buttonContainer").appendChild(button);
  });

  /*
 ------------------------------
 FUNCTION: attach the event listeners to the state dropdown. also, attach the event listener to the show results button
 ------------------------------
 */
  currentStateDropdown.addEventListener("change", function (d) {
    eventHandlers.stateDropdownChange(states[d.target.value], listOfArrays, d);
    child.sendHeight();
  })

  showResultsButton.addEventListener("click", function () {
    clickHandlers.buttonClicked();
    child.sendHeight();
  });

  /*
  ------------------------------
  METHOD: create the update method.
  1. create a few variables 
  2. get the data from the window object. for each entry in the data, create a new object where you format the data to fit your needs. put it in countyToFIPSCode
  3. create
  ------------------------------
  */
  function update(svg, us, radius) {
    let path = d3.geoPath();
    let dataForModal = {}

    d3.csv('./hospitalScores.csv').then(function (data) {
      data = window.data;
      //convert newData to a json object
      data = JSON.parse(data);
      let countyToFIPSCode = [];

      data.forEach(function (d) {
        // extract only c_fips and per_capita (or total)
        let currentEntry = {
          fips: d['FIPS'],
          CITY: d['City'],
          NAME: d['Name'],
          SYSTEM: d['System'],
          county: d['County'],
          state: d['State'],
          AID: d['Aid for patients with large bills?'],
          HOSPITAL_TYPE: d['Hospital type'],
          BEDS: d['Beds'],
          REPORTED: d['Can patients be reported to credit bureaus?'],
          ASSETS: d['Assets considered?'],
          FAP: d['Financial Assistance Policy available online?'],
          FAP_LINK: d['FAP link'],
          FIN_ASSIST: d['Info on financial assistance available with "financial assistance" search?'],
          LIENS: d['Places liens or garnishes wages?'],
          COLLECTIONS: d['Collections policies available online?'],
          COLLECTIONS_LINK: d['Collections link'],
          REPORTED: d['Can patients be reported to credit bureaus?'],
          DEBT: d["Can patients' debts be sold?"],
          SUED: d['Can patients be sued or subject to wage garnishment or property liens?'],
          SCORECARD: d['Scorecard notes'],
          DENIED: d['Can patients with debt be denied nonemergency care?'],
        }
        //create all the data in countyToFIPSCode
        dataForModal[d['FIPS']] = currentEntry; // add to the original data
        countyToFIPSCode.push(currentEntry);
      });

      // transform data so its a map of FIPS code => data
      data = data.map(x => Object.values(x));
      data = new Map(data);

      //create a new object where the key is the fips code. use that new object to get the data for each state
      let whatever = countyToFIPSCode
      let fipsData = {};
      whatever.forEach(obj => {
        let key = obj['fips'];
        if (key.toString().length > 4) {
          key = key;
        } else {
          key = '0' + key;
        }
        fipsData[key] = obj;
      });

      //transform the countyToFIPSCode to a Map of d[fips] => data. make the key the fips code, and a string
      countyToFIPSCode = countyToFIPSCode.map(x => Object.values(x));
      countyToFIPSCode = new Map(countyToFIPSCode);

      //create a function where you can get a specific attribute from the spreadsheet to the circle
      function getDataAttribute(id, fipsData, attribute) {
        if (fipsData[id]) {
          return fipsData[id][attribute];
        }
        else {
          return 'none';
        }
      }

      /*
      ------------------------------
      SECTION: draw the map with the circles; attach the appropriate data to each circle
      1. select the g element
      2. select all the circles
      3. for each circle, get the data from the data object. if the data object has the fips code, then get the data. otherwise, return null
      4. join the data to the circles via attributes
      ------------------------------
      */
      svg.select("g")
        .selectAll("circle")
        .data(topojson.feature(us, us.objects.counties).features
          .map(d => {
            d.value = data.get(d.id), d;
            //d.value = d.properties.name, d;
            return d;
          })
          .filter(d => {
            return countyToFIPSCode.has(parseInt(d.id))
          }))
        .join("circle")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("transform", d => `translate(${path.centroid(d)})`)
        .attr('class', function (d) { return "hoverableContent " + d.id })
        .attr("fill", "#000")
        .attr("data-fips", function (d) { return d.id })
        .attr("data-state", function (d) {
          return getDataAttribute(d.id, fipsData, 'state')
        })
        .attr("data-hospitalType", function (d) {
          return getDataAttribute(d.id, fipsData, 'HOSPITAL_TYPE')
        })
        .attr("data-beds", function (d) {
          return getDataAttribute(d.id, fipsData, 'BEDS')
        })
        .attr("data-FAP", function (d) {
          return getDataAttribute(d.id, fipsData, 'FAP')
        })
        .attr("data-COLLECTIONS", function (d) {
          return getDataAttribute(d.id, fipsData, 'COLLECTIONS')
        })
        .attr("data-REPORTED", function (d) {
          return getDataAttribute(d.id, fipsData, 'REPORTED')
        })
        .attr("data-DEBT", function (d) {
          return getDataAttribute(d.id, fipsData, 'DEBT')
        })
        .attr("data-SUED", function (d) {
          return getDataAttribute(d.id, fipsData, 'SUED')
        })
        .attr("data-DENIED", function (d) {
          return getDataAttribute(d.id, fipsData, 'DENIED')
        })
        .attr("data-SCORECARD", function (d) {
          return getDataAttribute(d.id, fipsData, 'SCORECARD')
        })
        .attr("data-FINASSIST", function (d) {
          return getDataAttribute(d.id, fipsData, 'FIN_ASSIST')
        })
        .attr("data-ASSETS", function (d) {
          return getDataAttribute(d.id, fipsData, 'ASSETS')
        })
        .attr("data-LIENS", function (d) {
          return getDataAttribute(d.id, fipsData, 'LIENS')
        })
        .attr("data-AID", function (d) {
          return getDataAttribute(d.id, fipsData, 'AID')
        })
        .attr("data-NAME", function (d) {
          return getDataAttribute(d.id, fipsData, 'NAME')
        })
        .attr("data-SYSTEM", function (d) {
          return getDataAttribute(d.id, fipsData, 'SYSTEM')
        })
        .attr("r", d => radius(''));

      //for every array in List of Arrays, filter the items to display the count of unique items. use this count to determine the radius of the circle
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
      METHOD: attach hover event handlers to the circles to call the tooltip
      ------------------------------
      */
      svg
        .selectAll(".state")
        .on("mousemove", function (d) {
          tooltipHandlers.mouseEnter(d.pageX, d.pageY, d.srcElement, dataForModal)
        })
        .on("mouseout", function (d) {
          tooltipHandlers.mouseOut(d.srcElement)
        })

      /*
      ------------------------------
      METHOD: build out and populate the side column
      ------------------------------
      */
      let fixedSideColumn = document.getElementById("fixedSideColumn");
      //let fixedSideColumnTop = document.getElementById('fixedSideColumnTop')

      svg.select("g")
        .selectAll("circle")
        .attr("data-state", function (d) {
          let currentEntry = dataForModal[d.id]
          if (currentEntry) {
            return currentEntry.state
          }
          else
            return 'none'
        })

      for (const entry in dataForModal) {
        let currentEntry = dataForModal[entry]
        let sideColumnDiv = document.createElement("div");
        sideColumnDiv.className = "sideColumnHospital";
        sideColumnDiv.setAttribute("data-fips", currentEntry.fips)
        sideColumnDiv.setAttribute("data-county", currentEntry.county)
        sideColumnDiv.setAttribute("data-state", currentEntry.state)
        sideColumnDiv.setAttribute("data-hospitalType", currentEntry.HOSPITAL_TYPE)
        sideColumnDiv.setAttribute("data-beds", currentEntry.Beds)
        sideColumnDiv.innerHTML = `<div class="hoverableContent ${currentEntry.fips}"><div><b>${currentEntry.hospitalName} Hospital</b> </div><div>${currentEntry.Beds} beds</div><div>${currentEntry.county}, ${currentEntry.state}</div></div>`
        fixedSideColumn.appendChild(sideColumnDiv);
      }

      //create close button and append it as a child to the modal element
      svg
        .selectAll("circle")
        .on("click", function (d) {
          modalFunctions.clickCircle(d.srcElement, dataForModal)
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
            tooltipHandlers.mouseEnter(rect.x, rect.y, currentCircle, dataForModal)
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
            modalFunctions.clickCircle(currentCircle, dataForModal)
          }
        })
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
