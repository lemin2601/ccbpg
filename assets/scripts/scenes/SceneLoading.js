var crypto = require('crypto');
var HotUpdate = require("../base/HotUpdate");

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var EventName = require("../base/EventName");
cc.Class({
    extends   : cc.Component,
    properties: {
        progressBar    : {
            default: null,
            type   : cc.Node
        },
        label          : {
            default: null,
            type   : cc.Node
        },
        curProcessIndex: 0,
        isFree         : {
            serializable: false,
            visible     : false,
            default     : true
        },
        periodUpdate   : 3,
        dt             : {
            visible: false,
            default: 0
        },
        /** @type {HotUpdate}*/
        hotUpdate:HotUpdate,
        countReTryUpdate:0,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad(){
        cc.log("on Load");
        MGame.load();
        this.isFree = true;
        this.curProcessIndex = LoadingStep.NONE;
        this.hotUpdate = new HotUpdate();
        cc.systemEvent.on(EventName.UPDATE_CHECK_BEFORE_DONE, this.afterCheckUpdateResource, this);
        cc.systemEvent.on(EventName.HOT_UPDATE_DONE, this.afterUpdateRemoteAssetsDone, this);

    },
    start(){
        let progressBar = this.progressBar.getComponent(cc.ProgressBar);
        let sprite = this.progressBar.getContentSize();
        Log.log("progress bar  width:" + sprite.width);
        Log.log("progress bar width:" + this.progressBar.width);
        progressBar.totalLength = this.progressBar.getContentSize().width;
        Log.log("ahihi" + progressBar.totalLength);
        progressBar.progress = 0.1;
        progressBar.progress = 1;
        Log.error("progress: %s", progressBar.progress);

        cc.log("test mD5");
        var md5 = crypto.createHash('md5').update("abc").digest('hex');
        cc.log(md5);
        this.label.getComponent(cc.Label).string = md5;
        cc.log("---version 26 SceneLoading---");
    },
    update(dt){
        this.dt += dt;
        this.periodUpdate += dt;
        if(this.isFree && this.periodUpdate > 1){
            this.periodUpdate = 0;
            this.processNext();
        }
        this.updateUI();
    },
    onDestroy(){
        cc.log("onDestroy");
        cc.systemEvent.off(EventName.UPDATE_CHECK_BEFORE_DONE, this.afterCheckUpdateResource, this);
        cc.systemEvent.off(EventName.HOT_UPDATE_DONE, this.afterUpdateRemoteAssetsDone, this);
    },
    setFree(b){
        this.isFree = b;
    },
    /**
     *
     * @param event{Event}
     */
    afterCheckUpdateResource(event){
        cc.log("after check update Resource:" + JSON.stringify(event));
        this.setFree(true);
    },
    checkUpdateResource(){
        if(MConfig.needCheckBeforeUpdate){
            MGame.sendCheckBeforeUpdate();
        } else{
            this.setFree(true);
        }
    },
    /**
     *
     * @param event{Event}
     */
    afterUpdateRemoteAssetsDone:function(event){
        //2-need restart
        //1-newest, passed
        //0- can re-try update
        //-1 - failed updated
        var resultHotUpdate = event.resultHotUpdate;
        switch(resultHotUpdate){
            case 2:
                cc.audioEngine.stopAll();
                setTimeout(function(){
                    cc.game.restart();
                },0);
                break;
            case 1:
                this.setFree(true);
                break;
            case 0:
                this.countReTryUpdate ++;
                if(this.countReTryUpdate > 1){
                    if(MConfig.continueIfFailedUpdate){
                        this.setFree(true);
                    }else{
                        cc.game.end();
                    }
                }
                break;
            case -1:
                if(MConfig.continueIfFailedUpdate){
                    this.setFree(true);
                }else{
                    cc.game.end();
                }
                break;
        }
    },
    updateResource(){
        cc.log("update Resource");
        if(MConfig.needUpdate){
            this.hotUpdate.init();
            cc.log("udpate here .....updated ... ... ... ..1..");
            this.hotUpdate.checkUpdate();
            // this.hotUpdate.hotUpdate();
        }else{
            this.isFree = true;
        }
        //khoi tao
        //check update
        //  -> chua co
        //  -> da co
        //update



    },
    afterUpdateResource(){
        this.isFree = true;
    },
    loadResource(){
        cc.log("loadResource");
        this.isFree = true;
    },
    afterLoadDone(){
        cc.director.preloadScene("SceneMenu", function(completedCount, totalCount, item){
        }, function(error){
            cc.director.loadScene('SceneMenu');
        });
    },
    processNext(){
        this.curProcessIndex++;
        cc.log("processNext:" + LoadingStep[this.curProcessIndex]);
        this.isFree = false;
        switch(this.curProcessIndex){
            case LoadingStep.NONE:
                return;
            case LoadingStep.CHECK_BEFORE_UPDATE:
                this.checkUpdateResource();
                break;
            case LoadingStep.UPDATE:
                this.updateResource();
                break;
            case LoadingStep.AFTER_UPDATE:
                this.afterUpdateResource();
                break;
            case LoadingStep.LOAD_RESOURCE:
                this.loadResource();
                break;
            case LoadingStep.AFTER_DONE:
                this.afterLoadDone();
                break;
        }
    },
    updateUI(){
        this.label.getComponent(cc.Label).string = LoadingStep[this.curProcessIndex];

        let total = Object.keys(LoadingStep).length;
        let percent = (this.curProcessIndex + this.periodUpdate/1)/total;
        this.progressBar.getComponent(cc.ProgressBar).progress = percent;

    }
});
let LoadingStep = cc.Enum({
    NONE               : 1,
    CHECK_BEFORE_UPDATE: 2,
    UPDATE             : 3,
    AFTER_UPDATE       : 4,
    LOAD_RESOURCE      : 5,
    AFTER_DONE         : 6
});