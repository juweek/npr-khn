import { policies } from './object';

//load in radar-chart.js
import { RadarChart } from './radar-chart';

/*
------------------------------
Export the modal and the close button
------------------------------
*/
export const modalFunctions = {
    // When the user enters the tooltip
    closeCircle: function () {
        let modalElement = document.getElementsByClassName("modal")[0]
        modalElement.classList.remove("clicked")

        d3.select(".modal").remove()
    },
    /*
    ------------------------------
    METHOD: show the information in the modal
    ------------------------------
    */
    clickCircle: function (currentElement, originalData, originalDataCMS) {
        //empty out the modalContent, if it exists
        d3.select(".modal").remove()
        let modal = d3
            .select("#fixedSideColumnTop")
            .append("div")
            .attr("class", "modal")
            .append("div")
            .attr("class", "close")

        let closeButton = d3
            .select(".close")
            .on("click", function (d) {
                modalFunctions.closeCircle()
            })

        let modalContent = d3
            .select(".modal")
            .append("div")
            .attr("class", "modalContent")

        let currentEntry = originalData[currentElement.__data__.id]
        let currentCMS = currentElement.getAttribute('data-cmsID')
        let cmsEntry = originalDataCMS[currentCMS]
        let modalElement = document.getElementsByClassName("modal")[0]
        modalElement.classList.add("clicked")

        //choose a random color between red, blue or purple in one line
        let randomColor = ["red", "blue", "purple"][Math.floor(Math.random() * 3)]


        //empty out the modalContent
        modalContent.html(
            `
            <h2 class="modalTitle">${currentElement.getAttribute("data-NAME")}</h2>
            <div class="introContainer">
            <div class="modalContentGroup introText">
            <h3 class="modalTitle"> </h3>
            <div class="modal__text"><b>Location:</b> <span class="cardLocation">${currentElement.getAttribute("data-CITY")}, ${currentElement.getAttribute("data-state")}</span></div>
            ${currentElement.getAttribute("data-SYSTEM") ? `<div class="modal__text"><b>System:</b> <span class="cardLocation">${currentElement.getAttribute("data-SYSTEM")}</span></div>` : ""}
            <div class="modal__text"><b>Hospital type: </b> <span class="cardLocation">${currentElement.getAttribute("data-hospitalType")}</span></div>
            <div class="modal__text"><b>Beds:</b> <span class="cardLocation">${currentElement.getAttribute("data-beds")}</span></div>
            ${currentElement.getAttribute("data-PUBLIC") ? `<div class="modal__text"><b>Public university system?</b> <span class="cardLocation">Yes</span></div>` : ""}
            ${currentElement.getAttribute("data-USNEWS") ? `<div class="modal__text"><b>US News top 20?</b> <span class="cardLocation">Yes</span></div>` : ""}
            </div>
            <div class="modalContentGroup introImage">
                <div id="radarChart"></div>
            </div>
            </div>
            <div class="modalContentGroupWrap">
            <div class="modalContentGroup financialAssistance">
            <h3 class="modalTitle">Financial assistance:</h3>
            <div class="modal__text"><span>Who qualifies for free care?</span> <span>${currentElement.getAttribute("data-FREE")}</span></div>
            <div class="modal__text"><span>Who qualifies for discounted care?</span> <span>${currentElement.getAttribute("data-DISCOUNT")}</span></div>
            <div class="modal__text"><span>Provides aid to patients with very large medical bills?</span> <span>${currentElement.getAttribute("data-AID")}</span></div>
            <div class="modal__text"><span>Financial Assistance Policy available online?</span> 
            <span>
                ${currentElement.getAttribute("data-FAPLINK") !== null && currentElement.getAttribute("data-FAPLINK") !== undefined && currentElement.getAttribute("data-FAPLINK") !== ""  ?
                    `<u><a href="${currentElement.getAttribute("data-FAPLINK")}">${currentElement.getAttribute("data-FAP")}</a></u>` :
                    `${currentElement.getAttribute("data-FAP")}`
                 }
            </span>
            </div>
            </div>
            <div class="modalContentGroup billingCollections">
            <h3 class="modalTitle">Billing and collections:</h3>
            <div class="modal__text"><span>Allows reporting of patients to credit rating agencies?</span><span>${currentElement.getAttribute("data-REPORTED")}</span></div>
            <div class="modal__text"><span>Allows sale of patient debt?</span> <span>${currentElement.getAttribute("data-DEBT")}</span></div>
            <div class="modal__text"><span>Allows nonemergency care to be restricted for patients with debt?</span> <span>${currentElement.getAttribute("data-DENIED")}</span></div>
            <div class="modal__text"><span>Allows lawsuits against patients, liens, or wage garnishment?</span> <span>${currentElement.getAttribute("data-SUED")}</span></div>
            <div class="modal__text"><span>Collection policies available online?</span> 
            <span>
                ${cmsEntry.COLLECTIONS_LINK !== null && cmsEntry.COLLECTIONS_LINK !== undefined && cmsEntry.COLLECTIONS_LINK !== "" ?
                    `<u><a href="${cmsEntry.COLLECTIONS_LINK}">${currentElement.getAttribute("data-COLLECTIONS")}</a></u>` :
                    `${currentElement.getAttribute("data-COLLECTIONS")}`
                 }
            </span>
            </div>
            </div>
            </div>
            <div class="modalContentGroup">
            <h3 class="modalTitle">Scorecard notes:</h3>
            <div class="modal__text">${currentElement.getAttribute("data-SCORECARD")}</div>
            <div class="modal__text">Note on data: Information is from written policies, unless otherwise noted. However, hospital policies and practices change. Over time hospitals close, change names, or merge with other institutions. If KHN learns that an entry is no longer accurate, it will update information that it verifies.</div>
            <div class="keyBlockSub">
            </div>
            </div>`
        )
        //this.createRadarChart(currentElement, originalData)
        this.createQuadrant(currentElement, originalData)
    },
    /*
    ------------------------------
    METHOD: create the radar chart and append it to the modal
    ------------------------------
    */
    createRadarChart: function (currentElement, originalData) {
        const NUM_OF_SIDES = 7;
        let NUM_OF_LEVEL = 3,
            size = 140,
            offset = Math.PI - 1,
            polyangle = (Math.PI * 2) / NUM_OF_SIDES,
            r = 0.7 * size,
            r_0 = r / 2,
            center =
            {
                x: size / 2,
                y: size / 2
            };

        const generateData = (length) => {
            const data = [];
            const min = 25;
            const max = 100;
            let policiesList = ['F.A', 'L', 'R.C', 'D.S', 'C.R.', 'B.B', 'D.C.']
            //iterate over each point, find a value, and divide it so the answer is either 1, 2, or 3
            for (let i = 0; i < length; i++) {
                data.push(
                    {
                        name: policiesList[i],
                        value: Math.round(min + ((max - min) * Math.random()))
                    }
                );
                //print out the index you just pushed into the array

            }
            return data;
        };

        const genTicks = levels => {
            const ticks = [];
            const step = 3 / levels;
            for (let i = 0; i <= levels; i++) {
                const num = step * i;
                if (Number.isInteger(step)) {
                    ticks.push(num);
                }
                else {
                    ticks.push(num.toFixed(2));
                }
            }
            return ticks;
        };

        const ticks = genTicks(NUM_OF_LEVEL);
        const dataset = generateData(NUM_OF_SIDES);

        const wrapper = d3.select("#radarChart")
            .append("svg")
            .attr("width", size)
            .attr("height", size);

        const g = d3.select("svg").append("g");

        const scale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, r_0])
            .nice();

        const generatePoint = ({ length, angle }) => {
            const point =
            {
                x: center.x + (length * Math.sin(offset - angle)),
                y: center.y + (length * Math.cos(offset - angle))
            };
            return point;
        };

        const drawPath = (points, parent) => {
            const lineGenerator = d3.line()
                .x(d => d.x)
                .y(d => d.y);
            parent.append("path")
                .attr("d", lineGenerator(points));
        };

        const generateAndDrawLevels = (levelsCount, sideCount) => {

            for (let level = 1; level <= levelsCount; level++) {
                const hyp = (level / levelsCount) * r_0;
                const points = [];
                for (let vertex = 0; vertex < sideCount; vertex++) {
                    const theta = vertex * polyangle;
                    points.push(generatePoint({ length: hyp, angle: theta }));
                }
                const group = g.append("g").attr("class", "levels");
                drawPath([...points, points[0]], group);
            }
        };

        const generateAndDrawLines = (sideCount) => {
            const group = g.append("g").attr("class", "grid-lines");
            for (let vertex = 1; vertex <= sideCount; vertex++) {
                const theta = vertex * polyangle;
                const point = generatePoint({ length: r_0, angle: theta });
                drawPath([center, point], group);
            }
        };

        const drawCircles = points => {
            g.append("g")
                .attr("class", "indic")
                .selectAll("circle")
                .data(points)
                .enter()
                .append("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("fill", "#999")
                .attr("r", 4)
        };

        const drawText = (text, point, isAxis, group) => {
            if (isAxis) {
                const xSpacing = text.toString().includes(".") ? 5 : 12;
                group.append("text")
                    .attr("x", point.x - xSpacing)
                    .attr("y", point.y - 5)
                    .html(text)
                    .style("text-anchor", "middle")
                    .attr("fill", "darkgrey")
                    .style("font-size", "12px")
                    .style("font-family", "sans-serif");
            }
            else {
                group.append("text")
                    .attr("x", point.x)
                    .attr("y", point.y)
                    .html(text)
                    .style("text-anchor", "middle")
                    .attr("fill", "darkgrey")
                    .style("font-size", "13px")
                    .style("font-family", "sans-serif");
            }
        };

        const drawData = (dataset, n) => {
            const points = [];
            dataset.forEach((d, i) => {
                const len = scale(d.value);
                const theta = i * (2 * Math.PI / n);
                points.push(
                    {
                        ...generatePoint({ length: len, angle: theta }),
                        value: d.value
                    });
            });

            const group = g.append("g").attr("class", "shape");
            drawPath([...points, points[0]], group);
            drawCircles(points);
        };

        const drawAxis = (ticks, levelsCount) => {
            const groupL = g.append("g").attr("class", "tick-lines");
            const point = generatePoint({ length: r_0, angle: 0 });
            drawPath([center, point], groupL);
            const groupT = g.append("g").attr("class", "ticks");
            ticks.forEach((d, i) => {
                const r = (i / levelsCount) * r_0;
                const p = generatePoint({ length: r, angle: 0 });
                const points =
                    [
                        p,
                        {
                            ...p,
                            x: p.x - 10
                        }
                    ];
                drawPath(points, groupL);
                drawText(d, p, true, groupT);
            });
        };

        const drawLabels = (dataset, sideCount) => {
            const groupL = g.append("g").attr("class", "labels");
            for (let vertex = 0; vertex < sideCount; vertex++) {
                const angle = vertex * polyangle;
                const label = dataset[vertex].name;
                const point = generatePoint({ length: 0.9 * (size / 2), angle });
                drawText(label, point, false, groupL);
            }
        };

        generateAndDrawLevels(NUM_OF_LEVEL, NUM_OF_SIDES);
        generateAndDrawLines(NUM_OF_SIDES);
        drawAxis(ticks, NUM_OF_LEVEL);
        drawData(dataset, NUM_OF_SIDES);
        drawLabels(dataset, NUM_OF_SIDES);
    },
    createQuadrant: function (currentElement, originalData) {
        // Define the four metrics
        const metrics = ["REPORTED", "DEBT", "DENIED", "SUED"];

        // Create an empty container for the quadrant
        const quadrant = document.createElement("div");
        quadrant.classList.add("quadrant");

        // Iterate over the metrics
        for (const metric of metrics) {
            // Get the value of the current metric
            const value = currentElement.getAttribute(`data-${metric}`);

            // Create a div for the current metric
            const div = document.createElement("div");
            div.classList.add("quadrant__item");
            //give the div a class based on the metric
            div.classList.add(`quadrant__item--${metric}`);
            // give the div a data attribute based on the metric
            div.setAttribute("data-metric", metric);

            // Set the background color of the div based on the value of the metric
            if (value.toLowerCase().includes('yes')) {
                div.style.backgroundColor = "#fddede";
                div.style.border = "1.5px solid darkred";
                //fill in the text of the div
                //check the current metric and change the copy based on that
                if (metric === "REPORTED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Credit reporting allowed</span>`;
                } else if (metric === "DEBT") {
                    div.innerHTML = `<span class="quadrant__item--copy">Selling patient debt allowed</span>`;
                } else if (metric === "DENIED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Denying care allowed</span>`;
                } else if (metric === "SUED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Legal action allowed </span>`;
                }
            } else if (value.toLowerCase().includes('no')) {
                div.style.backgroundColor = "#dff5db";
                div.style.border = "1.5px solid darkgreen";
                //fill in the text of the div
                if (metric === "REPORTED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Credit reporting not allowed</span>`;
                } else if (metric === "DEBT") {
                    div.innerHTML = `<span class="quadrant__item--copy">Selling patient debt not allowed</span>`;
                } else if (metric === "DENIED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Denying care not allowed</span>`;
                } else if (metric === "SUED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Legal action not allowed</span>`;
                }
            } else {
                div.style.backgroundColor = "#e1e1e1";
                div.style.border = "1.5px solid gray";
                if (metric === "REPORTED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Unclear if credit reporting allowed</span>`;
                } else if (metric === "DEBT") {
                    div.innerHTML = `<span class="quadrant__item--copy">Unclear if selling debt allowed</span>`;
                } else if (metric === "DENIED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Unclear if denying care allowed</span>`;
                } else if (metric === "SUED") {
                    div.innerHTML = `<span class="quadrant__item--copy">Unclear if legal action allowed</span>`;
                }
            }
            //append a title before the quadrant
            // Append the div to the quadrant
            quadrant.appendChild(div);
        }
        //attach quadrant to radarChart
        const radarChart = document.getElementById("radarChart")
        const title = document.createElement("h3");
        title.classList.add("quadrant__title");
        title.innerHTML = `<span class="modalTitle">HOSPITAL COLLECTION POLICIES:</span>`;
        radarChart.appendChild(title);
        radarChart.appendChild(quadrant)

        return quadrant;
    }
};


/*
------------------------------
SECTION: add a tooltip
------------------------------

export const tooltip = d3
    .select("#svganchor")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    */