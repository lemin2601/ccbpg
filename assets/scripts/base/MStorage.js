let MStorageKey = {
    NEED_UPDATE:"n_update",
    NEED_CHECK_UPDATE:"n_check_update",
};
let MStorage = {
    save:function(key, data){

    },
    /**
     * @param key
     * @param valueDefault
     * @returns {*|null|string}
     */
    get:function(key, valueDefault){
        let value;
        if(key == null){
            if(valueDefault !== undefined){
                value = valueDefault;
            }
        }else{
            value = localStorage.getItem(key);
        }
        return value;
    },
    getBoolean:function(key,valueDefault){
        let value = this.get(key,valueDefault);
        if(value == null){
            if(valueDefault !== undefined){
                if(typeof valueDefault !== "boolean"){
                    cc.error("MStorage: getBoolean %s-%s, default value not is boolean value",key,valueDefault);
                }
                value = valueDefault;
            }else{
                //default if not set
                value = false;
            }
        }else{
            value = value === "true";
        }
        return value;

    },
    setBoolean:function(key, value){
        let msgSave = "false";
        if(typeof value === "boolean"){
            msgSave = value?"true":"false";

        }
        else{
            cc.error("MStorage: setBoolean %s-%s, not boolean value",key,value);
            if(value){
                msgSave = "true";
            }else{
                msgSave = "false";
            }
        }
        this.save(key,msgSave);
    }
};

window.MStorageKey = MStorageKey;
window.MStorage = MStorage;