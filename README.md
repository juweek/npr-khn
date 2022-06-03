# npr-khn

Graphics are built in a way that allows for different styling on KHN vs. NPR's site. Approach:

### Shared resources

Project-specific files that should be referenced by all graphics live in the root [`_base`](https://github.com/juweek/npr-khn/tree/main/_base) folder. This includes

* Header and footer includes
* KHN and NPR-specific webfonts ([documentation for the webfont loader JS](https://github.com/typekit/webfontloader))
* KHN and NPR-specific CSS overrides

**[khn-npr.less](https://github.com/juweek/npr-khn/blob/main/_base/khn-npr.less)**

The CSS in this file keys off a class in the `body` tag to set fonts, colors. For example:

KHN-specific CSS variables for a headline:

```
body.khn {
  --title-font: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  --title-weight: bold;
  --title-color: #333;
  --title-size: 22px;
}
```

NPR-specific styles:

```
body.npr {
  --title-font: 'Gotham SSm', Helvetica, Arial, sans-serif;
  --title-weight: normal;
  --title-color: #666;
  --title-size: 20px;
```

How those vars are applied:

```
h1 {
  font-family: var(--title-font, sans-serif);
  font-weight: var(--title-weight, bold);
  color: var(--title-color, #333);
  font-size: var(--title-size, 20px);
}
```

This file may be best used for style overrides that are relevant across all or most graphics. If there are fiddly overrides specific to a single graphic, write those in the graphic's own `graphic.less` file.


### Graphic structure

Modifications for each graphic:

**The graphic itself**

Open `index.html` and move the "guts" of the graphic — everything between the header/footer includes, but not those includes — to a separate include file.

For example: `partials/_chart.html`

**khn.html (new file)**

The contents should look something like:

```
<%= await t.include("../_base/_head.html", { slug, config, mode: "khn" }) %>

<%= await t.include("partials/_chart.html", { COPY }) %>

<%= await t.include("../_base/_foot.html") %>
```

The `mode` param is passed to the header include, which uses it to apply a class to the `body` tag: `<body class="khn">`.

The `COPY` object passed to `_chart.html` is the spreadsheet content. (This doesn't always travel to includes, so it's best to be explicit about it.)

**npr.html (new file)**

The contents should be the same as `khn.html`, except in the first line for the header include, set `mode: "npr"`.

**index.html**

We're not going to be embedding this anywhere, but it is useful for the file to still exist. Delete the contents of the page, and replace with:

```
<p>Select one ^^</p>
```

**graphic.less**

At the top, beneath any existing import statements, add a referencce to the `khn-npr.less` file.

```
@import "../_base/khn-npr.less";
```

You can add any overrides specific to this one graphic here.

**graphic.js**

Set a var at the top of the file to identify the correct parent site (khn vs. npr), based on the class set on the `body` tag.

```
var mode = null;
if (document.querySelector("body").classList.contains("npr")) {
  mode = "npr";
}
if (document.querySelector("body").classList.contains("khn")) {
  mode = "khn";
}
```

Replace the line of code to import webfonts to this, so we pull the appropriate font files:

```
switch(mode) {
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
```
