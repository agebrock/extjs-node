This modules enables you to build your own extjs serverside modules.


After building your module no global "Ext" scope is used.

Requirements 
You need a working "unzip" binary (used by "install.sh").


Installation
#git clone git@github.com:agebrock/extjs-node.git
#git checkout builder
#npm install
 
or

"#npm install node-extjs@0.0.2rc2"
  

Trouble ?
If your system does not provide unzip and you don't want to change it,
you need to put the extjs sources in into the folder "./src/ext".
check "install.sh" for details.


Useage:

	Ext = require("../index.js");
	Ext.require("Ext.data.Model");
	
	//calling the build method will write the module to "$PWD/extjs-node.js"
	//this is useful if you plan to install the builder systemwide 
	Ext.nodejs.build();
	
	Ext.nodejs.build("/path/to/builded/extjs-node.js");
	
	
Notice the global Ext definition. currently we need that global for "Ext.data.Model" to find Ext while building.

The builded result will not define any globals.


Thanks for trying.

	





 








