'use strict';
var path = require('path');
var fs = require('fs');
var os = require('os');
var crypto = require('crypto');
var zipFolder = require('zip-folder');

var manifestTemp = {
    packageUrl: 'http://localhost/tutorial-hot-update/remote-assets/',
    remoteManifestUrl: 'http://localhost/tutorial-hot-update/remote-assets/project.manifest',
    remoteVersionUrl: 'http://localhost/tutorial-hot-update/remote-assets/version.manifest',
    version: '1.0.0',
    assets: {},
    searchPaths: []
};
var dest = './remote-assets/';
var src = './jsb/';

var isEnable = true;
var mode = 'dev';
var pathProject = '';
var pathSrcBuild = '';
var pathRemoteAssets = '';
var callBackWhenFinish = null;
var listRelativePathZip = [
    'jsb-adapter'
];
var listRelativePathGenManifest = [
    'res',
    'src',
    'jsb-adapter.zip',
    'main.js',
    'project.json'
];

var listRelativePathCopyToRemoteAssets = [
    'res',
    'src',
    'jsb-adapter.zip',
    'main.js',
    'project.json'
];

/**
 * set root project +  root build
 * @param _pathProject
 * @param _pathSrcBuild
 */
function updatePathFromBuild(_pathProject,_pathSrcBuild){
    pathProject = _pathProject;
    pathSrcBuild = _pathSrcBuild;
    Editor.log("----updatePathFromBuild----");
    Editor.log("pathProject:" + pathProject);
    Editor.log("pathSrcBuild:" + pathSrcBuild);
}

/**
 * load from rootProject(baseProject)/config.json
 */
function updateFromConfigFile(){
    Editor.log("----updateFromConfigFile----");
    //read from config.json
    var configPath = path.join(pathProject, 'config.json');
    var config = fs.readFileSync(configPath, 'utf-8');
    try{
        config = JSON.parse(config);
        if(config.hotUpdate == null){throw "Missing config.hotUpdate"}
        config = config.hotUpdate;
        if(config.enable == null){throw "config.enable: true|fale"}
        if(config.pathRemoteAssets == null){throw "config.pathRemoteAssets = '/path-copy-src-to'"}
        isEnable = config.enable;
        pathRemoteAssets = config.pathRemoteAssets;
        if(isEnable){
            if(config.mode == null){throw "config.mode: 'dev|pri|pub'"}
            mode = config.mode;
            switch(mode){
                case "dev":
                    if(config.dev == null){throw "config.dev missing"}
                    var configDev = config.dev;
                    var nameInterface = configDev.nameInterface;
                    var allIpAddress = ip_local();
                    var ip = allIpAddress[nameInterface];
                    if(ip == null){ throw  "Can't get Ip Local with name:" + nameInterface +"| all:" + JSON.stringify(allIpAddress)}
                    manifestTemp.version = configDev.version;
                    manifestTemp.packageUrl = "http://" + ip + "/" + configDev.packageUrlExtra;
                    break;
                case "pri":
                    if(config.pri == null){throw "config.pri missing"}
                    manifestTemp.version = config.pri.version;
                    manifestTemp.packageUrl = config.pri.packageUrl;
                    break;
                case "pub":
                    if(config.pub == null){throw "config.pub missing"}
                    manifestTemp.version = config.pub.version;
                    manifestTemp.packageUrl = config.pub.packageUrl;
                    break;
            }
            manifestTemp.remoteManifestUrl = manifestTemp.packageUrl +"project.manifest";
            manifestTemp.remoteVersionUrl = manifestTemp.packageUrl +"version.manifest";
        }
    }catch(e){
        isEnable = false;
        Editor.log("Failed to read config: " + configPath);
        Editor.error(e);
        Editor.error("Try again");
    }
    Editor.log("pathRemoteAssets:" + pathRemoteAssets);
    Editor.log("manifestTemp:" + JSON.stringify(manifestTemp));
    Editor.log("enable:" + isEnable);
    Editor.log("mode:" + mode);
}

function updateCallBackFinish(callback){
    callBackWhenFinish = callback;
}
/**
 * khoi tao path zip neu co => listRelativePathZip.push(here)
 */
function initFileZip(){
    //nothing here => just set on listRelativePathZip
}

/**
 * khoi tao path se gen manifest
 */
function initFileGenManifest(){
    //nothing here -> let set on listRelativePathGenManifest
}


