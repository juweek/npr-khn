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
            .select("#fixedSideColumn")
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
            `<div class="modal__hospital">${currentEntry.hospitalName} Hospital </div>
    <div class="modal__value">${currentElement.__data__.value}</div>
    <div class="modal__name">${currentElement.__data__.properties.name}, ${currentEntry.state}</div>
    <div class="modal__beds">${currentEntry.HOSPITAL_TYPE} hospital</div>
    <div class="modal__beds">${currentEntry.Beds} beds</div>`
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