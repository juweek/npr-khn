import { policies, states, colors, descriptions } from './object';

/*
------------------------------
METHOD: iterate through all of the circles and change their opacity based on the dropdown selection. do the same for the side column
------------------------------
*/
export const eventHandlers = {
    // When the user clicks on the dropdown button, toggle between hiding and showing the dropdown content
    stateDropdownChange: function (currentState, listOfArrays, d) {
        let circles = document.getElementsByTagName("circle");

        // Loop through all circles, and reset the opacity to 1
        for (let i = 0; i < circles.length; i++) {
            circles[i].style.opacity = "1";
        }

        //if the current state is all, then show all of the hospitals
        if (currentState == "All") {
            let hospitals = document.getElementsByClassName("sideColumnHospital");
            for (let i = 0; i < hospitals.length; i++) {
                hospitals[i].style.display = "block";
            }
            return;
        }

        //for everything else, search the states object and find the key that matches the current state using the abbreviation
        else {
            for (let i = 0; i < circles.length; i++) {
                let d = circles[i].getAttribute("data-state")
                if (d != currentState) {
                    circles[i].style.opacity = "0.05";
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
            //THIS IS THE CODE THAT CHANGES THE KEY BASED ON THE STATE FILTER. EASY TO REIMPLEMENT IF WE WANT
            //find the currently selected button and get its value
            let currentlySelectedButton = document.querySelector("button.active"); 
            //get the id of the currently selected button
            let currentlySelectedButtonId = currentlySelectedButton.getAttribute("id");
            //get the associated question from the currentlySelectedButtonId
            //find the key in policies where the value is currentlySelectedButtonId
            let policyKey = Object.keys(policies).find((key) => policies[key] === currentlySelectedButtonId);
            this.policydropdownChange(newListOfCountedNames, policyKey);
        }
    },
    /*
    ------------------------------
    METHOD: iterate through all of the circles and change their color based on the policy selected. to do this, you will change the html of the key and the color of the circles
    ------------------------------
    */
    policydropdownChange: function (listOfPolicies, d) {
        let circles = document.getElementsByTagName("circle");
        let currentQuestion = d
        let policyAbbr = policies[currentQuestion]
        let currentTotals = ""
        let currentPolicyAnswers = {};

        for (let i = 0; i < circles.length; i++) {

            let currentPolicy = circles[i].getAttribute("data-" + policyAbbr)
            //set the color based on the policyAbbr

            let currentColorArray = colors[policyAbbr]
            let fillColor = ""; // initialize the fill color to an empty string

            //have currentTotals be an object with the key being the policy and the value being the number of times it appears
            currentTotals = listOfPolicies[policyAbbr]

            //skip if currentPolicy is null
            if (currentPolicy == null) {
                continue;
            }
            //add the answers for each question as a value to listOfPolicies[policyAbbr]
            if (currentPolicy.includes("Yes")) {
                if (!currentPolicyAnswers.hasOwnProperty('Yes')) {
                    // if currentPolicy is not already a property of currentPolicyAnswers, set its value to 0
                    currentPolicyAnswers['Yes'] = 0;
                }
                // increment the value of the currentPolicy property
                currentPolicyAnswers['Yes']++;
                //circles[i].style.fill = currentColorArray[0];
                fillColor = currentColorArray[0];
            } else if (currentPolicy.includes("No")) {
                if (!currentPolicyAnswers.hasOwnProperty('No')) {
                    // if currentPolicy is not already a property of currentPolicyAnswers, set its value to 0
                    currentPolicyAnswers['No'] = 0;
                }
                // increment the value of the currentPolicy property
                currentPolicyAnswers['No']++;
                fillColor = currentColorArray[1];
            } else if ((currentPolicy != null) || (currentPolicy != undefined) || (currentPolicy != "")) {
                //remove all the * and spaces from the currentPolicy
                currentPolicy = currentPolicy.replace(/\*/g, '')
                currentPolicy = currentPolicy.replace(/\s/g, '')
                if (!currentPolicyAnswers.hasOwnProperty(currentPolicy)) {
                    // if currentPolicy is not already a property of currentPolicyAnswers, set its value to 0
                    currentPolicyAnswers[currentPolicy] = 0;
                }
                // increment the value of the currentPolicy property
                currentPolicyAnswers[currentPolicy]++;
                fillColor = currentColorArray[2];
            }

            //get the xposition of currentCX
            let currentCX = circles[i].getAttribute("cx")

            d3.select(circles[i])
                .transition()
                .delay(.003)
                .ease(d3.easeLinear)
                .attr("r", 8)
                .style("fill", fillColor);
        }

        let keyHTML = "";
        key.html(keyHTML);

        //call the change the key function by using the policy abbreviation
        this.changeTheKey(listOfPolicies, d, currentPolicyAnswers);
    },
    /*
    ==============================
    METHOD: change the key based on the policy selected
    1. Take the policy abbreviation and use it to get the description from the descriptions object
    2. Iterate through the counted totals and find the current policy abbreviation is in the object. when you do, find the percentages of the answers and create the html for the key
    ==============================
    */
    changeTheKey: function (countedTotals, d, countOfAnswers) {
        let currentQuestion = d
        let policyAbbr = policies[currentQuestion]
        let buttonText = window.BUTTONS;
        let currentContext = ''
        buttonText = JSON.parse(buttonText);
        //go through the buttonText object and find the current question
        for (let i = 0; i < buttonText.length; i++) {
            //if the Question property matches the current question, set the currentContext to the Context property
            if (buttonText[i].Question == currentQuestion) {
                currentContext = buttonText[i]
            }
        }

        let keyDescription = "<p class='keyDescription'>" + currentContext['Question'] + "</p>"
        var filteredTotals

        //iterate through all of the totals and determine if they have the policy abbreviation in the object
        for (let i = 0; i < countedTotals.length; i++) {
            if (countedTotals[i].hasOwnProperty(policyAbbr)) {
                filteredTotals = countedTotals[i]

                let currentArray = [Object.keys(filteredTotals)]
                //swap the places of the 'no' and 'some but not all' values in the array for collections

                //calculate the sum of all the total answers in countOfAnswers, no matter what the value ie
                let total = 0;
                for (let key in countOfAnswers) {
                    total += countOfAnswers[key];
                }
                //reorder countOfAnswers to that 'yes' is first, 'no' is last, and everything else is in between.
                let reorderedCountOfAnswers = {}
                if (policyAbbr == "COLLECTIONS") {
                    reorderedCountOfAnswers['Yes'] = countOfAnswers['Yes']
                    reorderedCountOfAnswers['Some,butnotall'] = countOfAnswers['Some,butnotall']
                    reorderedCountOfAnswers['No'] = countOfAnswers['No']
                } else {
                    // Add 'Yes' to the beginning of the reordered object
                    if ('Yes' in countOfAnswers) {
                        reorderedCountOfAnswers['Yes'] = countOfAnswers['Yes'];
                    }
                    // Add all answers except for 'Yes' and 'No' to the reordered object
                    for (let key in countOfAnswers) {
                        if (key !== 'Yes' && key !== 'No') {
                            reorderedCountOfAnswers[key] = countOfAnswers[key];
                        }
                    }
                    // Add 'No' to the end of the reordered object
                    if ('No' in countOfAnswers) {
                        reorderedCountOfAnswers['No'] = countOfAnswers['No'];
                    }
                }
                countOfAnswers = reorderedCountOfAnswers

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
                for (let key in countOfAnswers) {
                    //check to make sure the key isn't the policy abbreviation (i.e. FAP)
                    if (key != policyAbbr) {

                        // Create a new div element for the current property
                        let barDiv = document.createElement("div");
                        barDiv.id = key + "Bar";
                        barDiv.style.width = (countOfAnswers[key] / (total / 100)) + "%";

                        // use the current policy to access the corresponding color array from the colors object
                        let currentColorArray = colors[policyAbbr]

                        if (key === "Yes") {
                            barDiv.style.backgroundColor = currentColorArray[0];
                        } else if (key === "No") {
                            barDiv.style.backgroundColor = currentColorArray[1];
                        } else {
                            barDiv.style.backgroundColor = currentColorArray[2];
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
                        if (key == "Yes" || key == "No") {
                            p.innerText = `${currentContext[key]}`;
                            span.setAttribute("data-selection", key)
                        }
                        else if (currentContext['Abbreviation'] == "COLLECTIONS") {
                            let newKey = "Some, but not all"
                            p.innerText = `${newKey}`;
                            span.setAttribute("data-selection", 'Other')
                        } else {
                            p.innerText = `${key}`;
                            span.setAttribute("data-selection", 'Other')
                        }

                        span.appendChild(p);

                        // Append the span element to the key text wrapper
                        keyTextWrapper.appendChild(span);

                        //create a horizontal bar chart with the width of the values corresponding to the percentage of the total. make sure to give each bar a height and width of 100% so that they will stack on top of each other
                        let barDiv2 = document.createElement("div");
                        barDiv2.id = key + "Bar2";
                        barDiv2.style.height = '20px';
                        barDiv2.style.width = (countOfAnswers[key] / (total / 100)) + "%";
                        barDiv2.style.marginBottom = "3px";

                        // Set the background color based on the current property
                        if (key === "Yes") {
                            barDiv2.style.backgroundColor = currentColorArray[0];
                            barDiv2.setAttribute("data-selection", "Yes")
                        }
                        else if (key === "No") {
                            barDiv2.style.backgroundColor = currentColorArray[1];
                            barDiv2.setAttribute("data-selection", "No")
                        }
                        else {
                            barDiv2.style.backgroundColor = currentColorArray[2];
                            barDiv2.setAttribute("data-selection", "Other")
                        }
                        //create a text span with the count of the current answer and append it to the bar div
                        let textSpan = document.createElement("span");
                        textSpan.innerText = countOfAnswers[key];
                        textSpan.style.color = "white";
                        textSpan.style.fontSize = "12px";
                        textSpan.style.fontWeight = "bold";
                        textSpan.style.marginLeft = "3px";
                        barDiv2.appendChild(textSpan);

                        // Add the bar div to right before the barDiv2
                        barGraphDiv2.appendChild(barDiv2);
                    }

                    //reorder the children of keyBarGraph2 so that the bar with the data-selection attribute of "Yes" is the first child
                    let yesBar = barGraphDiv2.querySelector("[data-selection='Yes']");
                    let noBar = barGraphDiv2.querySelector("[data-selection='No']");
                    let otherBar = barGraphDiv2.querySelector("[data-selection='Other']");

                    keyWrapper.appendChild(keyTextWrapper);
                    keyWrapper.appendChild(barGraphDiv2);
                    keyDiv.appendChild(keyWrapper);
                }

                // Append the bar graph div to become the first element of key div element
                //keyDiv.insertBefore(barGraphDiv, keyDiv.firstChild);

                // Append the key div element to the key container div element
                key.html(keyDescription);
                let keyHTMLContainer = document.getElementById('keyHTMLContainer');
                key.node().appendChild(keyDiv);
            }
        }

    }
};


/*
------------------------------
SECTION: create the POLICY dropdown and populate it with the list of policies
------------------------------
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
 */

/*
------------------------------
SECTION: create the STATE dropdown and populate it with state names
------------------------------
*/
export const stateDropdown = d3
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
//insert the keyContainer to the end of the button container
export const key = d3.select("#keyHTMLContainer");
key.empty();
key.append("div").attr("id", "keyContainer");
