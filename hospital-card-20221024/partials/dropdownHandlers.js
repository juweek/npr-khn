import { policies, states } from './object';

/*
------------------------------
METHOD: iterate through all of the circles and change their opacity based on the dropdown selection. do the same for the side column
------------------------------
*/
export const eventHandlers = {
    // When the user clicks on the dropdown button, toggle between hiding and showing the dropdown content
    stateDropdownChange: function (currentState) {
        let circles = document.getElementsByTagName("circle");

        // Loop through all dropdown items, and reset the opacity to 1
        for (let i = 0; i < circles.length; i++) {
            circles[i].style.opacity = "1";
        }

        if (currentState == "Filter by state") {
            let hospitals = document.getElementsByClassName("sideColumnHospital");
            for (let i = 0; i < hospitals.length; i++) {
                hospitals[i].style.display = "block";
            }
            return;
        }

        else {
            //search the states object and find the key that matches the current state using the abbreviation
            for (let i = 0; i < circles.length; i++) {
                let d = circles[i].getAttribute("data-state")
                if (d != currentState) {
                    circles[i].style.opacity = "0.1";
                } else {
                    circles[i].style.opacity = "1";
                }
            }
            //hide the hospitals that are not in the selected state
            let hospitals = document.getElementsByClassName("sideColumnHospital");
            for (let i = 0; i < hospitals.length; i++) {
                let d = hospitals[i].getAttribute("data-state")
                if (d != currentState) {
                    hospitals[i].style.display = "none";
                } else {
                    hospitals[i].style.display = "block";
                }
            }
        }
    },
    /*
    ------------------------------
    METHOD: iterate through all of the circles and change their color based on the policy selected. to do this, you will change the html of the key and the color of the circles
    ------------------------------
    */
    policydropdownChange: function (d) {
        //remove the old key
        //let key = d3.select("#svganchor").append("div").attr("id", "keyContainer");
        let circles = document.getElementsByTagName("circle");

        for (let i = 0; i < circles.length; i++) {
            circles[i].style.fill = "#333";
        }

        let currentQuestion = d.target.value
        let policyAbbr = policies[currentQuestion]

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
    },
    changeTheKey: function (countedTotals, d) {
        let currentQuestion = d.target.value
        let policyAbbr = policies[currentQuestion]
        let keyTitle = "<h3>" + currentQuestion + "</h3>"
        var filteredTotals
        //iterate through all of the totals and determine if they have the policy abbreviation in the object
        for (let i = 0; i < countedTotals.length; i++) {
            if (countedTotals[i].hasOwnProperty(policyAbbr)) {
                filteredTotals = countedTotals[i]
                //calculate the sum of the totals
                let total = 0;
                for (let key in filteredTotals) {
                    if (key != policyAbbr) {
                        total += filteredTotals[key];
                    }
                }
                //calculate the percentage of yes, no, and unknown
                let keyHTML = "<div id='key'><div class='key_block'><span style='background-color:blue'> </span><p>Yes</p> </div><div class='key_block'><span style='background-color:red'> </span><p>No</p></div>";
                 //////////////////////////
                let lastkeyHTML = ((filteredTotals.Unclear) || (filteredTotals.Unknown)) ? "<div class='key_block'><span style='background-color:purple'> </span><p>Unknown</p> </div>" : '</div>';
                 //////////////////////////
                keyHTML = keyHTML + lastkeyHTML
                //////////////////////////
                let keyBarGraph = "<div id='keyBarGraph' style='height: 100%;'><div id='yesBar' style='width:" + ((filteredTotals.Yes) / (total / 100)) + "%; background-color:blue;'></div><div id='noBar' style='width:" + ((filteredTotals.No) / (total / 100)) + "%; background-color:red;'></div>"
                 //////////////////////////
                let lastKey = (filteredTotals.Unclear) ? (filteredTotals.Unclear) + "<div id='unknownBar' style='width:" + (filteredTotals.Unclear) + "%; background-color:purple;'> </div></div>" : '</div>';
                 //////////////////////////
                keyBarGraph = keyBarGraph + lastKey
                key.html(keyTitle + keyBarGraph + keyHTML);
            }
        }
    }
};

/*
------------------------------
SECTION: create the STATE dropdown and populate it with state names
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
SECTION: create the POLICY dropdown and populate it with the list of policies
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


export const key = d3.select("#svganchor").append("div").attr("id", "keyContainer");