var fs = require("fs");

var extBasePath = __dirname + "/src/ext/src";

var sourceCollection =
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


var ext_core_path = extBasePath + '/core/src';

var combineFiles = function(prefix, fileList){
    var data =  fileList.map(function(file){ return fs.readFileSync(prefix + file) });
    return data;
}

var combineFilesWithHeader = function(header, fileList){
   
    var data =  fileList.map(function(file){ return header + "\n" + fs.readFileSync(file) });
    return data;
}


var preCore = [
    'var Ext = module.exports',
    'var extBasePath = "' + extBasePath+'"',
    ''
]

var sourceList = combineFiles(ext_core_path, sourceCollection);


var src = sourceList.join(" ") + "\n" + fs.readFileSync(__dirname + '/patch/post-core.js').toString();

eval(src);





Ext.nodejs = {};

Ext.nodejs.build = function(path){

    path = path || 'extjs-node.js';

    var h = Ext.Loader.history.map(function(item){ return Ext.Loader.classNameToFilePathMap[item]});
    var header = '';// 'var Ext = require("' + __dirname + "/ext-core.js" +'");';
    var loaded = JSON.stringify(Ext.Loader.isFileLoaded);
    
    var content = [
        preCore.join(';' + "\n"),
        src,
        "Ext.Loader.isFileLoaded=" + loaded + ";",
        combineFilesWithHeader(header, h).join(" "),
        ''
    ].join("\n")
    
    fs.writeFileSync(path,   content  );
}


//required since 4.1
module.exports = Ext;




