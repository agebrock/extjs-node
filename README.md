This modules enables you to build your own extjs serverside modules.


#Installation

	git clone git@github.com:agebrock/extjs-node.git
	git checkout builder
	npm install
 
or

	npm install node-extjs@0.0.2rc2
  

#Useage

	Ext = require("../index.js");
	Ext.require("Ext.data.Model");
	
	Ext.nodejs.build();
	
	Ext.nodejs.build("/path/to/builded/extjs-node.js");
	
	
Notice the global Ext definition. currently we need that global for "Ext.data.Model" to find Ext while building.
The builded result will not define any globals.
