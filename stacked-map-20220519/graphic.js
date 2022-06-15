var pym = require("./lib/pym");
var ANALYTICS = require("./lib/analytics");
require("./lib/webfonts");
var { isMobile } = require("./lib/breakpoints");

var mode = null;
if (document.querySelector("body").classList.contains("npr")) {
  mode = "npr";
}
if (document.querySelector("body").classList.contains("khn")) {
  mode = "khn";
}

switch (mode) {
  case "khn":
    require("../_base/webfonts_khn.js");
    break;
  case "npr":
    require("../_base/webfonts_npr.js");
    break;
  default:
    require("./lib/webfonts");
    break;
}

pym.then((child) => {
  var svgElement = document.getElementById("treeMapContainer");
  var buttonElements = document.querySelectorAll(".buttonsContainer button");
  var chartElements = document.querySelectorAll("#treeMapContainer > div");

  /*
------------------------------
METHOD: button click interaction
------------------------------
*/

let currentMap = document.getElementById('medicalMap')
switch (mode) {
  case "khn":
   currentMap.src = "./medicalDebtMapKHN.svg"
   break;
  case "npr":
    currentMap.src = "./medicalDebtMap.svg"
    break;
}

  buttonElements.forEach((element) =>
    element.addEventListener("click", (event) => {
      buttonElements.forEach((button) => {
        button.classList.remove("active");
      });

      let currentFilter = event.target.dataset.filter;

      chartElements.forEach((chart) => {
        if (currentFilter == chart.dataset.chart) {
          chart.classList.add("active");
        } else {
          chart.classList.remove("active");
        }
      });

      event.target.classList.add("active");

      svgElement.classList = "";
      svgElement.classList.add(event.target.dataset.filter);
    })
  );

  child.sendHeight();

  window.addEventListener("resize", () => child.sendHeight());
});
