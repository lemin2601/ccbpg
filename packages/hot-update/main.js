'use strict';
var path = require('path');
var fs = require('fs');

function onBuildStart(options, callback){
    Editor.log('Hot-update onBuildStart');
    Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel
}

function onBeforeChangeFiles(options, callback){
    Editor.log('Hot-update onBeforeChangeFiles');
    Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel
}


function onBuildFinished(options, callback){
    Editor.log('Hot-update onBuildFinished');
    Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel
}



module.exports = {
    load(){
        // execute when package loaded
        Editor.Builder.on('build-start', onBuildStart);
        Editor.Builder.on('before-change-files', onBeforeChangeFiles);
        Editor.Builder.on('build-finished', onBuildFinished);
    },
    unload(){
        // execute when package unloaded
        Editor.Builder.removeListener('build-start', onBuildStart);
        Editor.Builder.removeListener('before-change-files', onBeforeChangeFiles);
        Editor.Builder.removeListener('build-finished', onBuildFinished);
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