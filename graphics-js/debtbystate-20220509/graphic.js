var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");

pym.then(child => {

    /*
------------------------------
METHOD: set the size of the canvas
------------------------------
*/
const width = 1300 // Chart width
const height = 800 // Chart height
const margin = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

//create a row of three HTML buttons 


/*
------------------------------
METHOD: fetch the data and draw the chart 
------------------------------
*/
function update(svg, us, radius) {
	d3.csv('https://raw.githubusercontent.com/juweek/datasets/main/medicalState.csv').then(function(data) {
		data.forEach(function(d) {
			// extract only c_fips and per_capita (or total)
			d.total = +d.avg_medical_debt;
			d.per_capita = +d.avg_medical_debt
			delete d['county'];
			delete d['state'];
			delete d['total'];
			delete d['per_capita'];
			delete d['pc_collections'];
			delete d['state_name'];
			// delete d['per_capita'];
		});
	
		// transform data to Map of c_fips => per_capita
		data = data.map(x => Object.values(x));
		data = new Map(data);

        let path = d3.geoPath();


		
		let format = d3.format(",.7f");
		// radius = d3.scaleSqrt([0, d3.quantile([...data.values()].sort(d3.ascending), 0.985)], [0, 10])

		svg.select("g")
			.selectAll("circle")
			.data(topojson.feature(us, us.objects.states).features
			.map(d => (d.value = data.get(d.id), d))
			.sort((a, b) => b.value - a.value))
		.join("circle")
			.attr("transform", d => `translate(${path.centroid(d)})`)
			.attr("r", d => radius(d.value));
			//.attr("r", 5);

		svg.select("g")
			.selectAll("circle")
			.append("title")
			.text(d => `${d.properties.name}${format(d.value)}`);

	});
}


/*
------------------------------
METHOD: load in the map
------------------------------
*/
d3.json("https://raw.githubusercontent.com/xuanyoulim/fcc-internet-complaints-map/master/counties-albers-10m.json").then(function(us){
	let path = d3.geoPath();

	const svg = d3.select("#svganchor").append("svg")
					.attr("viewBox", [-10, 0, 975, 610]);


	// outline us map
	svg.append("path")
		.datum(topojson.feature(us, us.objects.nation))
		.attr("fill", "#ccc")
		.attr("d", path);

	// outline state border
	svg.append("path")
		.datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
		.attr("fill", "none")
		.attr("stroke", "white")
		.attr("stroke-linejoin", "round")
		.attr("d", path);

	// for circle
	svg.append("g")
		.attr("fill", "#2FACD3")
        .attr("class", "state")
		.attr("fill-opacity", 0.5)
		.attr("stroke", "#fff")
		.attr("stroke-width", 0.5)

	let radius = d3.scaleSqrt([450, 1100], [0, 45]);

	const legend = svg.append("g")
	.attr("fill", "#777")
	.attr("transform", "translate(925,608)")
	.attr("text-anchor", "middle")
	.style("font", "10px sans-serif")
  .selectAll("g")
	.data([0.001, 0.005, 0.01])
  .join("g");

	legend.append("circle")
	.attr("fill", "none")
	.attr("stroke", "#ccc")
	.attr("cy", d => -radius(d))
	.attr("r", radius);

	legend.append("text")
	.attr("y", d => -2 * radius(d))
	.attr("dy", "1.3em")
	.text(d3.format(".4"));

    // Create tooltip div and make it invisible
	let tooltip = d3.select("#svganchor").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

	d3.selectAll(".state").on("mousemove", function(d) {
		tooltip.html(`<strong>State: ${d.target.__data__.id}</strong><br>
					  <strong>Avg amount of medical debt: X,XX</strong>`)
			.style('top', (d.pageY - 12) + 'px')
			.style('left', (d.pageX + 25) + 'px')
			.style("opacity", 0.9);

		xLine.attr("x1", d3.select(this).attr("cx"))
			.attr("y1", d3.select(this).attr("cy"))
			.attr("y2", (height - margin.bottom))
			.attr("x2",  d3.select(this).attr("cx"))
			.attr("opacity", 1);

	}).on("mouseout", function(_) {
		tooltip.style("opacity", 0);
		xLine.attr("opacity", 0);
	});

	update(svg, us, radius);
	child.sendHeight();

    window.addEventListener("resize", () => child.sendHeight());
})
.catch(function(error){
	console.log(error);
});

});
