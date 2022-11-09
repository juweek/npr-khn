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
SECTION: create the dropdown and populate it with state names
------------------------------
*/
    //create a dropdown menu that allows the user to select a state that will then redraw the d3 map
    let dropdown = d3
    .select("#svganchor")
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
METHOD: add an event listener to the dropdown that retrieves the state abbreviation and checks it ahainst the d3 circle elements
------------------------------
*/
dropdown.on("change",function(){
  let selectedState = d3.select(this).property("value");
  let stateAbbr = states[selectedState];  
  let circles = d3.selectAll("circle");
  circles.each(function(d){
    if(d.properties.state == stateAbbr){
      console.log("found a match")
      d3.select(this).style("fill", "red");
    }      
})
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
        state: d.state
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
SECTIOM: draw the map with the circles; attach the appropriate data to each circle
------------------------------
*/ 

		svg.select("g")
			.selectAll("circle")
			.data(topojson.feature(us, us.objects.counties).features
			.map(d => {
        d.value = data.get(d.id), d;
        console.log(d.value)
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
      .attr("data-valid", function (d) { return d.value})
      .attr("data-fips", function (d) { return d.id})
      .attr("data-state", function (d) { 
        let id = d.id
        if (originalData[id]) {
          console.log('================')
          console.log(id)
          return originalData[id].state
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
SECTIOM: build out and populate the side column
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
          newDiv.innerHTML = `<div class="hoverableContent ${currentEntry.fips}"><div>${currentEntry.hospitalName} Hospital </div><div>${currentEntry.total}</div><div>${currentEntry.state}</div></div>`
          fixedSideColumn.appendChild(newDiv);
        }

        let hoverableContent = document.getElementsByClassName("hoverableContent");

        /*
------------------------------
SECTION: hover over the section and highlight the circle/show the tooltip box
------------------------------
*/ 
        for (let i = 0; i < hoverableContent.length; i++) {
          hoverableContent[i].addEventListener("mousemove", function(d) {
            let currentClass = this.className.split(" ")[1];
            d.target.parentElement.parentElement.style.opacity = ".7";
            d.target.parentElement.parentElement.style.backgroundColor = "";
            let currentZip = document.getElementsByClassName(currentClass);
            let currentCircle = currentZip[1];
            currentCircle.setAttribute("fill", "red")
            tooltip
            .style("opacity", 1)
            .style("left", (currentCircle.getBoundingClientRect().x - 200) + "px")
            .style("top", (currentCircle.getBoundingClientRect().y - 100) + "px")
            .html(
              `<div class="tooltip__hospital">Tooltip info</div>`
            );

          });
          hoverableContent[i].addEventListener("mouseout", function(d) {
            let currentClass = this.className.split(" ")[1];
            let currentZip = document.getElementsByClassName(currentClass);
            let currentCircle = currentZip[1];
            currentCircle.setAttribute("fill", "#000")
            tooltip.style("opacity", 0);
            d.target.parentElement.parentElement.style.opacity = "1";
            d.target.parentElement.parentElement.style.backgroundColor = "white";
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
