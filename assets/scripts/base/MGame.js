var EventName = require("EventName");
let MGame = {
    load:function(){
        MConfig.needCheckBeforeUpdate = MStorage.getBoolean(MStorageKey.NEED_CHECK_UPDATE,true);
        MConfig.needUpdate = MStorage.getBoolean(MStorageKey.NEED_CHECK_UPDATE,true);
        if(cc.sys.isBrowser){
            MConfig.needCheckBeforeUpdate = false;
            MConfig.needUpdate = false;
        }
        cc.loader.loadRes('configs/config.json', function (err, jsonAsset) {
            if(!err){

            }
            cc.log("loaded configs/config.json");
            cc.log(err);
            cc.log(jsonAsset.json);
        });
    },

    sendCheckBeforeUpdate:function(callbackDone){
        let callback = function(status, responseText){
            if(status === 4 && responseText !== ''){
                try{
                    let config = JSON.parse(responseText);

                    if(config["again"]){
                        MConfig.needCheckBeforeUpdate = config["again"];
                    }
                    if(config["continue"]){
                        MConfig.continueIfFailedUpdate = config["continue"];
                    }
                    if(config["update"]){
                        MConfig.needUpdate = config["update"];
                    }
                }catch(e){

                }
            }
            let event = new Event(EventName.UPDATE_CHECK_BEFORE_DONE);
            event.status = status;
            cc.systemEvent.dispatchEvent(event);
        };
        let url = MConfig.urlServices + "/check-need-update.html?game=" + MConfig.gameName +"&code=1";//1 is check need update or not
        url = "@host:@port/services/index.html".replace("@host",MConfig.urlServices).replace("@port",MConfig.portServices);
        // url = "http://192.168.1.6:8001/services/index.html";
        cc.error(url);
        NetworkUtils.get(url,callback);
    }
};

window.MGame = MGame;