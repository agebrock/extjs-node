require("../index.js");

Ext.require("Ext.data.Model");
Ext.nodejs.writeState();

require("repl").start().context.Ext = Ext;
