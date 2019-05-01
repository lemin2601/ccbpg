'use strict';
var path = require('path');
var fs = require('fs');

function onBeforeBuildFinish(options, callback){
    //options.platform
    //options.dest
    Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel
    var mainJsPath = path.join(options.dest, 'main.js');  // get path of main.js in build folder
    var script = fs.readFileSync(mainJsPath, 'utf8');     // read main.js
    script += '\n' + 'window.myID = "01234567";';         // append any scripts as you need
    fs.writeFileSync(mainJsPath, script);                 // save main.js
    callback();
}

function onBuildStart(options, callback){
    Editor.log("On Build Start");

    callback();
}

function onBeforeChangeFiles(option,callback){
    Editor.log("On Before Change Files");

    Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel

    callback();
}

function onBuildFinished(option,callback){
    Editor.log("on Before Build Finished");

    callback();
}


module.exports = {
    load(){
        Editor.Builder.on('build-start', onBuildStart);
        Editor.Builder.on('before-change-files', onBeforeChangeFiles);
        Editor.Builder.on('build-finished', onBuildFinished);

        Editor.Builder.on('before-change-files', onBeforeBuildFinish);
    },
    unload(){
        Editor.Builder.removeListener('build-start', onBuildStart);
        Editor.Builder.removeListener('before-change-files', onBeforeChangeFiles);
        Editor.Builder.removeListener('build-finished', onBuildFinished);

        Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
    },
    // register your ipc messages here
    messages: {
        'open'(){
            // open entry panel registered in package.json
            Editor.Panel.open('hot-update');
        },
        'say-hello'(){
            Editor.log('Hello World!');
            // send ipc message to panel
            Editor.Ipc.sendToPanel('hot-update', 'hot-update:hello');
        },
        'clicked'(){
            Editor.log('Button clicked!');
        }
    }
};