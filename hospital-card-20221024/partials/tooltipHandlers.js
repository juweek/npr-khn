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
        //change the currentElement's fill color
        currentElement.style.stroke = "black";
        currentElement.style.strokeWidth = "4px";
        let currentCMS = currentElement.getAttribute('data-cmsID')
        let cmsEntry = originalDataCMS[currentCMS]
        currentElement.classList.add("hovered")
        if (cmsEntry) {
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
        currentElement.style.stroke = "white";
        currentElement.style.strokeWidth = "1.4px";
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