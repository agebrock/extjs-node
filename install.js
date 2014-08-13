var Download = require('download');
var VERSION = '4.1.0'
var path = require('path');
var fs = require('fs');
var unzip = require('unzip');
var destFolder = path.resolve('./src');
var DecompressZip = require('decompress-zip');
console.log('Downloading from http://cdn.sencha.io/ext-' + VERSION + '-gpl.zip');
var download = new Download()
    .get('http://cdn.sencha.io/ext-' + VERSION + '-gpl.zip', path.resolve('./'), { extract: false});

download.run(function (err) {
    var unzipper;
    if (err) {
        throw err;
    }
    fs.renameSync(path.join('./', 'ext-' + VERSION + '-gpl.zip'), path.join('./', 'ext.zip'));
    if(fs.existsSync(path.join(destFolder, 'ext'))){
        fs.rmdirSync(path.join(destFolder, 'ext'));
    }
    unzipper = new DecompressZip(path.resolve('./ext.zip'))
    unzipper.on('error', function (err) {
        console.log('Caught an error ' + err.message);
    });
    unzipper.on('extract', function (log) {
        fs.renameSync(path.join(destFolder, 'extjs-' + VERSION), path.join(destFolder, 'ext'));
        console.log('Download complete');
    });
    unzipper.extract({
        path: destFolder,
        filter: function (file) {
            return file.type !== "SymbolicLink";
        }
    });


});