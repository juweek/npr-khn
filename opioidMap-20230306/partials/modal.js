import { policies } from './object';

//load in radar-chart.js
import { RadarChart } from './radar-chart';

/*
------------------------------
Export the modal and the close button
------------------------------
*/
export const modalFunctions = {
    //abbreviate text to millions or billions
    abbreviateNumber: function(numString) {
        // Convert the string to a number and get the number of digits
        //remove dollar sign and commas
        numString = numString.replace(/[$,]/g, '');
        const num = Number(numString);
        const digits = numString.length;
      
        // Abbreviate to millions if the number has 8-9 digits
        if (digits >= 8 && digits <= 9) {
          return `$${(num / 1000000).toFixed(0)} million`;
        }
        // Abbreviate to billions if the number has 10-12 digits
        else if (digits >= 10 && digits <= 12) {
          return `$${(num / 1000000000).toFixed(1)} billion`;
        }
        // Otherwise, return the original number string
        else {
          return numString;
        }
    },
      
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
            <h3 class="modalTitle" style="text-align: center; margin-bottom: 20px;">Total From Distributors/J&J Settlements: ${this.abbreviateNumber(currentElement.getAttribute("data-Total"))}</h3>
            <div class="introContainer">
            <div class="modalContentGroup introText">
            <h3 class="modalTitle">Who controls the money?</h3><p class="modalText"></p>
            ${currentElement.getAttribute("data-stateShare") != 0 ? `<div class="modal__text"><b>${currentElement.getAttribute("data-stateShare")}% controlled by state government</b></div>` : ""}
            ${currentElement.getAttribute("data-fundShare") != 0 ? `<div class="modal__text"><b>${currentElement.getAttribute("data-fundShare")}% controlled by abatement fund*</b></div>` : ""}
            ${currentElement.getAttribute("data-localShare") != 0 ? `<div class="modal__text"><b>${currentElement.getAttribute("data-localShare")}% controlled by local government</b></div>` : ""}
            ${currentElement.getAttribute("data-otherShare") != 0 ? `<div class="modal__text"><b>${currentElement.getAttribute("data-otherShare")}% controlled by other entities**</b></div>` : ""}
            ${currentElement.getAttribute("data-otherDescription") != 0 ? `<div class="radarChartComment">**${currentElement.getAttribute("data-otherDescription")}</div>` : ""}
            </div>
            <div class="modalContentGroup introImage">
            <h3 class="modalTitle">Promised Reporting:</h3>
            <p class="modalText">At a minimum, states must report non-opioid uses of the money. We’ve determined how much additional reporting each state is promising.</p>
                <div id="radarChart"></div>
            </div>
            </div>
            <div class="modalContentGroup">
            <h3 class="modalTitle">Participating in settlements:</h3>
            <span style="font-size: 12px;">Grayed buttons means not applicable. Certains settled before national agreements were reached and thus were not eligible for those settlements.</span>
            <div class="modal__text" style="border: none;">
            <div class="settlementButtonsContainer">
                ${currentElement.getAttribute("data-distributors") == 'Yes' ? `<div class="settlementDiv active"><span class="settlementSpan">Distributors</span></span></div>` : currentElement.getAttribute("data-distributors") == 'No' ? `<div class="settlementDiv notApplicable"><span class="settlementSpan">Distributors</span></span></div>` : `<div class="settlementDiv"><span class="settlementSpan">Distributors</span></span></div>`}
                ${currentElement.getAttribute("data-JJ") == 'Yes' ? `<div class="settlementDiv active"><span class="settlementSpan">J&J</span></span></div>` : currentElement.getAttribute("data-JJ") == 'No' ? `<div class="settlementDiv notApplicable"><span class="settlementSpan">Distributors</span></span></div>` : `<div class="settlementDiv"><span class="settlementSpan">J&J</span></span></div>`}
                ${currentElement.getAttribute("data-CVS") == 'Yes' ? `<div class="settlementDiv active"><span class="settlementSpan">CVS</span></span></div>` : currentElement.getAttribute("data-JJ") == 'No' ? `<div class="settlementDiv notApplicable"><span class="settlementSpan">CVS</span></span></div>` : `<div class="settlementDiv"><span class="settlementSpan">CVS</span></span></div>`}
                ${currentElement.getAttribute("data-Walgreens") == 'Yes' ? `<div class="settlementDiv active"><span class="settlementSpan">Walgreens</span></span></div>` : currentElement.getAttribute("data-Walgreens") == 'No' ? `<div class="settlementDiv notApplicable"><span class="settlementSpan">Walgreens</span></span></div>` : `<div class="settlementDiv"><span class="settlementSpan">Walgreens</span></span></div>`}
                ${currentElement.getAttribute("data-Walmart") == 'Yes' ? `<div class="settlementDiv active"><span class="settlementSpan">Walmart</span></span></div>` : currentElement.getAttribute("data-Walmart") == 'No' ? `<div class="settlementDiv notApplicable"><span class="settlementSpan">Walmart</span></span></div>` : `<div class="settlementDiv"><span class="settlementSpan">Walmart</span></span></div>`}
                ${currentElement.getAttribute("data-Allergan") == 'Yes' ? `<div class="settlementDiv active"><span class="settlementSpan">Allergan</span></span></div>` : currentElement.getAttribute("data-Allergan") == 'No' ? `<div class="settlementDiv notApplicable"><span class="settlementSpan">Allergan</span></span></div>` : `<div class="settlementDiv"><span class="settlementSpan">Allergan</span></span></div>`}
                ${currentElement.getAttribute("data-Teva") == 'Yes' ? `<div class="settlementDiv active"><span class="settlementSpan">Teva</span></span></div>` : currentElement.getAttribute("data-Teva") == 'No' ? `<div class="settlementDiv notApplicable"><span class="settlementSpan">Teva</span></span></div>` : `<div class="settlementDiv"><span class="settlementSpan">Teva</span></span></div>`}
            </div>
            </div>
            </div>
            <div class="modalContentGroup" style="padding-top: 10px;">
            ${currentElement.getAttribute("data-fundShare") != 0 ? `<div class="modal__text">*An "abatement fund" is a state-created fund, overseen by a dedicated council or similar entity, to hold opioid settlement dollars.</div>` : ""}
            
            ${currentElement.getAttribute("data-websiteLink") != 0 ? `
            <div class="modal__text" style="border-bottom: none;">More info: <u><a href="${currentElement.getAttribute("data-websiteLink")}">${currentElement.getAttribute("data-website")}</a></u></div>` : ""}
            </div>`
            
        )
        //this.createRadarChart(currentElement, originalData)
        this.createQuadrant(currentElement)
    },
    /*
    ------------------------------
    METHOD: create the radar chart and append it to the modal
    ------------------------------
    */
    createQuadrant: function (currentElement) {
        // Define the four metrics
        let reportedPublicly = currentElement.getAttribute("data-reportedPublicly");
        let not_reported_publicly = currentElement.getAttribute("data-notReportedPublicly");
        let leftOver = 100 - (parseInt(reportedPublicly) + parseInt(not_reported_publicly))

        // Create an empty container for the quadrant
        const quadrant = document.createElement("div");
        quadrant.classList.add("quadrant");
        quadrant.style.width = "100%";

        //create a stacked barchart using the three variables of reportedPublicly, not_reported_publicly, and leftOver
        const reportedPubliclyBar = document.createElement("div");
        reportedPubliclyBar.classList.add("quadrant__bar");
        reportedPubliclyBar.style.width = (reportedPublicly === 0 ? "2%" : `${reportedPublicly}%`)
        reportedPubliclyBar.style.backgroundColor = "#F2C94C";
        quadrant.appendChild(reportedPubliclyBar);

        const not_reported_publiclyBar = document.createElement("div");
        not_reported_publiclyBar.classList.add("quadrant__bar");
        not_reported_publiclyBar.style.width = (not_reported_publicly === 0 ? "2%" : `${not_reported_publicly}%`)
        not_reported_publiclyBar.style.backgroundColor = "#F2994A";
        quadrant.appendChild(not_reported_publiclyBar);

        const leftOverBar = document.createElement("div");
        leftOverBar.classList.add("quadrant__bar");
        leftOverBar.style.width = (leftOver === 0 ? "2%" : `${leftOver}%`)
        leftOverBar.style.backgroundColor = "#dfdfdf";
        quadrant.appendChild(leftOverBar);

        // Define style properties for key text elements
        const keyTextYes = document.createElement("div");
        keyTextYes.dataset.selection = "% reported publicly";
        keyTextYes.style.display = "inline-flex";
        keyTextYes.innerHTML = `<span>% reported publicly</span>`;

        const keyTextOther = document.createElement("div");
        keyTextOther.dataset.selection = "% reported to oversight body";
        keyTextOther.style.display = "inline-flex";
        keyTextOther.innerHTML = `<span>% reported to oversight body</span>`;

        const keyTextNotReq = document.createElement("div");
        keyTextNotReq.style.display = "inline-flex";
        keyTextNotReq.innerHTML = `<span>% no additional reporting</span>`;

        // Define style properties for key bar graph elements
        const keyBarGraphYes = document.createElement("div");
        keyBarGraphYes.dataset.selection = "% reported publicly";

        const keyBarGraphOther = document.createElement("div");
        keyBarGraphOther.dataset.selection = "% reported to oversight body";

        const keyBarGraphNotReq = document.createElement("div");
        keyBarGraphOther.dataset.selection = "% no additional reporting";

        // Set the values of the key bar graph elements using the variables
        keyBarGraphYes.style.height = "20px";
        if (reportedPublicly == 0) {
            keyBarGraphYes.style.width = "0px";
            keyBarGraphYes.style.color = "black";
        } else {
            keyBarGraphYes.style.width = `${reportedPublicly}%`;
            keyBarGraphYes.style.color = "white";
        }
        keyBarGraphYes.style.marginBottom = "2px";
        keyBarGraphYes.style.backgroundColor = "#c56f6f";
        keyBarGraphYes.innerHTML = `<span>` + reportedPublicly + `%</span>`;

        // Set the values of the key bar graph elements using the variables
        keyBarGraphOther.style.height = "20px";
        if (not_reported_publicly == 0) {
            keyBarGraphOther.style.width = "0px";
            keyBarGraphOther.style.color = "black";
        } else {
            keyBarGraphOther.style.width = `${not_reported_publicly}%`;
            keyBarGraphOther.style.color = "white";
        }
        keyBarGraphOther.style.marginBottom = "2px";
        keyBarGraphOther.style.backgroundColor = "#c56f6f";
        keyBarGraphOther.innerHTML = `<span>` + not_reported_publicly + `%</span>`;

        // Set the values of the key bar graph elements using the variables
        keyBarGraphNotReq.style.height = "20px";
        if (leftOver == 0) {
            keyBarGraphNotReq.style.width = "0px";
            keyBarGraphNotReq.style.color = "black";
        } else {
            keyBarGraphNotReq.style.width = `${leftOver}%`;
            keyBarGraphNotReq.style.color = "white";
        }
        keyBarGraphNotReq.style.marginBottom = "2px";
        keyBarGraphNotReq.style.backgroundColor = "#c56f6f";
        keyBarGraphNotReq.innerHTML =  `<span>` + leftOver + `%</span>`;

        //attach quadrant to radarChart
        const radarChart = document.getElementById("radarChart")
        const keyContainer = document.createElement("div");
        keyContainer.id = "keyContainer";

        const keyWrapper = document.createElement("div");
        keyWrapper.id = "keyWrapper";

        const keyTextWrapper = document.createElement("div");
        keyTextWrapper.id = "keyTextWrapper";
        keyTextWrapper.style.display = "inline-flex";
        keyTextWrapper.appendChild(keyTextYes);
        keyTextWrapper.appendChild(keyTextOther);
        keyTextWrapper.appendChild(keyTextNotReq);

        const keyBarGraph = document.createElement("div");
        keyBarGraph.id = "keyBarGraph2";
        keyBarGraph.appendChild(keyBarGraphYes);
        keyBarGraph.appendChild(keyBarGraphOther);
        keyBarGraph.appendChild(keyBarGraphNotReq);

        const key = document.createElement("div");
        key.id = "key";
        key.appendChild(keyWrapper);

        keyWrapper.appendChild(keyTextWrapper);
        keyWrapper.appendChild(keyBarGraph);
        keyContainer.appendChild(key);

        const title = document.createElement("div");
        title.innerHTML = keyContainer.outerHTML;

        radarChart.appendChild(title);
        let appliedSettlements = currentElement.getAttribute("data-otherSettlements");
        const appliesToOtherSettlements = document.createElement("div")
        appliesToOtherSettlements.classList.add("radarChartComment");
        appliesToOtherSettlements.innerHTML = `Applies to other settlements? ${appliedSettlements}`;
        radarChart.appendChild(appliesToOtherSettlements);

        return quadrant;
    }
};