function processZipFile(){
    Editor.log("----processZipFile----");
    for(let i = 0; i < listRelativePathZip.length; i++){
        let relativePathWithZip = listRelativePathZip[i];
        compressFolder(pathSrcBuild,relativePathWithZip,doneZipFile);
    }
}
var countZipFileDone = 0;
function doneZipFile(path){
    if(path !== ''){
        countZipFileDone ++;
    }
    Editor.log("doneZipFile:" + path);
    if(countZipFileDone >= listRelativePathZip.length){
        processGenManifest();
    }
}
function processGenManifest(){
    Editor.log("----processGenManifest----");
    let manifest = manifestTemp;
    let src = pathSrcBuild;
    let dest = pathRemoteAssets;
    //update manifest
    for(let i = 0; i < listRelativePathGenManifest.length; i++){
        let relativePathGen = listRelativePathGenManifest[i];
        // Iterate res and src folder
        readDir(path.join(src, relativePathGen), manifest.assets);
    }

    //save
    var destManifest = path.join(dest, 'project.manifest');
    var destManifestOnBuild = path.join(src, 'project.manifest');
    var destVersion = path.join(dest, 'version.manifest');

    mkdirSync(dest);

    fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
        if (err) throw err;
        Editor.log('Manifest successfully generated =>' + destManifest);
    });
    fs.writeFile(destManifestOnBuild, JSON.stringify(manifest), (err) => {
        if (err) throw err;
        Editor.log('Manifest successfully generated => ' + destManifestOnBuild);
    });

    delete manifest.assets;
    delete manifest.searchPaths;
    fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
        if (err) throw err;
        Editor.log('Version successfully generated =>' + destVersion);
    });

    processCopyRemoteAssets();
}
function processCopyRemoteAssets(){
    Editor.log("----processCopyRemoteAssets----");
    //copy all listRelativePathGenManifest from srcBuildPath to pathRemoteAssets
    let src = pathSrcBuild;
    let dest = pathRemoteAssets;
    for(let i = 0; i < listRelativePathGenManifest.length; i++){
        let relativePath = listRelativePathGenManifest[i];
        copyRecursiveSync(path.join(src, relativePath),path.join(dest, relativePath));
    }
    Editor.log('Coppy resource successfully =>' + dest);
    finished();
}
function process(){
    processZipFile();
}
function finished(){
    Editor.log('finished');
    callBackWhenFinish && callBackWhenFinish();
}
var copyRecursiveSync = function(src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (exists && isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.linkSync(src, dest);
    }
};

function readDir (dir, obj) {
    var stat = fs.statSync(dir);
    if (stat.isDirectory()) {
        var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
        for (var i = 0; i < subpaths.length; ++i) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            subpath = path.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {
                readDir(subpath, obj);
            }
            else if (stat.isFile()) {
                // Size in Bytes
                size = stat['size'];
                md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
                compressed = path.extname(subpath).toLowerCase() === '.zip';

                relative = path.relative(pathSrcBuild, subpath);
                relative = relative.replace(/\\/g, '/');
                relative = encodeURI(relative);
                obj[relative] = {
                    'size' : size,
                    'md5' : md5
                };
                if (compressed) {
                    obj[relative].compressed = true;
                }
            }
        }
    }else if(stat.isFile()){
        // Size in Bytes
        size = stat['size'];
        md5 = crypto.createHash('md5').update(fs.readFileSync(dir, 'binary')).digest('hex');
        compressed = path.extname(dir).toLowerCase() === '.zip';

        relative = path.relative(pathSrcBuild, dir);
        relative = relative.replace(/\\/g, '/');
        relative = encodeURI(relative);
        obj[relative] = {
            'size' : size,
            'md5' : md5
        };
        if (compressed) {
            obj[relative].compressed = true;
        }
    }else{
        Editor.log("not exist:" + dir);
        return;
    }

}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path, { recursive: true });
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
};

function compressFolder(srcPath,relativePath,callback){
    let src = path.join(srcPath,relativePath);
    let des = path.join(srcPath,relativePath + '.zip');
    zipFolder(src, des, function(err) {
        if(err) {
            Editor.log('oh no!' + relativePath, err);
        } else {
            Editor.log('zip done:' + relativePath);
        }
        setTimeout(function(){
            callback(relativePath);
        },0);
    });

}
function genManifest(){
    if(!isEnable) {return}
    if(pathSrcBuild === '') {
        Editor.error("pathSrcBuild='' failed!!!");
        return;
    }
    var manifest = manifestTemp;
    var src = pathSrcBuild;
    var dest = path.join(pathRemoteAssets, mode);

    // Iterate res and src folder
    readDir(path.join(src, 'src'), manifest.assets);
    readDir(path.join(src, 'res'), manifest.assets);

    //compress jsb-adapter
    var isCommpress = compressFolder(path.join(src, 'jsb-adapter'),path.join(src, 'jsb-adapter.zip'));
    Editor.log(isCommpress);
    readDir(path.join(src, 'jsb-adapter.zip'), manifest.assets);


    var destManifest = path.join(dest, 'project.manifest');
    var destManifestOnBuild = path.join(src, 'project.manifest');
    var destVersion = path.join(dest, 'version.manifest');

    mkdirSync(dest);

    fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
        if (err) throw err;
        Editor.log('Manifest successfully generated =>' + destManifest);
    });
    fs.writeFile(destManifestOnBuild, JSON.stringify(manifest), (err) => {
        if (err) throw err;
        Editor.log('Manifest successfully generated => ' + destManifestOnBuild);
    });

    delete manifest.assets;
    delete manifest.searchPaths;
    fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
        if (err) throw err;
        Editor.log('Version successfully generated =>' + destVersion);
    });

    copyRecursiveSync(path.join(src, 'src'),path.join(dest, 'src'));
    copyRecursiveSync(path.join(src, 'res'),path.join(dest, 'res'));
    Editor.log('Coppy resource successfully =>' + dest);

}

