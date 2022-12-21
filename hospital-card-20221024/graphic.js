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
 FUNCTION: attach the event listeners to the state dropdown. 
 ------------------------------
 */
  currentStateDropdown.addEventListener("change", function (d) {
    eventHandlers.stateDropdownChange(states[d.target.value], listOfArrays, d);
    //transform listOfCountedNames so it only includes the hospitals in the current state
    //call policyDropdownChange to update the policy dropdown with just the hospitals in the current state

    child.sendHeight();
  })

    /*
 ------------------------------
 FUNCTION: attach the show and hide results button listener
 ------------------------------
 */
  showResultsButton.addEventListener("click", function () {
    //change copy of the button depending on whether the results are showing or not
    if (showResultsButton.innerText == "SHOW RESULTS") {
      showResultsButton.innerText = "HIDE RESULTS";
    } else {
      showResultsButton.innerText = "SHOW RESULTS";
    }
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
  let key = d3.select("#keyHTMLContainer");
  key.html(`<div id="keyContainer"><p class="keyDescription">Which hospitals will deny nonemergency medical care to patients with past-due bills?</p><div id="key"><div id="keyWrapper"><div id="keyTextWrapper"><div data-selection="Yes" style="display: inline-flex;"><div style="width: 20px; height: 20px; background-color: rgb(183, 3, 3); float: left; margin-right: 5px; margin-top: 0px;"></div><p>Yes, will deny medical care</p></div><div data-selection="Other" style="display: inline-flex;"><div style="width: 20px; height: 20px; background-color: #8E7B92; float: left; margin-right: 5px; margin-top: 0px;"></div><p>Unclear</p></div><div data-selection="No" style="display: inline-flex;"><div style="width: 20px; height: 20px; background-color: #631D6F; float: left; margin-right: 5px; margin-top: 0px;"></div><p>No, doesn't deny care</p></div></div><div id="keyBarGraph2"><div id="YesBar2" data-selection="Yes" style="height: 20px; width: 17.0455%; margin-bottom: 3px; background-color: rgb(183, 3, 3);"><span style="color: white; font-size: 12px; font-weight: bold; margin-left: 3px;">90</span></div><div id="UnclearBar2" data-selection="Other" style="height: 20px; width: 23.8636%; margin-bottom: 3px; background-color: #8E7B92;"><span style="color: white; font-size: 12px; font-weight: bold; margin-left: 3px;">126</span></div><div id="NoBar2" data-selection="No" style="height: 20px; width: 59.0909%; margin-bottom: 3px; background-color: #631D6F;"><span style="color: white; font-size: 12px; font-weight: bold; margin-left: 3px;">312</span></div></div></div></div></div>`)
  
  function update(svg, us, radius) {
    let path = d3.geoPath();
    let dataForModal = {}
    let dataForModalCMS = {}

    d3.csv('./hospitalScores.csv').then(function (data) {
      data = window.data;
      //convert newData to a json object
      data = JSON.parse(data);
      let countyToFIPSCode = [];

      data.forEach(function (d) {
        if (d['FIPS'] != undefined) {
          // extract only c_fips and per_capita (or total)
          let currentEntry = {
            fips: d['FIPS'],
            cmsID: d['CMS Facility ID'],
            latitude: d['Latitude'],
            longitude: d['Longitude'],
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
            COLLECTIONS: d['Collection policies available online?'],
            COLLECTIONS_LINK: d['Collections link'],
            REPORTED: d['Can patients be reported to credit bureaus?'],
            DEBT: d["Can patients' debts be sold?"],
            DISCOUNT: d["Qualifying income for discounted care"],
            FREE: d["Qualifying income for free care"],
            SUED: d['Can patients be sued or subject to wage garnishment or property liens?'],
            SCORECARD: d['Scorecard notes'],
            PUBLIC: d['Public university system?'],
            USNEWS: d['US News top 20?'],
            DENIED: d['Can patients with debt be denied nonemergency care?'],
          }
          //create all the data in countyToFIPSCode
          //set d[FIPS] to a variable. if it has 4 digits, add a 0 to the front. if it has 5 digits, leave it alone
          let fipsCode = d['FIPS'];
          let cmsID = d['CMS Facility ID'];
          if (fipsCode.toString().length < 5) {
            fipsCode = '0' + fipsCode;
          }
          dataForModal[fipsCode] = currentEntry; // add to the original data
          dataForModalCMS[cmsID] = currentEntry; // add to the original data

          if (countyToFIPSCode.find(d => d['fips'] === fipsCode) === undefined) {
            countyToFIPSCode.push(currentEntry);
          }
        }
      });

      let dataLatLong = data;

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

      // define the projection function
      const projection = d3.geoAlbersUsa()
        .scale(1280)
        .translate([width / 2.66, height / 2.6]);

      let key = d3.select("#keyHTMLContainer");
      key.html(`<div id="keyContainer"><p class="keyDescription">Which hospitals will deny nonemergency medical care to patients with past-due bills?</p><div id="key"><div id="keyWrapper"><div id="keyTextWrapper"><div data-selection="Yes" style="display: inline-flex;"><div style="width: 20px; height: 20px; background-color: rgb(183, 3, 3); float: left; margin-right: 5px; margin-top: 0px;"></div><p>Yes, will deny medical care</p></div><div data-selection="Other" style="display: inline-flex;"><div style="width: 20px; height: 20px; background-color: #8E7B92; float: left; margin-right: 5px; margin-top: 0px;"></div><p>Unclear</p></div><div data-selection="No" style="display: inline-flex;"><div style="width: 20px; height: 20px; background-color: #631D6F; float: left; margin-right: 5px; margin-top: 0px;"></div><p>No, doesn't deny care</p></div></div><div id="keyBarGraph2"><div id="YesBar2" data-selection="Yes" style="height: 20px; width: 17.0455%; margin-bottom: 3px; background-color: rgb(183, 3, 3);"><span style="color: white; font-size: 12px; font-weight: bold; margin-left: 3px;">90</span></div><div id="UnclearBar2" data-selection="Other" style="height: 20px; width: 23.8636%; margin-bottom: 3px; background-color: #8E7B92;"><span style="color: white; font-size: 12px; font-weight: bold; margin-left: 3px;">126</span></div><div id="NoBar2" data-selection="No" style="height: 20px; width: 59.0909%; margin-bottom: 3px; background-color: #631D6F;"><span style="color: white; font-size: 12px; font-weight: bold; margin-left: 3px;">312</span></div></div></div></div></div>`)

      // plot the circles using the projection function to convert the latitude/longitude coordinates to x/y coordinates
      svg.select("g")
        .selectAll("circle")
        .data(dataLatLong)  // use the latitude/longitude data
        .join("circle")
        .transition()
        .attr('class', function (d) {
          //check to see if d.id's length is 4 or 5. if it's 4, add a 0 to the front of it. otherwise, just return d.id
          return 'hoverable ' + d['CMS Facility ID'];
        })
        .ease(d3.easeLinear)
        .attr("transform", function (d) {
          return `translate(${projection([d.Longitude, d.Latitude])})`;
        })  // use the projection function to convert the latitude/longitude coordinates to x/y coordinates
        .attr("fill", function (d) {
          let currentAnswer = d['Can patients with debt be denied nonemergency care?']
          //check if yes is a substring of the current answer. if it is, return red. if not, return blue
          if (currentAnswer.toLowerCase().includes('yes')) {
            return '#b70303';
          } else if (currentAnswer.toLowerCase().includes('no')) {
            return '#631D6F';
          } else {
            return '#8E7B92';
          }
        })
        .attr("data-fips", function (d) { return d.id })
        .attr("data-state", function (d) {
          return d['State']
        })
        .attr("data-cmsID", function (d) {
          return d['CMS Facility ID']
        })
        .attr("data-CITY", function (d) {
          return d['City']
        })
        .attr("data-hospitalType", function (d) {
          return d['Hospital type']
        })
        .attr("data-beds", function (d) {
          return d['Beds']
        })
        .attr("data-FAP", function (d) {
          return d['Financial Assistance Policy available online?']
        })
        .attr("data-FAPLINK", function (d) {
          return d['FAP link']
        })
        .attr("data-COLLECTIONS", function (d) {
          return d['Collection policies available online?']
        })
        .attr("data-COLLECTIONS_LINK", function (d) {
          return d['Collection policies available online?']
        })
        .attr("data-REPORTED", function (d) {
          return d['Can patients be reported to credit bureaus?']
        })
        .attr("data-DEBT", function (d) {
          return d["Can patients' debts be sold?"]
        })
        .attr("data-SUED", function (d) {
          return d['Can patients be sued or subject to wage garnishment or property liens?']
        })
        .attr("data-DENIED", function (d) {
          return d['Can patients with debt be denied nonemergency care?']
        })
        .attr("data-FREE", function (d) {
          return d['Qualifying income for free care']
        })
        .attr("data-SCORECARD", function (d) {
          return d['Scorecard notes']
        })
        .attr("data-FINASSIST", function (d) {
          return d['Info on financial assistance available with "financial assistance" search?']
        })
        .attr("data-ASSETS", function (d) {
          return d['Assets considered?']
        })
        .attr("data-LIENS", function (d) {
          return d['Places liens or garnishes wages?']
        })
        .attr("data-AID", function (d) {
          return d['Aid for patients with large bills?']
        })
        .attr("data-NAME", function (d) {
          return d['Name']
        })
        .attr("data-SYSTEM", function (d) {
          return d['System']
        })
        .attr("data-DISCOUNT", function (d) {
          return d['Qualifying income for discounted care']
        })
        .attr("data-PUBLIC", function (d) {
          return d['Public university system?']
        })
        .attr("data-USNEWS", function (d) {
          return d['US News top 20?']
        })
        .attr("r", d => radius(''));
      //write a sql query that will read in the data where teh year column in 2020

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
          tooltipHandlers.mouseEnter(d.pageX, d.pageY, d.srcElement, dataForModal, dataForModalCMS)
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
        .selectAll("circle")
        .attr("data-state", function (d) {
          let currentEntry = dataForModal[d.id]
          if (currentEntry) {
            return currentEntry.state
          }
          else
            return 'none'
        })

      const sortedData = Object.values(dataForModalCMS).sort(function (a, b) {
        if (a['state'] < b['state']) {
          return -1;
        }
        if (a['state'] > b['state']) {
          return 1;
        }
        if (a['state'] == b['state']) {
          if (a['CITY'] < b['CITY']) {
            return -1;
          }
          if (a['CITY'] > b['CITY']) {
            return 1;
          }
          return 0;
        }
      });


      for (const entry in sortedData) {
        let currentEntry = sortedData[entry]
        let sideColumnDiv = document.createElement("div");
        sideColumnDiv.className = "sideColumnHospital";
        sideColumnDiv.setAttribute("data-fips", currentEntry['fips'])
        sideColumnDiv.setAttribute("data-city", currentEntry['CITY'])
        sideColumnDiv.setAttribute("data-state", currentEntry.state)
        sideColumnDiv.setAttribute("data-cmsID", currentEntry['cmsID'])
        sideColumnDiv.setAttribute("data-hospitalType", currentEntry.HOSPITAL_TYPE)
        sideColumnDiv.setAttribute("data-beds", currentEntry.Beds)
        sideColumnDiv.innerHTML = `<div class="hoverableContent ${currentEntry.fips}"><div><b>${currentEntry.NAME}</b> </div><div>${currentEntry.CITY}, ${currentEntry.state}</div><div>${currentEntry.SYSTEM}</div></div>`
        fixedSideColumn.appendChild(sideColumnDiv);
      }

      //create close button and append it as a child to the modal element
      svg
        .selectAll("circle")
        .on("click", function (d) {
          modalFunctions.clickCircle(d.srcElement, dataForModal, dataForModalCMS)
        })

      /*
      ------------------------------
      SECTION: hover over each of the sections in the side column. Attach hover and click events to each of the elements that bring up the modal
      ------------------------------
      */
      let hoverableContent1 = document.getElementsByClassName("sideColumnHospital");

      for (let i = 0; i < hoverableContent1.length; i++) {
        hoverableContent1[i].addEventListener("mousemove", function (d) {
          //get the current fips code

          let currentFips = d.target.getAttribute("data-fips")
          let currentCMS = d.target.getAttribute("data-cmsID")
          //if fips has four digits, add a 0 to the front
          if (currentFips.length == 4) {
            currentFips = "0" + currentFips
          }
          //get the current circle
          let currentCircle = document.querySelector(`circle[data-cmsID="${currentCMS}"]`)
          if (currentCircle) {
            //get position of the circle
            let circlePosition = currentCircle.getBoundingClientRect()
            //get the x position of the circle
            tooltipHandlers.mouseEnter(circlePosition.x, circlePosition.y - 100, currentCircle, dataForModal, dataForModalCMS)
          }
        })
        hoverableContent1[i].addEventListener("mouseout", function (d) {
          let currentFips = d.target.getAttribute("data-fips")
          let currentCMS = d.target.getAttribute("data-cmsID")
          if (currentFips.length == 4) {
            currentFips = "0" + currentFips
          }
          let currentCircle = document.querySelector(`circle[data-cmsID="${currentCMS}"]`)
          if (currentCircle) {
            tooltipHandlers.mouseOut(currentCircle)
          }
        })
        hoverableContent1[i].addEventListener("click", function (d) {
          let currentFips = d.target.getAttribute("data-fips")
          let currentCMS = d.target.getAttribute("data-cmsID")
          if (currentFips.length == 4) {
            currentFips = "0" + currentFips
          }
          let currentCircle = document.querySelector(`circle[data-cmsID="${currentCMS}"]`)
          if (currentCircle) {
            modalFunctions.clickCircle(currentCircle, dataForModal, dataForModalCMS)
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
      //fire the click event for the DENIED button, click, then click again after 3 seconds after the page loads
      let deniedButton = document.getElementById("DENIED")
      //after the page loads, click the denied button
      deniedButton.click();
      window.addEventListener("load", function () {
        setTimeout(function () {
          deniedButton.click();
        }, 500);
      });


      //call the policy dropdown change handler so the circles are changed to the default policy on page load
      child.sendHeight();
      window.addEventListener("resize", () => child.sendHeight());
      deniedButton.click();
    })
    .catch(function (error) {
      console.log(error);
    });
});
