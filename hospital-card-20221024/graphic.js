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
  const margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

    /*
------------------------------
METHOD: object to hold the state abbreviations
------------------------------
*/
  let states = {
    all: "All",
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
METHOD: object to hold the state abbreviations
------------------------------
*/
let policies = {
  "Financial Assistance Policy available online?": "FAP",
  "Collections policies available online?": "COLLECTIONS",
  "Patients can be reported to credit bureaus?": "REPORTED",
  "Patients' debts can be sold?": "DEBT",
  "Patients can be sued or subject to wage garnishment or property liens?": "SUED",
  "colPatients with debt can be denied non-emergency care?orado": "DENIED"
}

/*
------------------------------
SECTION: create the dropdown and populate it with list of policies
------------------------------
*/
  let dropdownPolicy = d3.select("#svganchor").append("select");
  let dropdownOptions = dropdownPolicy
    .selectAll("option")
    .data(Object.keys(policies))
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  
/*
------------------------------
SECTION: create the dropdown and populate it with state names
------------------------------
*/
    //create a dropdown menu that allows the user to select a state that will then redraw the d3 map
    let dropdown = d3
    .select("#fixedSideColumn")
    .append("select")
    .attr("name", "name-list");


      //populate the dropdown with a list of state names
      let options = dropdown
      .selectAll("option")
      .data(Object.keys(states))
      .enter()
      .append("option")
      .text(function (d) {
        return d;
      });

         /*
------------------------------
METHOD: add an event listener to the dropdown that retrieves the state abbreviation and checks it ahainst the d3 circle data attributes and the list of hospitals in the side column
------------------------------
*/
dropdown.on("change",function(){
  let circles = document.getElementsByTagName("circle");

  for (let i = 0; i < circles.length; i++) {
      circles[i].style.opacity = "1";
    }

  if (this.value == "all") {
    let hospitals = document.getElementsByClassName("sideColumnHospital");
    for (let i = 0; i < hospitals.length; i++) {
        hospitals[i].style.display = "block";
      }
    return;
  }

  else {
    let selectedState = d3.select(this).property("value");
    let stateAbbr = states[selectedState];  
    for (let i = 0; i < circles.length; i++) {
      let currentState = circles[i].getAttribute("data-state")
      if (currentState != stateAbbr) {
        circles[i].style.opacity = "0.1";
      } else {
        circles[i].style.opacity = "1";
      }
    }
    let hospitals = document.getElementsByClassName("sideColumnHospital");
    for (let i = 0; i < hospitals.length; i++) {
      let currentState = hospitals[i].getAttribute("data-state")
      if (currentState != stateAbbr) {
        hospitals[i].style.display = "none";
      } else {
        console.log('yes')
        hospitals[i].style.display = "block";
      }
    }
  }
})

        /*
------------------------------
METHOD: add an event listener to the policy dropdown that retrieves the policy abbreviation and checks it against the d3 circle data attributes
------------------------------
*/
dropdownPolicy.on("change",function(){
  let circles = document.getElementsByTagName("circle");

  for (let i = 0; i < circles.length; i++) {
      circles[i].style.fill = "#333";
    }
  let selectedPolicy = d3.select(this).property("value");
  let policyAbbr = policies[selectedPolicy];
  for (let i = 0; i < circles.length; i++) {
    let currentPolicy = circles[i].getAttribute("data-"+ policyAbbr)
    if (currentPolicy == "Yes") {
      circles[i].style.fill = "blue";
    } else if(currentPolicy == "No") {
      circles[i].style.fill = "red";
    }
    else {
      circles[i].style.fill = "purple";
    }
  }

  let listOfSideColumnItems = document.getElementsByClassName("sideColumnHospital");
  for (let i = 0; i < listOfSideColumnItems.length; i++) {
    console.log(listOfSideColumnItems[i])
  }
})


  /*
------------------------------
METHOD: fetch the data and draw the chart
------------------------------
*/
  function update(svg, us, radius) {
    let path = d3.geoPath();
    let originalData = {}

    d3.csv('./hospitalScores.csv').then(function(data) {
		data.forEach(function(d) {
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
      originalData[d.c_fips] = currentEntry; // add to the original data
		});
	
		// transform data to Map of c_fips => per_capita
		data = data.map(x => Object.values(x));
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
      .attr('class', function (d) { return "hoverableContent " + d.id})
      .attr("fill", "#000")
      .attr("data-fips", function (d) { return d.id})
      .attr("data-state", function (d) { 
        let id = d.id
        if (originalData[id]) {
          return originalData[id].state
        }
        else {
          return 'none'
        }
      })
      .attr("data-hospitalType", function (d) { 
        let id = d.id
        if (originalData[id]) {
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
          return originalData[id].FAP
        }
        else {
          return 'none'
        }
      })
      .attr("data-COLLECTIONS", function (d) { 
        let id = d.id
        if (originalData[id]) {
          return originalData[id].COLLECTIONS
        }
        else {
          return 'none'
        }
      })
      .attr("data-REPORTED", function (d) { 
        let id = d.id
        if (originalData[id]) {
          return originalData[id].REPORTED
        }
        else {
          return 'none'
        }
      })
      .attr("data-DEBT", function (d) { 
        let id = d.id
        if (originalData[id]) {
          return originalData[id].DEBT
        }
        else {
          return 'none'
        }
      })
      .attr("data-SUED", function (d) { 
        let id = d.id
        if (originalData[id]) {
          return originalData[id].SUED
        }
        else {
          return 'none'
        }
      })
      .attr("data-DENIED", function (d) { 
        let id = d.id
        if (originalData[id]) {
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

/*
------------------------------
SECTION: add a tooltip
------------------------------
*/ 
      let tooltip = d3
        .select("#svganchor")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // move tooltip
      svg
        .selectAll(".state")
        .on("mousemove", function (d) {
          let currentEntry = originalData[d.srcElement.__data__.id]
          let currentElement = d.srcElement
          currentElement.classList.add("hovered")
          tooltip
            .style("opacity", 1)
            .style("left", (d.pageX - 150) + "px")
            .style("top", (d.pageY - 100) + "px")
            .html(
              `<div class="tooltip__hospital">${currentEntry.hospitalName} Hospital </div><div class="tooltip__value">${d.srcElement.__data__.value}</div><div class="tooltip__name">${d.srcElement.__data__.properties.name}, ${currentEntry.state}</div>`
            );
        })
        .on("mouseout", function (d) {
          tooltip.style("opacity", 0);
          let currentElement = d.srcElement
          currentElement.classList.remove("hovered")
        });

/*
------------------------------
SECTION: build out and populate the side column
------------------------------
*/ 
      let fixedSideColumn = document.getElementById("fixedSideColumn");

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
          newDiv.setAttribute("data-fips", currentEntry.c_fips)
          newDiv.setAttribute("data-county", currentEntry.county)
          newDiv.setAttribute("data-state", currentEntry.state)
          newDiv.setAttribute("data-hospitalType", currentEntry.HOSPITAL_TYPE)
          newDiv.setAttribute("data-beds", currentEntry.Beds)
          newDiv.innerHTML = `<div class="hoverableContent ${currentEntry.fips}"><div><b>${currentEntry.hospitalName} Hospital</b> </div><div>${currentEntry.Beds} beds</div><div>${currentEntry.county}, ${currentEntry.state}</div></div>`
          fixedSideColumn.appendChild(newDiv);
        }

        let hoverableContent = document.getElementsByClassName("hoverableContent");

/*
------------------------------
SECTION: create a modal that pops up when a d3 circle is clicked on. The modal should have the hospital name, the county name, the state name, and the total number of opioid prescriptions. 
------------------------------
*/ 
let modal = d3
.select("#fixedSideColumn")
.append("div")
.attr("class", "modal")
.append("div")
.attr("class", "close")

let modalContent = d3
.select(".modal")
.append("div")
.attr("class", "modalContent")

//attach a close event handler to the close button
let closeButton = d3
.select(".modal")
.on("click", function (d) {
  let modalElement = document.getElementsByClassName("modal")[0]
  modalElement.classList.remove("clicked")
  })

//creeate close button and append it as a child to the modal element
svg
.selectAll("circle")
.on("click", function (d) {
  let currentEntry = originalData[d.srcElement.__data__.id]
  let currentElement = d.srcElement
  let modalElement = document.getElementsByClassName("modal")[0]
  modalElement.classList.add("clicked")
  modalContent.html(
    `<div class="modal__hospital">${currentEntry.hospitalName} Hospital </div>
    <div class="modal__value">${d.srcElement.__data__.value}</div>
    <div class="modal__name">${d.srcElement.__data__.properties.name}, ${currentEntry.state}</div>
    <div class="modal__beds">${currentEntry.HOSPITAL_TYPE} hospital</div>
    <div class="modal__beds">${currentEntry.Beds} beds</div>`
  )})

for (let i = 0; i < hoverableContent.length; i++) {
  hoverableContent[i].addEventListener("click", function (e) {
    let currentEntry = originalData[e.target.classList[1]]
    modal
      .style("opacity", 1)
  })}


        /*
------------------------------
SECTION: hover over the section and find the corresponding circle with the same data-fips attribute. then, call the hover event handler on the circle
------------------------------
*/ 
        for (let i = 0; i < hoverableContent.length; i++) {
          hoverableContent[i].addEventListener("mousemove", function(d) {
            d.target.parentElement.parentElement.style.opacity = ".7";
            let currentHospital = document.getElementsByClassName("sideColumnHospital");
            let currentFIPs = currentHospital[0].getAttribute("data-fips");
            let currentCircle = document.querySelector(`[data-fips="${currentFIPs}"]`);
            currentCircle.dispatchEvent(new MouseEvent("mousemove"));
            console.log(currentCircle)
          });
          hoverableContent[i].addEventListener("mouseout", function(d) {
            d.target.parentElement.parentElement.style.opacity = "1";
          });
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

      let radius = d3.scaleSqrt([0, 10], [10, 10]);

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
      child.sendHeight();

      window.addEventListener("resize", () => child.sendHeight());
    })
    .catch(function (error) {
      console.log(error);
    });
});