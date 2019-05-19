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
    id:{
      visible:false,
      default:-1
    }
  },

  onLoad: function () {
    // cc.log("onLoad");
    this.node.active = false;
    this.imgAnimal.visible = false;
    this.node.selected = false;
    this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
    // this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onSelect.bind(this), this.node);
  },

  unuse: function () {
    // cc.log("unuse");
    this.node.selected = false;
    this.node.off(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
    // this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onSelect.bind(this), this.node);
  },

  reuse: function () {
    // cc.log("reuse");
    this.node.on(cc.Node.EventType.TOUCH_END, this.onSelect.bind(this), this.node);
    // this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onSelect.bind(this), this.node);
  },
  onSelect:function(){
    // this.setSelect(!this.isSelect);
    // cc.log("onSelect");
    if(this.sceneGame){
      this.sceneGame.checkAfterTouch(this);
    }
  },
  collecting:function(){
    cc.log("collecting:" + JSON.stringify(this.data));
    this.node.active = false;
  },
  setSelect:function(selected){
    cc.log("setSelect:" + selected);
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
    // cc.log("call init");
    this.node.active = true;
  },
  setScene:function(sceneGame){
    this.sceneGame = sceneGame;
  },
  _getPosition:function(x,y){
      let row = this.sceneGame.row;
      let col = this.sceneGame.col;
      let pos = cc.v2(width *(x - row/2 + 0.5) *scale, height * (y + 0.5 - col/2) * scale);
      // cc.log("_getPosition:" + JSON.stringify(this.data)+ this.x + "|"  + this.y + "|" + JSON.stringify(pos));
      return pos;
  },
  /**
   *
   * @param nodeAnimal {NodeAnimal}
   */
  setData:function(nodeAnimal){
    this.id = nodeAnimal.id;
    this.x = nodeAnimal.row;
    this.y = nodeAnimal.col;
    this.data = nodeAnimal;
    this.node.setPosition(this._getPosition(this.x,this.y));
    this.node.setScale(scale);
    // /** @type {cc.Label}*/
    // let label = this.getComponent("label");
    // label.node.visible = (false);
    // label.string = i +"," + j;
    // this.getComponent("imgAnimal").setVisible(false);

    if(this.id === undefined)return;
    let spriteName = 'ani_' + this.id;
    let sprite = this.imgAnimal;
    let self = this;
    // self.node.active = false;
    // cc.url.raw()
    cc.loader.loadRes('textures/animal', cc.SpriteAtlas, function (err, atlas) {
      // cc.log(JSON.stringify(err));
      let frame = atlas.getSpriteFrame(spriteName);
      if(frame == null){
        cc.error("can't find:" + spriteName);
      }else{
        sprite.spriteFrame = frame;
        self.node.active = true;
      }
    });

    this.label.string = this.x +"," + this.y;

    /** @type {cc.Node}*/
    // var imgAnimal = this.node.getChildByName("imgAnimal");
    // imgAnimal.visible = false;
    // imgAnimal.setVisible(false);
  }
});