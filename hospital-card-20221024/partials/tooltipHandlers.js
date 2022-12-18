/*
------------------------------
Export the tooltip functions, handlers, and data
------------------------------
*/

// Export the event handlers
export const tooltipHandlers = {
    // When the user enters the tooltip
    mouseEnter: function (xLocation, yLocation, currentElement, originalData, originalDataCMS) {
        //in original data, for all the keys that have four digits, add a zero to the front
        //for all the keys that have three digits, add two zeros to the front
        //get the current element's cmsID from the currentElement.__data__
        currentElement.__data__.beds

        let currentEntry = originalData[currentElement.__data__.id]
        //let currentElement = d.srcElement
        let cmsEntry = originalDataCMS[currentEntry['cmsID']]
        currentElement.classList.add("hovered")
        if (currentEntry) {
            tooltip
                .style("opacity", 1)
                .style("left", (xLocation - 250) + "px")
                .style("top", (yLocation - 300) + "px")
                .html(
                    `<div class="tooltip__hospital"><b>${cmsEntry['NAME']}</b></div><div class="tooltip__name">${cmsEntry['CITY']}, ${cmsEntry.state}</div>`
                );
        }
    },
    mouseOut: function (currentElement) {
        tooltip.style("opacity", 0);
        currentElement.classList.remove("hovered")
    }
};


/*
------------------------------
SECTION: add a tooltip
------------------------------
*/
export const tooltip = d3
    .select("#svganchor")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);