function ip_local()
{
    var result = {};
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                result[ifname +":" +alias] = iface.address;
                // Editor.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                result[ifname] = iface.address;
                // Editor.log(ifname, iface.address);
            }
            ++alias;
        });
    });
    return result;
}

function onBuildStart(options, callback){

    Editor.log('Hot-update onBuildStart' +JSON.stringify(ip_local()));
    Editor.log(JSON.stringify(options));
    Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel
    callback();
}

function onBeforeChangeFiles(options, callback){
    Editor.log('Hot-update onBeforeChangeFiles');
    Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel
    callback();
}


function onBuildFinished(options, callback){
    //{
    //    "actualPlatform":"android",
    //    "android-instant":{
    //       "REMOTE_SERVER_ROOT":"",
    //       "host":"",
    //       "pathPattern":"",
    //       "recordPath":"",
    //       "scheme":"https",
    //       "skipRecord":false
    //    },
    //    "apiLevel":"android-28",
    //    "appABIs":[
    //       "armeabi-v7a"
    //    ],
    //    "appKey":"",
    //    "appSecret":"",
    //    "buildPath":"/Users/leemin/cocos/creator/project/baseProject/build",
    //    "debug":false,
    //    "dest":"/Users/leemin/cocos/creator/project/baseProject/build/jsb-link",
    //    "embedWebDebugger":false,
    //    "encryptJs":true,
    //    "excludeScenes":[
    //
    //    ],
    //    "excludedModules":[
    //
    //    ],
    //    "fb-instant-games":{
    //
    //    },
    //    "includeAnySDK":false,
    //    "includeSDKBox":false,
    //    "inlineSpriteFrames":true,
    //    "inlineSpriteFrames_native":true,
    //    "jailbreakPlatform":false,
    //    "md5Cache":false,
    //    "mergeStartScene":false,
    //    "oauthLoginServer":"",
    //    "optimizeHotUpdate":false,
    //    "orientation":{
    //       "landscapeLeft":true,
    //       "landscapeRight":true,
    //       "portrait":false,
    //       "upsideDown":false
    //    },
    //    "packageName":"org.cocos2d.baseProject",
    //    "platform":"android",
    //    "previewHeight":"720",
    //    "previewWidth":"1280",
    //    "privateKey":"",
    //    "qqplay":{
    //       "REMOTE_SERVER_ROOT":"",
    //       "orientation":"portrait",
    //       "zip":false
    //    },
    //    "scenes":[
    //       "98db2f7e-945d-4457-802d-c9b6d201ad16",
    //       "f7b4ba3d-082f-485f-8f69-85d31cf38b06"
    //    ],
    //    "sourceMaps":false,
    //    "startScene":"98db2f7e-945d-4457-802d-c9b6d201ad16",
    //    "template":"link",
    //    "title":"baseProject",
    //    "useDebugKeystore":true,
    //    "vsVersion":"auto",
    //    "webOrientation":"auto",
    //    "wechatgame":{
    //       "REMOTE_SERVER_ROOT":"",
    //       "appid":"wx6ac3f5090a6b99c5",
    //       "orientation":"portrait",
    //       "subContext":""
    //    },
    //    "xxteaKey":"lemin2601",
    //    "zipCompressJs":true,
    //    "project":"/Users/leemin/cocos/creator/project/baseProject",
    //    "projectName":"baseProject",
    //    "debugBuildWorker":false,
    //    "buildResults":null
    // }
    //gen project.json

    Editor.log('Hot-update onBuildFinished');
    // Editor.log('Building ' + options.platform + ' to ' + options.dest); // you can display a log in the Console panel

    //updateCallBackFinish => updatePathFromBuild => updateFromConfigFile => initFileZip => initFileGenManifest => process
    updateCallBackFinish(callback);
    updatePathFromBuild(options.project,options.dest);
    updateFromConfigFile();
    if(isEnable){
        initFileZip();
        initFileGenManifest();

        //processZipFile => doneZipFile => processGenManifest => processCopyRemoteAssets => finished
        process();
    }else{
        Editor.log("====>Passed not update manifest...");
        callback();
    }

    callback();
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