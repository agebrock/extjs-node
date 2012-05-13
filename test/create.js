/**
to bad we need Ext defined as global. 
This will be fixed in the next release.
**/
Ext = require("../index.js");




Ext.require("Ext.data.Model");
Ext.nodejs.build();
// Thats it done 



require("colors");
console.log("$PWD/extjs-node.js".yellow, "should exist now and provide Ext.data.Model");

require("repl").start().context.Ext = Ext;

console.log("simply call", 'Ext.require("Ext.someModule")'.green, "include more modules.");
console.log("then call", 'Ext.nodejs.build();'.green, "this will save the modulestate to" ,"$PWD/extjs-node.js".yellow);

