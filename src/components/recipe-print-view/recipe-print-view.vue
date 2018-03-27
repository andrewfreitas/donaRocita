<template>
  <body class="A4">
    <header class="dr-header">
      <img class="dr-header-logo" src="static/donarocita-logo.png" alt="Dona Rocita: Logotipo">
      <ul class="dr-header-list">
        <li class="dr-header-item">Fone/WhatsApp: 97358-4275</li>
        <li class="dr-header-item">Website: www.donarocita.com.br</li>
        <li class="dr-header-item">Facebook: www.facebook.com/donarocita</li>
        <li class="dr-header-item">Instagram: @donarocita</li>
        <li class="dr-header-item">E-mail: donarocita@gmail.com</li>
      </ul>
      <h1 class="dr-header-title">tabela de preços para Doces Finos</h1>
    </header>
    <table class="dr-values-table" v-for="recipeCategory in recipesArray">
        <caption class="dr-values-caption">
            {{recipeCategory.categoryName}}
        </caption>
        <tr class="dr-values-row" v-for="recipe in recipeCategory.categoryRecipes">
            <td class="dr-values-heading">
            <span class="dr-values-copy">{{recipe.name}}</span>
            </td>
            <td class="dr-values-price">
            <span class="dr-values-copy">{{recipe.unitPriceRecipeFormatted}}</span>
            </td>
        </tr>
    </table>
  </body>
</template>
<script>

import {db} from '@/components/shared/data-config/data-config.js';

    export default {
        name: 'recipePrintView',
        data () {
            return {
                recipes:[],
                recipeCategories:[],
                recipesArray:[]
            }
        },        
        created(){
            this.getRecipeCategories();
        },
        methods: {                    
            getRecipeCategories(){
                this.$bindAsArray(
                  'recipeCategories',
                  db.ref('rcita/recipeCategories'),
                  null,
                  () => this.getRecipes()
              );
            },
            getRecipes(){
                this.$bindAsArray(
                  'recipes',
                  db.ref('rcita/recipes'),
                  null,
                  ()=> this.getCategoriesX()
              );
            },          
            getCategoriesX(){

                 var categories = _.filter(this.recipeCategories, (f) => { 
                    return _.find(
                           _.sortedUniqBy(
                            _.map(this.recipes,function(item){ 
                              return item.recipeCategory}
                            )
                          ),(x) => x == f['.key'])});

                 this.getRecipeCategoriesX(categories);
            },
            getRecipeCategoriesX(recipeCategories){
                var thisRecipes =  this.recipes;
                var rArray =  this.recipesArray;

                _.each(recipeCategories,function(category){
                     var recipe = {
                            categoryId:category.id,
                            categoryName:category.name,
                            categoryRecipes:_.filter(thisRecipes,function(itemRecipe){ return itemRecipe.recipeCategory ==category['.key'] })
                        }
                    rArray.push(recipe);
                });

                this.recipesArray = rArray;
                this.$parent.$parent.$parent.$emit('hideDrawer');
            }        
        }               
    }
</script>
<style>




/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */
/* Document
   ========================================================================== */
/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */
html {
  line-height: 1.15;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */ }

/* Sections
   ========================================================================== */
/**
 * Remove the margin in all browsers.
 */
body {
  margin: 0; }

/**
 * Correct the font size and margin on `h1` elements within `section` and
 * `article` contexts in Chrome, Firefox, and Safari.
 */
h1 {
  font-size: 2em;
  margin: 0.67em 0; }

/* Grouping content
   ========================================================================== */
/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */
hr {
  box-sizing: content-box;
  /* 1 */
  height: 0;
  /* 1 */
  overflow: visible;
  /* 2 */ }

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */
pre {
  font-family: monospace, monospace;
  /* 1 */
  font-size: 1em;
  /* 2 */ }

/* Text-level semantics
   ========================================================================== */
/**
 * Remove the gray background on active links in IE 10.
 */
a {
  background-color: transparent; }

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */
abbr[title] {
  border-bottom: none;
  /* 1 */
  text-decoration: underline;
  /* 2 */
  text-decoration: underline dotted;
  /* 2 */ }

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */
b,
strong {
  font-weight: bolder; }

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd `em` font sizing in all browsers.
 */
code,
kbd,
samp {
  font-family: monospace, monospace;
  /* 1 */
  font-size: 1em;
  /* 2 */ }

/**
 * Add the correct font size in all browsers.
 */
small {
  font-size: 80%; }

/**
 * Prevent `sub` and `sup` elements from affecting the line height in
 * all browsers.
 */
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline; }

sub {
  bottom: -0.25em; }

sup {
  top: -0.5em; }

/* Embedded content
   ========================================================================== */
/**
 * Remove the border on images inside links in IE 10.
 */
img {
  border-style: none; }

/* Forms
   ========================================================================== */
/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */
button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  line-height: 1.15;
  /* 1 */
  margin: 0;
  /* 2 */ }

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */
button,
input {
  /* 1 */
  overflow: visible; }

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */
button,
select {
  /* 1 */
  text-transform: none; }

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */
button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button; }

/**
 * Remove the inner border and padding in Firefox.
 */
button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0; }

/**
 * Restore the focus styles unset by the previous rule.
 */
button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText; }

/**
 * Correct the padding in Firefox.
 */
fieldset {
  padding: 0.35em 0.75em 0.625em; }

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from `fieldset` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    `fieldset` elements in all browsers.
 */
