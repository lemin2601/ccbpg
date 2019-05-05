let NetworkUtils = {
    get:function(url, callback){
        cc.log("get :" + JSON.stringify(url));
       let xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                cc.log("receive from url: %s, readyState: %s, status: %s",url,this.readyState ,this.status);
                cc.log(this.responseText);
                callback && callback(this.status,this.responseText);
            }
        };
        xhr.onerror = function(){
            callback && callback(404,'');
        };
        xhr.ontimeout = function(){
            callback && callback(404,'');
        };
        xhr.timeout = 5000;
        xhr.open("GET", url, true);
        xhr.send();
    }
};
window.NetworkUtils = NetworkUtils;