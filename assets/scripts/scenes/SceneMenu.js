// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var StateMachine = require("../lib/state-machine");
cc.Class({
    extends: cc.Component,

    properties: {
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
    },
    goAdsScene(){
        cc.log("come another scene");
        cc.director.preloadScene("SceneAds", function(completedCount, totalCount, item){
        }, function(error){
            cc.director.loadScene('SceneAds');
        });
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

      var fsm = new StateMachine({
        init: 'solid',
        transitions: [
          { name: 'melt',     from: 'solid',  to: 'liquid' ,timeOut:1000},
          { name: 'freeze',   from: 'liquid', to: 'solid'  },
          { name: 'vaporize', from: 'liquid', to: 'gas'    ,enableQueue:false},
          { name: 'condense', from: 'gas',    to: 'liquid' }
        ],
        methods: {
          onMelt:     function() { console.log('I melted')    },
          onFreeze:   function() { console.log('I froze')     },
          onVaporize: function() { console.log('I vaporized') },
          onCondense: function() { console.log('I condensed') }
        }
      });

      fsm.melt();
      fsm.freeze();
      fsm.vaporize();
    },

    // update (dt) {},
});