legend {
  box-sizing: border-box;
  /* 1 */
  color: inherit;
  /* 2 */
  display: table;
  /* 1 */
  max-width: 100%;
  /* 1 */
  padding: 0;
  /* 3 */
  white-space: normal;
  /* 1 */ }

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */
progress {
  vertical-align: baseline; }

/**
 * Remove the default vertical scrollbar in IE 10+.
 */
textarea {
  overflow: auto; }

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */
[type="checkbox"],
[type="radio"] {
  box-sizing: border-box;
  /* 1 */
  padding: 0;
  /* 2 */ }

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto; }

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */
[type="search"] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */ }

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none; }

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to `inherit` in Safari.
 */
::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */ }

/* Interactive
   ========================================================================== */
/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */
details {
  display: block; }

/*
 * Add the correct display in all browsers.
 */
summary {
  display: list-item; }

/* Misc
   ========================================================================== */
/**
 * Add the correct display in IE 10+.
 */
template {
  display: none; }

/**
 * Add the correct display in IE 10.
 */
[hidden] {
  display: none; }

@page {
  margin: 0; }

body {
  margin: 0; }

.sheet {
  margin: 0;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  page-break-after: always; }

/** Paper sizes **/
body.A3 .sheet {
  width: 297mm;
  height: 419mm; }

body.A3.landscape .sheet {
  width: 420mm;
  height: 296mm; }

body.A4 .sheet {
  width: 210mm;
  height: 296mm; }

body.A4.landscape .sheet {
  width: 297mm;
  height: 209mm; }

body.A5 .sheet {
  width: 148mm;
  height: 209mm; }

body.A5.landscape .sheet {
  width: 210mm;
  height: 147mm; }

body.letter .sheet {
  width: 216mm;
  height: 279mm; }

body.letter.landscape .sheet {
  width: 280mm;
  height: 215mm; }

body.legal .sheet {
  width: 216mm;
  height: 356mm; }

body.legal.landscape .sheet {
  width: 357mm;
  height: 215mm; }

/** Padding area **/
.sheet.padding-10mm {
  padding: 10mm; }

.sheet.padding-15mm {
  padding: 15mm; }

.sheet.padding-20mm {
  padding: 20mm; }

.sheet.padding-25mm {
  padding: 25mm; }

/** For screen preview **/
@media screen {
  body {
    background: #e0e0e0; }
  .sheet {
    background: white;
    box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
    margin: 5mm auto; } }

/** Fix for Chrome issue #273306 **/
@media print {
  body.A3.landscape {
    width: 420mm; }
  body.A3, body.A4.landscape {
    width: 297mm; }
  body.A4 { margin-bottom: 2.5cm;
  } 
  body.A4, body.A5.landscape {
    width: 210mm; }
  body.A5 {
    width: 148mm; }
  body.letter, body.legal {
    width: 216mm; }
  body.letter.landscape {
    width: 280mm; }
  body.legal.landscape {
    width: 357mm; } }

.dr-header-list, .dr-schedule-list {
  list-style: none;
  margin: 0;
  padding: 0; }

.dr-values-heading, .dr-values-price {
  display: inline-block;
  padding-top: 20px;
  position: relative;
  z-index: 1; }

.dr-values-caption, .dr-schedule-heading {
  border-bottom: 1.5px solid #000;
  font-weight: bolder;
  padding: 25px 0;
  text-align: left;
  text-transform: uppercase; }

body.A4 {
  background: #fff;
  color: #000;
  font-family: Calibri, "Open Sans", sans-serif;
  font-size: 100%;
  line-height: 1.5;
  padding: 0 10%  }
  body:after {
    clear: both;
    content: '';
    display: table; }

.dr-header {
  float: left;
  width: 100%; }
  .dr-header:after {
    clear: both;
    content: '';
    display: table; }
  .dr-header-logo {
    float: left; }
  .dr-header-list {
    float: right; }
  .dr-header-item {
    font-size: 10pt;
    line-height: 1.25; }
  .dr-header-title {
    clear: both;
    float: left;
    font-size: 13pt;
    font-weight: bolder;
    line-height: 1.25;
    margin: 25px 0;
    text-align: center;
    text-transform: uppercase;
    width: 100%; }

.dr-values-table {
  border-collapse: collapse;
  font-size: 11pt;
  line-height: 1.25;
  margin-bottom: 25px;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
  width: 100%; }

.dr-values-sutitle {
  text-transform: lowercase; }

.dr-values-row {
  display: block;
  position: relative;
  z-index: 0; }
  .dr-values-row:after {
    bottom: 0;
    content: '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .  ';
    display: inline-block;
    left: 0;
    position: absolute;
    z-index: -1; }

.dr-values-heading {
  text-align: left;
  width: 79.25%; }

.dr-values-price {
  text-align: right;
  width: 20%; }

.dr-values-copy {
  background-color: #fff; }
  .dr-values-heading .dr-values-copy {
    padding-right: 5px; }
  .dr-values-price .dr-values-copy {
    padding-left: 5px; }

.dr-schedule {
  margin-bottom: 25px; }
  .dr-schedule-sutitle {
    text-transform: lowercase; }
  .dr-schedule-list {
    font-size: 11pt;
    line-height: 1.25; }
  .dr-schedule-item {
    display: block;
    padding-top: 20px; }
  .dr-schedule-total {
    font-weight: bolder; }




</style>