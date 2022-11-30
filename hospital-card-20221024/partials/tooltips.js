import { policies, states } from './object';

/*
------------------------------
Export the tooltip functions, handlers, and data
------------------------------
*/

// Export the event handlers
export const tooltipHandlers = {
    // When the user enters the tooltip
    mouseEnter: function (d, originalData) {
        let currentEntry = originalData[d.srcElement.__data__.id]
        let currentElement = d.srcElement
        currentElement.classList.add("hovered")
        tooltip
            .style("opacity", 1)
            .style("left", (d.pageX - 150) + "px")
            .style("top", (d.pageY - 100) + "px")
            .html(
              `<div class="tooltip__hospital">${currentEntry.hospitalName} Hospital </div><div class="tooltip__value">${d.srcElement.__data__.value}</div><div class="tooltip__name">${d.srcElement.__data__.properties.name}, ${currentEntry.state}</div>`
        );
    },
    mouseOut: function (d) {
        tooltip.style("opacity", 0);
        let currentElement = d.srcElement
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