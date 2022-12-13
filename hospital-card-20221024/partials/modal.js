import { policies } from './object';

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
    clickCircle: function (currentElement, originalData) {
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
        let modalElement = document.getElementsByClassName("modal")[0]
        modalElement.classList.add("clicked")

        modalContent.html(
            `<h3 class="modalTitle">${currentElement.getAttribute("data-NAME")}</h3>
            <div class="modal__text">${currentElement.getAttribute("data-CITY"), currentElement.getAttribute("data-state")}</div>
            <div class="modal__text">${currentElement.getAttribute("data-hospitalType")}</div>
            <div class="modal__text">${currentElement.getAttribute("data-beds")} beds</div>
            <h3 class="modalTitle">Financial assistance:</h3>
            <div class="modal__text">Income qualifying for free care: ${
                currentElement.getAttribute("data-FINASSIST")
            }</div>
            <div class="modal__text">Income qualifying for discounted care: ${currentElement.getAttribute("data-DISCOUNT")}</div>
            <div class="modal__text">Income qualifying for free care: ${currentElement.getAttribute("data-FREE")}</div>
            <div class="modal__text">Provides aid to patients with very large bills? ${currentElement.getAttribute("data-AID")}</div>
            <div class="modal__text">Financial Assistance Policy available online? <a href="${currentElement.getAttribute("data-FAP-LINK")}">${currentElement.getAttribute("data-FAP")}</a></div>
            <h3 class="modalTitle">Billing and collections:</h3>
            <div class="modal__text">Allows reporting patients to credit rating agencies?${currentElement.getAttribute("data-REPORTED")}</div>
            <div class="modal__text">Sues patients, garnishes wages or places liens? ${currentElement.getAttribute("data-SUED")}</div>
            <div class="modal__text">Restricts non-emergency care to patients with debt? ${currentElement.getAttribute("data-DENIED")}</div>
            <div class="modal__text">Sells patients debts? ${currentElement.getAttribute("data-DEBT")}</div>
            <div class="modal__text">Billing and Collections policy available online? <a href="${currentEntry.COLLECTIONS_LINK}">${currentElement.getAttribute("data-COLLECTIONS")}</a></div>
            <h3 class="modalTitle">Scorecard notes:</h3>
            <div class="modal__text">${currentElement.getAttribute("data-SCORECARD")}</div>`
        )
    },
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