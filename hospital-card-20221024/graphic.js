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
  function update(svg, us, radius) {
    let path = d3.geoPath();
    let originalData = {}

    d3.csv('https://raw.githubusercontent.com/juweek/datasets/main/hospital_data_filtered_2.csv').then(function(data) {
		data.forEach(function(d) {
			// extract only c_fips and per_capita (or total)
			d.total = +d.total;
			d.per_capita = +d.per_capita
      let currentEntry = {
        total: d.total,
        per_capita: d.per_capita,
        hospitalName: d.county,
        state: d.state
      }
      delete d['county'];
			delete d['state'];
			delete d['total'];
			console.log(d)
      originalData[d.c_fips] = currentEntry; // add to the original data
		});
	
		// transform data to Map of c_fips => per_capita
		data = data.map(x => Object.values(x));
    data = new Map(data);
		
		let format = d3.format(",.7f");
		// radius = d3.scaleSqrt([0, d3.quantile([...data.values()].sort(d3.ascending), 0.985)], [0, 10])

		svg.select("g")
			.selectAll("circle")
			.data(topojson.feature(us, us.objects.counties).features
			.map(d => (d.value = data.get(d.id), d))
			.sort((a, b) => b.value - a.value))
		.join("circle")
			.transition()
			.duration(1000)
			.ease(d3.easeLinear)
			.attr("transform", d => `translate(${path.centroid(d)})`)
			.attr("r", d => radius(d.value));

		svg.select("g")
			.selectAll("circle")
			.append("title")
			.text(d => `${d.properties.name}${format(d.value)}`);

      // Create tooltip div and make it invisible
      let tooltip = d3
        .select("#svganchor")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // move tooltip
      svg
        .selectAll(".state")
        .on("mousemove", function (d) {
          //console.log(originalData)
          let currentEntry = originalData[d.srcElement.__data__.id]
          tooltip
            .style("opacity", 1)
            .style("left", d.pageX + "px")
            .style("top", d.pageY + "px")
            .html(
              `<div class="tooltip__hospital">${currentEntry.hospitalName} Hospital </div><div class="tooltip__value">${d.srcElement.__data__.value}</div><div class="tooltip__name">${d.srcElement.__data__.properties.name}, ${currentEntry.state}</div>`
            );
        })
        .on("mouseout", function (_) {
          tooltip.style("opacity", 0);
        });
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
