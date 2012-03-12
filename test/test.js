var myExt = require("./extjs-node.js");
var i=0;

if (typeof Ext == "undefined")
    console.log("global Ext not defined");i++;
if (typeof myExt == "object")
    console.log("customExt defined");i++;
if (typeof myExt.data.Model == "object")
    console.log("customExt.model.Data");i++;

if(i==3)
    console.log("ALL PERFECT");
else
    console.log("SOMETHING IS WRONG");

