Untouched libarary with a little adapter to run on NodeJS 

* No DOM required
* uses the original Ext.require funktion (working dependency system) 


Installation:
npm install extjs-node


Usage: 

require("extjs-node");

Ext.require(['Ext.data.Model','Ext.data.reader.Json','Ext.data.writer.Json',"Ext.data.proxy.Memory"]);


Ext.define("Mock", {
           extend: "Ext.data.Model",
           fields: ['name'],
           proxy: {
           	   type: 'memory'
           	   }
});

var h = Mock.create({name:"Agebrock"});
console.dir(h);







