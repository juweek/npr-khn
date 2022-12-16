/*
------------------------------
Export the tooltip functions, handlers, and data
------------------------------
*/

// Export the event handlers
export const tooltipHandlers = {
    // When the user enters the tooltip
    mouseEnter: function (xLocation, yLocation, currentElement, originalData) {
        //in original data, for all the keys that have four digits, add a zero to the front
        //for all the keys that have three digits, add two zeros to the front
        let currentEntry = originalData[currentElement.__data__.id]
        console.log(originalData)
        //let currentElement = d.srcElement
        currentElement.classList.add("hovered")
        console.log(currentEntry)
        if (currentEntry) {
            tooltip
                .style("opacity", 1)
                .style("left", (xLocation - 250) + "px")
                .style("top", (yLocation - 300) + "px")
                .html(
                    `<div class="tooltip__hospital">${currentEntry['NAME']} Hospital </div><div class="tooltip__value">${currentEntry['SYSTEM']}</div><div class="tooltip__name">${currentEntry['CITY']}, ${currentEntry.state}</div>`
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