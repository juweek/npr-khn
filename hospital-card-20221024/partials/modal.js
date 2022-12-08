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
            `<h3 class="modalTitle">${currentEntry['NAME']}</h3>
            <div class="modal__text">${currentEntry['SYSTEM']}</div>
            <div class="modal__text">Location: ${currentEntry['CITY']}, ${currentEntry.state}</div>
            <div class="modal__text">${currentEntry['HOSPITAL_TYPE']}</div>
            <div class="modal__text">${currentEntry['BEDS']} beds</div>
            <h3 class="modalTitle">Financial assistance:</h3>
            <div class="modal__text">Income qualifying for free care: ${currentEntry.FAP}</div>
            <div class="modal__text">Income qualifying for discounted care: ${currentEntry.FAP}</div>
            <div class="modal__text">Provides aid to patients with very large bills? ${currentEntry.FAP}</div>
            <div class="modal__text">Financial Assistance Policy available online? <a href="${currentEntry.FAP_LINK}">${currentEntry.FAP}</a></div>
            <h3 class="modalTitle">Billing and collections:</h3>
            <div class="modal__text">Reports patients to credit rating agencies? ${currentEntry.REPORTED}</div>
            <div class="modal__text">Sues patients, garnishes wages or places liens? ${currentEntry.SUED}</div>
            <div class="modal__text">Restricts non-emergency care to patients with debt? ${currentEntry.DENIED}</div>
            <div class="modal__text">Sells patients debts? ${currentEntry.DEBT}</div>
            <div class="modal__text">Billing and Collections policy available online? <a href="${currentEntry.COLLECTIONS_LINK}">${currentEntry.COLLECTIONS}</a></div>`
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