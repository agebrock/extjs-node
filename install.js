var Download = require('download');
var VERSION = '4.1.0'
var path = require('path');
var fs = require('fs');
var unzip = require('unzip');
var destFolder = path.resolve('./src');
console.log('Downloading from http://cdn.sencha.io/ext-' + VERSION + '-gpl.zip');
var download = new Download()
    .get('http://cdn.sencha.io/ext-' + VERSION + '-gpl.zip', path.resolve('./'), { extract: false});

download.run(function (err) {
    if (err) {
        throw err;
    }
    fs.renameSync(path.join('./', 'ext-' + VERSION + '-gpl.zip'), path.join('./', 'ext.zip'));
    reader = fs.createReadStream(path.join('./', 'ext.zip'));
    reader.on('close', function () {
        fs.renameSync(path.join(destFolder, 'extjs-' + VERSION), path.join(destFolder, 'ext'));
        console.log('Download complete');

    });
    reader.pipe(unzip.Extract({ path: destFolder }));
});