/*
------------------------------
Export the click event handlers, the click event listeners, and the element that makes the button clickable
------------------------------
*/

// Export the event handlers
export const clickHandlers = {
    // When the user clicks on the dropdown button, toggle between hiding and showing the dropdown content
    buttonClicked: function () {
        let sideColumn = document.getElementById("fixedSideColumn");

        //toggle the display property of the side column
        let currentClassList = sideColumn.classList;
        currentClassList.toggle("hidden");

        let listofSideColumnHospital = document.getElementsByClassName("sideColumnHospital");
        for (let i = 0; i < listofSideColumnHospital.length; i++) {
            let currentHospital = listofSideColumnHospital[i];
            let currentClassList = currentHospital.classList;
            currentClassList.toggle("visible");
        }
    }
};