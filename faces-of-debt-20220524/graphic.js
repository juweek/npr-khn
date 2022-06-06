var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");

pym.then(child => {
    child.sendHeight();


    let wrapper = document.getElementById('profileCardsWrapper');

    for (const item in data) {
        let item_data = data[item]
        let name = item_data.name
   
        let newDiv = document.createElement("div");
        newDiv.className = "profileContainer";
        newDiv.id = "profileContainer" + item_data.key;
        newDiv.setAttribute("data-name", name);   
        newDiv.style.backgroundImage = 'url(./assets/' + name.toLowerCase().replace(/\s/g, '') + ".jpg)";
        newDiv.style.backgroundSize = "cover";
        newDiv.style.backgroundPosition = "center";
        newDiv.style.backgroundRepeat = "no-repeat";
      
        let newDivText = document.createElement("h2");
        newDivText.className = "profileQuote";
        newDivText.innerHTML = '"' + item_data.quote + '"';

        let newDivLabel = document.createElement("span");
        newDivLabel.className = "profileAmt";
        newDivLabel.innerHTML = '$' + item_data.debt;

        newDiv.appendChild(newDivText);
        newDiv.appendChild(newDivLabel);
        wrapper.appendChild(newDiv);
      }
      

    // child.onMessage("on-screen", function(bucket) {
    //     ANALYTICS.trackEvent("on-screen", bucket);
    // });
    // child.onMessage("scroll-depth", function(data) {
    //     data = JSON.parse(data);
    //     ANALYTICS.trackEvent("scroll-depth", data.percent, data.seconds);
    // });

    window.addEventListener("resize", () => child.sendHeight());
});
