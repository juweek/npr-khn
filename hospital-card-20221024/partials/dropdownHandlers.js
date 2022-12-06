import { policies, states } from './object';

/*
------------------------------
METHOD: iterate through all of the circles and change their opacity based on the dropdown selection. do the same for the side column
------------------------------
*/
export const eventHandlers = {
    // When the user clicks on the dropdown button, toggle between hiding and showing the dropdown content
    stateDropdownChange: function (currentState, listOfArrays, d) {
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

            //loop through all the listOfArrays and filter out the ones that don't match the current state

            let stateArray = listOfArrays[0]
            let newListOfArrays = []
            let newDataState = ["state"],
                dataHospitalType = ["HOSPITAL_TYPE"],
                dataFap = ["FAP"],
                dataCollections = ["COLLECTIONS"],
                dataReported = ["REPORTED"],
                dataDebt = ["DEBT"],
                dataSued = ["SUED"],
                dataDenied = ["DENIED"];
            for (let i = 0; i < stateArray.length; i++) {
                //loop through each of the other arrays in listOfArrays and filter out the ones that don't match the current state. create an object with the filtered arrays and push it to the newListOfArrays
                for (let j = 1; j < listOfArrays.length; j++) {
                    if (stateArray[i] == currentState) {

                        //create a key value pair, with the key being the state name and the value being the current entry
                        newDataState.push(stateArray[i])
                        dataHospitalType.push(listOfArrays[j][i])
                        newDataState.push(stateArray[i])
                        dataHospitalType.push(listOfArrays[j][i])
                        dataFap.push(listOfArrays[j][i])
                        dataCollections.push(listOfArrays[j][i])
                        dataReported.push(listOfArrays[j][i])
                        dataDebt.push(listOfArrays[j][i])
                        dataSued.push(listOfArrays[j][i])
                        dataDenied.push(listOfArrays[j][i])
                    }
                }
            }
            let newListOfCountedNames = []
            newListOfArrays.push(newDataState, dataHospitalType, dataFap, dataCollections, dataReported, dataDebt, dataSued, dataDenied)
            newListOfArrays.forEach(function (array) {
                let countedNames = array.reduce((allAnswers, answer) => {
                    const currCount = allAnswers[answer] ?? 0;
                    return {
                        ...allAnswers,
                        [answer]: currCount + 1,
                    };
                }, {})
                newListOfCountedNames.push(countedNames)
            })
            //get the current value of the policy dropdown
            let policyDropdown = document.getElementById("policyDropdownSelector");
            let policyDropdownValue = policyDropdown[policyDropdown.selectedIndex].value;
            this.changeTheKey(newListOfCountedNames, policyDropdownValue);
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
                circles[i].style.fill = "#B47C82";
            } else if (currentPolicy == "No") {
                circles[i].style.fill = "red";
            }
            else {
                circles[i].style.fill = "#FEECE5";
            }
        }

        let keyTitle = "<h3>Was the information available online?</h3>"
        let keyHTML = "<div id='key'><span style='background-color:blue'> </span><p>Yes</p> <span style='background-color:red'> </span><p>No</p></div>";
        key.html(keyTitle + keyHTML);

        //call the change the key function by using the policy abbreviation
        this.changeTheKey(listOfCountedNames, d.target.value);

        //call the state dropdown change function to set the map to the current state
    },
    changeTheKey: function (countedTotals, d) {
        let currentQuestion = d
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

                let currentArray = [Object.keys(filteredTotals)]
                //swap the places of the 'no' and 'some but not all' values in the array for collections
                if (currentArray[0][0] == "COLLECTIONS") {
                    let temp = currentArray[0][2]
                    currentArray[0][2] = currentArray[0][3]
                    currentArray[0][3] = temp
                }
                //print out the count of the unkwnown vallues

                // Create a new div element for the key
                let keyDiv = document.createElement("div");
                keyDiv.id = "key";

                //create a wrapper for the key text
                let keyTextWrapper = document.createElement("div");
                keyTextWrapper.id = "keyTextWrapper";

                //create yet another wrapper that will be used to hold the keyText wrapper and a second bar graph
                let keyWrapper = document.createElement("div");
                keyWrapper.id = "keyWrapper";

                // Create a new div element for the bar graph
                let barGraphDiv = document.createElement("div");
                barGraphDiv.id = "keyBarGraph";
                barGraphDiv.style.height = "100%";

                let barGraphDiv2 = document.createElement("div");
                        barGraphDiv2.id = "keyBarGraph2";

                // Iterate over the properties in the filteredTotals object
                for (let key in filteredTotals) {
                    //check to make sure the key isn't the policy abbreviation (i.e. FAP)
                    if (key != policyAbbr) {

                        // Create a new div element for the current property
                        let barDiv = document.createElement("div");
                        barDiv.id = key + "Bar";
                        barDiv.style.width = (filteredTotals[key] / (total / 100)) + "%";

                        // Set the background color based on the current property
                        if (key === "Yes") {
                            barDiv.style.backgroundColor = "blue";
                        } else if (key === "No") {
                            barDiv.style.backgroundColor = "red";
                        } else {
                            barDiv.style.backgroundColor = "purple";
                        }

                        // Append the bar div to the bar graph div
                        barGraphDiv.appendChild(barDiv);

                        // Create a new span element for the current property
                        let span = document.createElement("div");
                        //give the span an display property of inline
                        span.style.display = "inline-flex";
                        //create a square div 20px by 20px that will lie to the left of the span 
                        let square = document.createElement("div");
                        Object.assign(square.style, {
                            width: "20px",
                            height: "20px",
                            backgroundColor: barDiv.style.backgroundColor,
                            float: "left",
                            marginRight: "5px",
                            marginTop: "0px"
                        });
                        //append the square to the span
                        span.appendChild(square);
                        // Create a new p element for the current property
                        let p = document.createElement("p");
                        p.innerText = `${key}: ${filteredTotals[key]} (${Math.round((filteredTotals[key] / total) * 100)}%)`;
                        span.appendChild(p);

                        // Append the span element to the key text wrapper
                        keyTextWrapper.appendChild(span);

                        //create a horizontal bar chart with the width of the values corresponding to the percentage of the total. make sure to give each bar a height and width of 100% so that they will stack on top of each other
                        let barDiv2 = document.createElement("div");
                        barDiv2.id = key + "Bar2";
                        barDiv2.style.height = '20px';
                        barDiv2.style.width = (filteredTotals[key] / (total / 100)) + "%";
                        barDiv2.style.marginBottom = "3px";

                        // Set the background color based on the current property
                        if (key === "Yes") {
                            barDiv2.style.backgroundColor = "blue";
                        }
                        else if (key === "No") {
                            barDiv2.style.backgroundColor = "red";
                        }
                        else {
                            barDiv2.style.backgroundColor = "purple";
                        }

                        // Append the bar div to the bar graph div
                        barGraphDiv2.appendChild(barDiv2);
                    }
                    
                    keyWrapper.appendChild(keyTextWrapper);
                    keyWrapper.appendChild(barGraphDiv2);
                    keyDiv.appendChild(keyWrapper);
                    console.log(keyDiv)
                }

                // Append the bar graph div to become the first element of key div element
                keyDiv.insertBefore(barGraphDiv, keyDiv.firstChild);

                // Append the key div element to the key container div element
                key.html(keyTitle);
                key.node().appendChild(keyDiv);
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