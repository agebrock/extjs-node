var fs = require("fs");


var sourceCollection =
//ExtCore minimal definition + loader
["/Ext.js"
,"/version/Version.js"
,"/lang/String.js"
,"/lang/Array.js"
,"/lang/Number.js"
,"/lang/Date.js"
,"/lang/Object.js"
,"/lang/Function.js"
,"/class/Base.js"
,"/class/Class.js"
,"/class/ClassManager.js"
,"/util/TaskManager.js"
,"/util/Format.js"
,"/class/Loader.js"
,"/util/DelayedTask.js"
,"/util/Event.js"];


var ext_core_path = __dirname + '/ext/src/core/src';

var combineFiles = function(prefix, fileList){
    var data =  fileList.map(function(file){ return fs.readFileSync(prefix + file) });
    return data;
}

var sourceList = combineFiles(ext_core_path, sourceCollection);

eval(sourceList.join(" "))


Ext.Loader.setConfig({
    enabled: true,
	paths: {
		'Ext':  __dirname + "/ext/src/",
		'xExt': __dirname + "/xext/"
    }
});


var window = {
    status:__defineSetter__("status", function(debugStatusMsg){
        console.log(debugStatusMsg);
    })
}

Ext.Error = {
raise:function(msg){
    console.log("----------------ExtJS ERROR----------------");
    console.error(msg)
}
}

    /**
     * Execute a callback function in a particular scope. If no function is passed the call is ignored.
     * @param {Function} callback The callback to execute
     * @param {Object} scope (optional) The scope to execute in
     * @param {Array} args (optional) The arguments to pass to the function
     * @param {Number} delay (optional) Pass a number to delay the call by a number of milliseconds.
     */
    Ext.callback = function(callback, scope, args, delay){
        if(Ext.isFunction(callback)){
            args = args || [];
            scope = scope || window;
            if (delay) {
                Ext.defer(callback, delay, scope, args);
            } else {
                callback.apply(scope, args);
            }
        }
    };



//fs.writeFileSync(__dirname + '/core.js', sourceList.join(""));

//module.exports = require(__dirname + "/core");



