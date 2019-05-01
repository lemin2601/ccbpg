window.__require = function e(o, t, r) {
function s(c, i) {
if (!t[c]) {
if (!o[c]) {
var p = c.split("/");
p = p[p.length - 1];
if (!o[p]) {
var a = "function" == typeof __require && __require;
if (!i && a) return a(p, !0);
if (n) return n(p, !0);
throw new Error("Cannot find module '" + c + "'");
}
}
var u = t[c] = {
exports: {}
};
o[c][0].call(u.exports, function(e) {
return s(o[c][1][e] || e);
}, u, u.exports, e, o, t, r);
}
return t[c].exports;
}
for (var n = "function" == typeof __require && __require, c = 0; c < r.length; c++) s(r[c]);
return s;
}({
Config: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "54aefLR3nZLeYfHedD1qYVp", "Config");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {}
});
cc._RF.pop();
}, {} ],
Game: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "64056iYtsJKlqua0BFTxRUJ", "Game");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {}
});
cc._RF.pop();
}, {} ],
Global: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "e6a5cBRghVJkbkyzRSq4E78", "Global");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {}
});
cc._RF.pop();
}, {} ],
Log: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "a5a545zsFxI/L4OrDsMyWso", "Log");
var r = {
isDebug: !0,
log: function() {
this.isDebug && cc.log.apply(cc.log, arguments);
},
error: function() {
this.isDebug && cc.error.apply(cc.error, arguments);
}
};
window.Log = r;
cc._RF.pop();
}, {} ],
NetworkUtils: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "84d361DTe1PmpeD92+t7CWv", "NetworkUtils");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {}
});
cc._RF.pop();
}, {} ],
SceneLoading: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "a81c1ftUhJLALFhaobMUPbR", "SceneLoading");
cc.Class({
extends: cc.Component,
properties: {
progressBar: {
default: null,
type: cc.Node
}
},
onLoad: function() {},
start: function() {
var e = this.progressBar.getComponent(cc.ProgressBar), o = this.progressBar.node.getContentSize();
Log.log("progress bar width:" + o.width);
Log.log("progress bar width:" + this.progressBar.width);
e.totalLength = this.progressBar.node.getContentSize().width;
Log.log("ahihi" + e.totalLength);
e.progress = .1;
e.progress = 1;
Log.error("progress: %s", e.progress);
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Config", "Game", "Global", "Log", "NetworkUtils", "SceneLoading" ]);