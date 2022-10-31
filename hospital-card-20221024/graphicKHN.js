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
    d3.csv("./medicalState.csv").then(function (data) {
      data.forEach(function (d) {
        // extract only c_fips and per_capita (or total)
        d.avg_medical_debt = d.avg_medical_debt + ":" + d.pc_collections;
        delete d["county"];
        delete d["state"];
        delete d["total"];
        delete d["per_capita"];
        delete d["pc_collections"];
        delete d["state_name"];
        delete d["per_capita"];
      });

      // transform data to Map of c_fips => per_capita
      data = data.map((x) => Object.values(x));
      data = new Map(data);

      console.log(data);

      let path = d3.geoPath();

      let format = d3.format(",.7f");
      // radius = d3.scaleSqrt([0, d3.quantile([...data.values()].sort(d3.ascending), 0.985)], [0, 10])

      svg
        .select("g")
        .selectAll("circle")
        .data(
          topojson
            .feature(us, us.objects.states)
            .features.map((d) => ((d.value = data.get(d.id)), d))
            .sort((a, b) => b.value - a.value)
        )
        .join("circle")
        .attr("transform", (d) => `translate(${path.centroid(d)})`)
        .attr("r", function (d) {
          let medicalDebt = d.value.split(":");
          return radius(medicalDebt[0]);
        })
        .attr("fill", (d) => {
          let medicalDebt = d.value.split(":");
            if (parseInt(medicalDebt[0]) > 1000) {
              return "#B47C82";
            } else if (parseInt(medicalDebt[0]) > 700) {
              return "#E87E71";
            } else {
              return "#FEECE5";
            }
        })
        .attr("data-coordinates", (d) => `${path.centroid(d)}`);
      //.attr("r", 5);

      svg
        .select("g")
        .selectAll("circle")

      // Create tooltip div and make it invisible
      let tooltip = d3
        .select("#svganchor")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      svg
        .selectAll(".state")
        .on("mousemove", function (d) {
          let medicalDebt = d.value.split(":");
          tooltip
            .html(
              `<div class="tooltip__title">${states[d.properties.name]}</div><div class="tooltip__body">$${format(
                medicalDebt[0]
              )}</div><div class="tooltip__body">Collections: $${format(
                medicalDebt[1]
              )}</div>`
            )
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY - 28 + "px")
            .style("opacity", 1);
        })
        .on("mouseout", function (_) {
          tooltip.style("opacity", 0);
        });

      svg
        .select("g")
        .selectAll("text")
        .data(
          topojson
            .feature(us, us.objects.states)
            .features.map((d) => ((d.value = data.get(d.id)), d))
            .sort((a, b) => b.value - a.value)
        )
        .join("text")
        .attr("class", "textArea")
        .attr("fill", "#000")
        .attr("stroke", "none")
        .attr("transform", (d) => `translate(${path.centroid(d)})`)
        .attr("data-coordinates", (d) => `${path.centroid(d)}`)
        .text(function (d) {
          let a = d.properties.name
            .trim()
            .replace(/[^\w ]/g, "")
            .toLowerCase(); //Trim, remove all non-word characters with the exception of spaces, and convert to lowercase
          if (states[a] !== null) {
            return states[a];
          } else {
            return d.properties.name;
          }
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

      let radius = d3.scaleSqrt([450, 1100], [12, 45]);

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
        .text(d3.format(".4"));

      update(svg, us, radius);
      child.sendHeight();

      window.addEventListener("resize", () => child.sendHeight());
    })
    .catch(function (error) {
      console.log(error);
    });
});
