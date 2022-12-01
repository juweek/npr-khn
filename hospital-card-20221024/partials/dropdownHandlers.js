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

        if (currentState == "All") {
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
    policydropdownChange: function (listOfCountedNames, d) {
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
        let keyHTML = "<div id='key'><span style='background-color:blue'> </span><p>Yes</p> <span style='background-color:red'> </span><p>No</p></div>";
        key.html(keyTitle + keyHTML);
        
        //call the change the key function by using the policy abbreviation
        this.changeTheKey(listOfCountedNames, d);

        //call the state dropdown change function to set the map to the current state
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
                //access the last key in the object
                let lastKeyNumber = Object.keys(filteredTotals).length - 1
                //calculate the percentage of yes, no, and unknown
                //create a special case for the FAP key to ensure that the percentages are correct

                let currentArray = [Object.keys(filteredTotals)]
                //swap the places of the 'no' and 'some but not all' values in the array for collections
                if (currentArray[0][0] == "COLLECTIONS") {
                    let temp = currentArray[0][2]
                    currentArray[0][2] = currentArray[0][3]
                    currentArray[0][3] = temp
                }
                //print out the count of the unkwnown vallues

                let keyHTML = "<div id='key'><span style='background-color:blue'> </span><p>Yes: " + filteredTotals.Yes + " (" + Math.round((filteredTotals.Yes / total) * 100) + "%)</p> <span style='background-color:red'> </span><p>No: " + filteredTotals.No + " (" + Math.round((filteredTotals.No / total) * 100) + "%)</p>" + ((currentArray[0][3]) ? "<span style='background-color:purple'> </span><p>" + currentArray[0][2] + " (" + Math.round((filteredTotals[currentArray[0][2]] / total) * 100) + "%)" : '') + "</p></div>";
                 //////////////////////////
                let booleanLastKey = Object.keys(filteredTotals).length
                if (booleanLastKey == 4) {
                    keyHTML += "<div class='key_block'><span style='background-color:purple'> </span></div>";
                } 
                else {
                    keyHTML = "<div id='key'><span style='background-color:blue'> </span><p>Yes: " + filteredTotals.Yes + " (" + Math.round((filteredTotals.Yes / total) * 100) + "%)</p> <span style='background-color:red'> </span><p>No: " + filteredTotals.No + " (" + Math.round((filteredTotals.No / total) * 100) + "%)</p></div>";
                }
                //////////////////////////
                let keyBarGraph = "<div id='keyBarGraph' style='height: 100%;'><div id='yesBar' style='width:" + ((filteredTotals.Yes) / (total / 100)) + "%; background-color:blue;'></div><div id='noBar' style='width:" + ((filteredTotals.No) / (total / 100)) + "%; background-color:red;'></div>"
                 //////////////////////////
                 if (Object.keys(filteredTotals).length == 4) {

                    let lastKey = "<div id='unknownBar' style='width:" + Math.round((filteredTotals[currentArray[0][2]] / total) * 100)+ "%; background-color:purple;'> </div></div>"
                    //////////////////////////
                    keyBarGraph = keyBarGraph + lastKey
                    key.html(keyTitle + keyBarGraph + keyHTML);
                 }
                    else {
                        let lastKey = "</div>"
                        keyBarGraph = keyBarGraph + lastKey
                        key.html(keyTitle + keyBarGraph + keyHTML);
                    }
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