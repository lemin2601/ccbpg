let Log = {
    isDebug:true,
    log:function(){
        if(!this.isDebug) return;
        cc.log.apply(cc.log,arguments);
    },
    error:function(){
        if(!this.isDebug) return;
        cc.error.apply(cc.error,arguments);
    }
};

window.Log = Log;