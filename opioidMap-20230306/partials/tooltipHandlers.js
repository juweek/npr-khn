/*
------------------------------
Export the tooltip functions, handlers, and data
------------------------------
*/

// Export the event handlers
export const tooltipHandlers = {
    // When the user enters the tooltip
    mouseEnter: function (xLocation, yLocation, currentElement, originalDataCMS) {
        let currentStateName = currentElement.getAttribute('data-state')
        let currentSettlement = currentElement.getAttribute('data-settlement')
        //get the svg's statename and settlement
        currentElement.style.stroke = "black";
        currentElement.style.strokeWidth = "4px";
        currentElement.classList.add("hovered")
        tooltip
            .style("opacity", 1)
            .style("left", (xLocation - 250) + "px")
            .style("top", (yLocation - 300) + "px")
            .html(
                `<div class="tooltip__hospital"><b>${currentStateName}</b></div><div class="tooltip__name"><b>Amount owed: </b>${currentSettlement}</div>`
            );
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