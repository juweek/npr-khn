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
    clickCircle: function (currentElement, originalData) {
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


        let modalElement = document.getElementsByClassName("modal")[0]
        modalElement.classList.add("clicked")
        //empty out the modalContent
        modalContent.html(
            `
            <h2 class="modalTitle">${currentElement.getAttribute("data-state")}</h2>
            <div class="introContainer">
            <div class="modalContentGroup introText">
            <h3 class="modalTitle"> </h3>
            <div class="modal__text"><b>Amount owed:</b><span class="cardLocation">${'$' + currentElement.getAttribute("data-settlement")}</span></div>
            ${currentElement.getAttribute("data-SYSTEM") ? `<div class="modal__text"><b>System:</b> <span class="cardLocation">${currentElement.getAttribute("data-SYSTEM")}</span></div>` : ""}
            <div class="modal__text"><b>Hospital type: </b> <span class="cardLocation">${currentElement.getAttribute("data-hospitalType")}</span></div>
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
            <div class="modal__text"><span>Allows nonemergency care to be restricted for patients with debt?</span> <span>${currentElement.getAttribute("data-DENIED")}</span></div>
            <div class="modal__text"><span>Allows lawsuits against patients, liens, or wage garnishment?</span> <span>${currentElement.getAttribute("data-SUED")}</span></div>
            </div>
            </div>
            <div class="modalContentGroup">
            <h3 class="modalTitle">Scorecard notes:</h3>
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
