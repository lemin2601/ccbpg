var SceneGame = require("../SceneGame");
var width = 170;
var height = 170;
var scale = 0.3;
var Animal = cc.Class({
  extends: cc.Component,
  properties:{
    label:cc.Label,
    imgBg:cc.Sprite,
    imgAnimal:cc.Sprite,
    btn:cc.Button,
    isSelect:false,
    spriteSelected:cc.SpriteFrame,
    spriteNoSelect:cc.SpriteFrame,
    sceneGame:SceneGame,
    x:-1,
    y:-1,
  },

  onLoad: function () {
    cc.log("onLoad");
    this.node.selected = false;
    this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
    // this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onSelect.bind(this), this.node);
  },

  unuse: function () {
    cc.log("unuse");
    this.node.off(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
    // this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onSelect.bind(this), this.node);
  },

  reuse: function () {
    cc.log("reuse");
    this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
    // this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onSelect.bind(this), this.node);
  },
  onSelect:function(){
    this.setSelect(!this.isSelect);
    cc.log("onSelect");
    if(this.sceneGame){
      this.sceneGame.checkAfterTouch(this);
    }
  },
  setSelect:function(selected){
    this.isSelect = selected;
    this.updateUI();
  },
  updateUI:function(){
    if(this.isSelect){
      this.btn.normalSprite = this.spriteSelected;
    }else{
      this.btn.normalSprite = this.spriteNoSelect;
    }
  },
  init:function(){
    cc.log("call init");
  },
  setScene:function(sceneGame){
    this.sceneGame = sceneGame;
  },
  _getPosition:function(x,y){
      let row = 10;
      let col = 10;
      let pos = cc.v2(width *(x - row/2 + 0.5) *scale, height * (y + 0.5 - col/2) * scale);
      cc.log(x + "|"  + y + "|" + JSON.stringify(pos));
      return pos;
  },
  setData:function(i, j){
    this.x = i;
    this.y = j;
    this.node.setPosition(this._getPosition(i,j));
    this.node.setScale(scale);
    // /** @type {cc.Label}*/
    // let label = this.getComponent("label");
    // label.node.visible = (false);
    // label.string = i +"," + j;
    // this.getComponent("imgAnimal").setVisible(false);
    this.label.string = i +"," + j;
    /** @type {cc.Node}*/
    // var imgAnimal = this.node.getChildByName("imgAnimal");
    // imgAnimal.visible = false;
    // imgAnimal.setVisible(false);
  }
});