//var { policies, states } = ("./partials/eventHandlers");
import { policies, states } from './object';

/*
------------------------------
Export the event handlers, the event listeners, and the dropdown elements for the dropdown interactions that will be used in the ../graphic.js file
------------------------------
*/

// Export the event handlers
export const eventHandlers = {
    // When the user clicks on the dropdown button, toggle between hiding and showing the dropdown content
    dropdownChange: function () {
        let circles = document.getElementsByTagName("circle");

        for (let i = 0; i < circles.length; i++) {
            circles[i].style.opacity = "1";
        }

        if (this.value == "Filter by state") {
            let hospitals = document.getElementsByClassName("sideColumnHospital");
            for (let i = 0; i < hospitals.length; i++) {
                hospitals[i].style.display = "block";
            }
            return;
        }

        else {
            let selectedState = d3.select(this).property("value");
            let stateAbbr = states[selectedState];
            for (let i = 0; i < circles.length; i++) {
                let currentState = circles[i].getAttribute("data-state")
                if (currentState != stateAbbr) {
                    circles[i].style.opacity = "0.1";
                } else {
                    circles[i].style.opacity = "1";
                }
            }
            //hide the hospitals that are not in the selected state
            let hospitals = document.getElementsByClassName("sideColumnHospital");
            for (let i = 0; i < hospitals.length; i++) {
                let currentState = hospitals[i].getAttribute("data-state")
                if (currentState != stateAbbr) {
                    hospitals[i].style.display = "none";
                } else {
                    hospitals[i].style.display = "block";
                }
            }
        }
    },
    policydropdownChange: function () {
        let key = d3.select("#svganchor").append("div").attr("id", "keyContainer");
        let circles = document.getElementsByTagName("circle");

        for (let i = 0; i < circles.length; i++) {
            circles[i].style.fill = "#333";
        }
        let selectedPolicy = d3.select(this).property("value");
        let policyAbbr = policies[selectedPolicy];
        for (let i = 0; i < circles.length; i++) {
            let currentPolicy = circles[i].getAttribute("data-" + policyAbbr)
            if (currentPolicy == "Yes") {
                circles[i].style.fill = "blue";
            } else if (currentPolicy == "No") {
                circles[i].style.fill = "red";
            }
            else {
                circles[i].style.fill = "purple";
            }
        }

        let keyTitle = "<h3>Was the information available online?</h3>"
        let keyHTML = "<div id='key'><span style='background-color:blue'> </span><p>Yes</p> <span style='background-color:red'> </span><p>No</p> <span style='background-color:purple'> </span><p>Unknown</p> </div>";
        key.html(keyTitle + keyHTML);
    }
};

export const eventListeners = {
    dropdownChange: function () {
        d3.select("#dropdown").on("change", eventHandlers.dropdownChange);
    },
    policydropdownChange: function () {
        d3.select("#policydropdown").on("change", eventHandlers.policydropdownChange);
    }
};

/*
------------------------------
SECTION: create the dropdown and populate it with state names
------------------------------
*/
export const dropdown = d3
    .select("#fixedSideColumnTop")
    .append("select")
    .attr("id", "stateDropdownSelector")
    .attr("name", "name-list").selectAll("option")
    .data(Object.keys(states))
    .enter()
    .append("option")
    .text(function (d) {
        return d;
    });

/*
------------------------------
SECTION: create the dropdown and populate it with the list of policies
------------------------------
*/

export const policyDropdown = d3
    .select("#svganchor")
    .append("select")
    .attr("id", "policyDropdownSelector")
    .selectAll("option")
    .data(Object.keys(policies))
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);
