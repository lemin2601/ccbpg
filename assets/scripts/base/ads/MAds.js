// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var MAds = cc.Class({
    extends: cc.Component,

    properties: {
        txtLogs:{
            default:null,
            type:cc.Label
        },
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        config:{}
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initPlugin();

    },
    initPlugin(){
        this.initPluginUnityAds();
        this.initPluginAdMob();
    },

    //region Unity Ads
    initPluginUnityAds: function() {
        if ('undefined' == typeof sdkbox) {
            this.log('sdkbox is undefined');
            return;
        }

        if ('undefined' == typeof sdkbox.PluginUnityAds) {
            this.log('sdkbox.PluginUnityAds is undefined');
            return;
        }

        const self = this;
        sdkbox.PluginUnityAds.setListener({
            unityAdsDidClick: function(placementId) {
                self.log('unityAdsDidClick ' + placementId);
            },
            unityAdsPlacementStateChanged: function(placementId, oldState, newState) {
                self.log('unityAdsPlacementStateChanged:' + placementId + ' oldState:' + oldState + " newState:" + newState);
            },
            unityAdsReady: function(placementId) {
                self.log('unityAdsReady ' + placementId);
            },
            unityAdsDidError: function(error, message) {
                self.log('unityAdsDidError:' + error + ' message:' + message);
            },
            unityAdsDidStart: function(placementId) {
                self.log('unityAdsDidStart=' + placementId);
            },
            unityAdsDidFinish: function(placementId, state) {
                self.log('unityAdsDidFinish ' + placementId + ' state:' + state);
            }
        });
        sdkbox.PluginUnityAds.init();
    },
    showUnityAds(){
        //get all placement => show
        const placementId = '';
        if (sdkbox.PluginUnityAds.isReady(placementId)) {
            sdkbox.PluginUnityAds.show(placementId);
        } else {
            this.log('unityads is not ready');
        }
    },
    showUnityReward:function(){
        let configReward = MConfig.ads.unity.reward;
        let isSuccess = this._showUnityAdsWithPlacement(configReward);
        cc.log("Show Unity Reward:"  + isSuccess);
        return isSuccess;
    },
    showUnityBanner(){
        let config = MConfig.ads.unity.banner;
        let isSuccess = this._showUnityAdsWithPlacement(config);
        cc.log("Show Unity banner:"  + isSuccess);
        return isSuccess;
    },
    showUnityPlacement(){
        let config = MConfig.ads.unity.placement;
        let isSuccess = this._showUnityAdsWithPlacement(config);
        cc.log("Show Unity placement:"  + isSuccess);
        return isSuccess;
    },
    showUnityInterstitial(){
        let config = MConfig.ads.unity.reward;
        let isSuccess = this._showUnityAdsWithPlacement(config);
        cc.log("Show Unity interstitial:"  + isSuccess);
        return isSuccess;
    },
    _showUnityAdsWithPlacement(placement){
        let isSuccess = false;
        if(placement){
            if(Array.isArray(placement)){
                for(let i = 0; i < placement.length; i++){
                    let placementId = placement[i];
                    if(this._isReadyUnityAds(placementId)){
                        cc.log("Showing UnityAds with placement:" + placementId);
                        sdkbox.PluginUnityAds.show(placementId);
                        isSuccess = true;
                        break;
                    }
                }
            }else{
                if(this._isReadyUnityAds(placement)){
                    cc.log("Showing UnityAds with placement:" + placement);
                    sdkbox.PluginUnityAds.show(placement);
                    isSuccess = true;
                }
            }
        }
        cc.log("Show Unity Reward:"  + isSuccess);
        return isSuccess;
    },
    _isReadyUnityAds(placementId){
        if ('undefined' == typeof sdkbox) {return false;}

        if ('undefined' == typeof sdkbox.PluginUnityAds) {return false;}

        return sdkbox.PluginUnityAds.isReady(placementId);
    },
    //endregion

    //region AdMod
    initPluginAdMob: function() {
        if ('undefined' == typeof sdkbox) {
            this.log('sdkbox is undefined');
            return;
        }

        if ('undefined' == typeof sdkbox.PluginAdMob) {
            this.log('sdkbox.PluginAdMob is undefined');
            return;
        }

        const self = this;
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function(name) {
                self.log('adViewDidReceiveAd:'+name);
            },
            adViewDidFailToReceiveAdWithError: function(name, msg) {
                self.log('adViewDidFailToReceiveAdWithError:'+name+':'+msg);
            },
            adViewWillPresentScreen: function(name) {
                self.log('adViewWillPresentScreen:'+name);
            },
            adViewDidDismissScreen: function(name) {
                self.log('adViewDidDismissScreen:'+name);
            },
            adViewWillDismissScreen: function(name) {
                self.log('adViewWillDismissScreen:'+name);
            },
            adViewWillLeaveApplication: function(name) {
                self.log('adViewWillLeaveApplication:'+name);
            },
            reward: function(name, currency, amount) {
                self.log('reward:'+name+':'+currency+':'+amount);
            }
        });
        sdkbox.PluginAdMob.init();
    },

    showAdModBanner:function(){
        let config = MConfig.ads.adMod.banner;
        let isSuccess = this._showAdModAdsWithName(config);
        cc.log("Show AdMod banner:"  + isSuccess);
        return isSuccess;
    },

    showAdModReward:function(){
        let config = MConfig.ads.adMod.reward;
        let isSuccess = this._showAdModAdsWithName(config);
        cc.log("Show AdMod reward:"  + isSuccess);
        return isSuccess;
    },

    showAdModInterstitial:function(){
        let config = MConfig.ads.adMod.interstitial;
        let isSuccess = this._showAdModAdsWithName(config);
        cc.log("Show AdMod Interstitial:"  + isSuccess);
        return isSuccess;
    },

    _showAdModAdsWithName:function(adName){
        let isSuccess = false;
        if(adName){
            if(Array.isArray(adName)){
                for(let i = 0; i < adName.length; i++){
                    let subAdName = adName[i];
                    if(this._isReadyAdModAds(subAdName)){
                        cc.log("Showing AdMod ads with name:" + subAdName);
                        sdkbox.PluginAdMob.show(subAdName);
                        isSuccess = true;
                        break;
                    }
                }
            }else{
                if(this._isReadyAdModAds(adName)){
                    cc.log("Showing AdMod ads with name:" + adName);
                    sdkbox.PluginAdMob.show(adName);
                    isSuccess = true;
                }
            }
        }
        return isSuccess;
    },
    _isReadyAdModAds:function(adName,wantAutoCache){

        if ('undefined' == typeof sdkbox) {return false}

        if ('undefined' == typeof sdkbox.PluginAdMob) {return;}

        if(wantAutoCache == null) {wantAutoCache = true}

        if (sdkbox.PluginAdMob.isAvailable(adName)) {
            return true;
        } else {
            if(wantAutoCache){
                sdkbox.PluginAdMob.cache(adName);
            }
        }

        return false;
    },
    //endregion

    start () {

    },

    // update (dt) {},

    log(s){
        cc.log(s);
        let lines = this.txtLogs.string.split('\n');
        while (lines.length > 5) {
            lines.pop();
        }
        lines.unshift(s);
        this.txtLogs.string = lines.join('\n');
    }
});