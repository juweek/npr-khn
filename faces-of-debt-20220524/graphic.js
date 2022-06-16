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

pym.then(child => {
    child.sendHeight();

    let wrapper = document.getElementById('profileCardsWrapper');

    for (const item in data) {
        let item_data = data[item]
        let name = item_data.name

        let newDiv = document.createElement("a");
        let newDivTextHolder = document.createElement("div");
        let newDivLink = document.createElement("a");
        newDivTextHolder.className = "textContainer";

        newDiv.className = "profileContainer";
        newDiv.id = "profileContainer" + item_data.key;
        newDiv.setAttribute("data-name", name);
        newDiv.classList.add((item_data.media).toLowerCase());
        newDiv.classList.add((item_data.textPlacement).toLowerCase());
        newDiv.classList.add('text' + (item_data.textAlignment).toLowerCase());
        newDiv.classList.add('image' + (item_data.imageAlignment).toLowerCase());
        console.log(item_data.media)
        if((item_data.media).toLowerCase() == 'image'){
          newDiv.style.backgroundImage = 'url(./assets/' + name.toLowerCase().replace(/\s/g, '') + ".jpg)";
        } else {
          newDiv.style.backgroundImage = 'url(./assets/' + name.toLowerCase().replace(/\s/g, '') + ".jpg)";
          let newVideo = document.createElement('video');
          let source = document.createElement('source');
          source.setAttribute("src", "./assets/" + name.toLowerCase().replace(/\s/g, '') + ".mp4");
          source.setAttribute('type', 'video/webm');
          newVideo.appendChild(source);
          newVideo.setAttribute('loop', '');
          newVideo.muted = true;
          newVideo.autoplay = true;
          newVideo.play();
          newDiv.appendChild(newVideo)
        }
        newDiv.style.backgroundSize = "cover";
        newDiv.style.backgroundPosition = "center";
        newDiv.style.backgroundRepeat = "no-repeat";

        let newDivText = document.createElement("h1");
        newDivText.className = "profileQuote";
        newDivText.innerHTML = '"' + item_data.quote + '"';

        let newDivLabel = document.createElement("h3");
        newDivLabel.className = "profileAmt";
        newDivLabel.innerHTML = 'Debt: $' + item_data.debt;
        if(mode == "npr") {
          newDiv.href = '' + item_data.anchorlink_npr
        } else {
          newDiv.href = '' + item_data.anchorlink
        }
        newDiv.setAttribute("target", "_parent");

        newDivTextHolder.appendChild(newDivText);
        newDivTextHolder.appendChild(newDivLabel);
        newDiv.appendChild(newDivTextHolder);
        //newDivLink.appendChild(newDiv)
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
