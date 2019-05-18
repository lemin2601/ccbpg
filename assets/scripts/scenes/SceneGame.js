// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var SceneGame = cc.Class({
  extends   : cc.Component,
  properties: {
    animalPrefab: cc.Prefab,
    animalPool  :{
      type:cc.NodePool,
      visible:false
    }
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
  // LIFE-CYCLE CALLBACKS:
  onLoad(){
    cc.log("onLoad");
    this._loadPrefabs();
  },
  start(){
    for(let i = 0; i < 10; i++){
      for(let j = 0; j < 10; j++){
        let animal = this._createAnimalPrefabs(this.node);
        animal.getComponent("Animal").setData(i,j);

      }
    }
    cc.log('create animal ');

  },
  _loadPrefabs:function(){
    this.animalPool = new cc.NodePool();
    let initCount = 50;
    for(let i = 0; i < initCount; ++i){
      let animal = cc.instantiate(this.animalPrefab); // create node instance
      animal.getComponent("Animal").unuse();
      this.animalPool.put(animal); // populate your pool with put method
      cc.log("push to pool");
    }
    cc.log('_load Prefabs done');
  },
  _createAnimalPrefabs:function(parentNode){
    let animal = null;
    cc.log("pool size:" + this.animalPool.size());
    if (this.animalPool.size() > 0) { // use size method to check if there're nodes available in the pool
      animal = this.animalPool.get();
      animal.getComponent("Animal").reuse();
    } else { // if not enough node in the pool, we call cc.instantiate to create node
      animal = cc.instantiate(this.animalPrefab);
    }
    animal.parent = parentNode; // add new enemy node to the node tree
    animal.getComponent('Animal').init(); //initialize enemy
    /** @type {Animal}*/
    let animalScripts = animal.getComponent('Animal');
    animalScripts.init();
    animalScripts.setScene(this);

    return animal;
  },
  _poolAnimal:function(animal){
    // enemy should be a cc.Node instance
    this.animalPool.put(animal); // using the same put method as inistalizing node pool, this will also call removeFromParent for the node
  },
  /**
   *
   * @param animal {Animal}
   */
  checkAfterTouch:function(animal){
    cc.log("Scene Check after touch:" + animal.x +"|" + animal.y);
  }
  // update (dt) {},
});
