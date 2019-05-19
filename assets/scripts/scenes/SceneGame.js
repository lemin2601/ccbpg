// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var AnimalGenMap = require("game/AnimalGenMap");
var StateMachine = require("../lib/state-machine");
var camelize = require("../lib/state-machine");
var StateMachineVisualize = require("../lib/state-machine-visualize");
// var Animal = require("game/Animal");

var State = {
  IDLE:"idle",
  SELECT_1:"select_1",
  SELECT_2:"select_two",
  CHECK:"check",
  PAUSE:"pause",
  TIMEOUT:"timeout",
  WIN:"win",
  ENDGAME:"endGame",
  ANY:"*"
};
var Transition = {
  PLAY:"play",
  PAUSE:"pause",
  RESUME:"resume",
  SELECT:"select",
  DE_SELECT:"de-select",
  WIN:"win",
  TIMEOUT:"t_timeout",
  END_GAME:"t_end-game"
};

var SceneGame = cc.Class({
  extends   : cc.Component,
  properties: {
    //ui
    progressBar:{
      type:cc.ProgressBar,
      default:null
    },
    animalPrefab: cc.Prefab,
    animalPool  :{
      type:cc.NodePool,
      visible:false
    },
    btnPauseOrResume:{
      type:cc.Button,
      default:null
    },


    //logic
    /** @type {StateMachine}*/
    fsm:{
      type:StateMachine,
      visible:false,
      default:null
    },
    totalTime:100,//s
    remainTime:100,//s
    isPause:true,
    row:10,
    col:5,
    previousAnimalSelect:{
      default:null,
      visible:false,
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad(){
    cc.log("onLoad");
    this._loadPrefabs();
    this._initStateMachine();

    let animalGenMap = new AnimalGenMap();
    // animalGenMap.testAStar();
    let row = this.row;
    let col = this.col;
    let idContainer = [1,2,3,4,5,6,7,8,9];
    // // animalGenMap.gen(6,5,[1,2,3,4]);
    let mapContainer = animalGenMap.genSimple(row,col,idContainer);
    cc.log(JSON.stringify(mapContainer));
    cc.log(mapContainer.length);
    for(let i = 0; i < mapContainer.length; i++){
      let node = mapContainer[i];
      let animal = this._createAnimalPrefabs(this.node);
      animal.getComponent("Animal").setData(node);

    }
    this.autoStart();

  },
  start(){
    // for(let i = 0; i < 10; i++){
    //   for(let j = 0; j < 10; j++){
    //     let animal = this._createAnimalPrefabs(this.node);
    //     animal.getComponent("Animal").setData(i,j);
    //
    //   }
    // }
    // cc.log('create animal ');

    // cc.log("test animal gen map");

  },

  update (dt) {
    this._updateTimeOut(dt);

  },
  //region handle statemachine
  _initStateMachine:function(){
    let methods = {};
    methods[StateMachine.keyMethod('on',Transition.PLAY)] = this._onPlay.bind(this);
    methods[StateMachine.keyMethod('onBefore',Transition.SELECT)] = this._onSelect.bind(this);
    // methods[StateMachine.keyMethod('on',State.SELECT_2)] = this._onCheck.bind(this);
    methods[StateMachine.keyMethod('on',Transition.PAUSE)] = this._onPause.bind(this);
    methods[StateMachine.keyMethod('on',Transition.RESUME)] = this._onResume.bind(this);
    methods[StateMachine.keyMethod('on',Transition.DE_SELECT)] = this._onDeSelect.bind(this);
    methods[StateMachine.keyMethod('on',Transition.WIN)] = this._onWin.bind(this);
    methods[StateMachine.keyMethod('on',Transition.END_GAME)] = this._onEndGame.bind(this);
    methods[StateMachine.keyMethod('on',Transition.TIMEOUT)] = this._onTimeOut.bind(this);
    // methods[StateMachine.keyMethod('onBefore',Transition.PLAY)] = this._onPlay.bind(this);
    // methods[StateMachine.keyMethod('onAfter',Transition.PLAY)] = this._onPlay.bind(this);
    this.fsm = new StateMachine({
      init: State.IDLE,
      transitions: [
        { name: Transition.PLAY,       from: State.IDLE,      to: State.SELECT_1,  timeOut:100},
        { name: Transition.SELECT,     from: State.SELECT_1,  to: State.SELECT_2,  timeOut:100},
        { name: Transition.SELECT,     from: State.SELECT_2,  to: State.SELECT_2,  timeOut:100},
        { name: Transition.PAUSE,      from: State.SELECT_1,  to: State.PAUSE,     timeOut:100},
        { name: Transition.PAUSE,      from: State.SELECT_2,  to: State.PAUSE,     timeOut:100},
        { name: Transition.RESUME,     from: State.PAUSE,     to: State.SELECT_1,  timeOut:100},
        { name: Transition.DE_SELECT,  from: State.SELECT_2,     to: State.SELECT_1,  timeOut:100},
        { name: Transition.WIN,        from: State.SELECT_2,     to: State.WIN,       timeOut:100},
        { name: Transition.END_GAME,   from: State.TIMEOUT,   to: State.IDLE,      timeOut:0},
        { name: Transition.END_GAME,   from: State.WIN,       to: State.IDLE,      timeOut:0},
        { name: Transition.TIMEOUT,    from: [State.SELECT_1,State.SELECT_2, State.CHECK], to: State.TIMEOUT ,timeOut:10},
      ],
      methods:methods
    });

    cc.log("--------------------------");
    cc.log(StateMachineVisualize(this.fsm));
    cc.log("--------------------------");
  },

  autoStart:function(){
    cc.log("autoPlay");
    cc.log(this.fsm.state);
    this.fsm.do(Transition.PLAY);
    cc.log(this.fsm.state);
  },
  _onCheck(){
    cc.log("onCheck");
    if(this.previousAnimalSelect  == null){
      return;
    }
    if(this.curAnimalSelect == null) {return}
    let nodeA = this.previousAnimalSelect.data;
    let nodeB = this.curAnimalSelect.data;
    if(nodeA.id !== nodeB.id || (nodeA.row == nodeB.row && nodeA.col === nodeB.col)){
    // if(this.previousAnimalSelect.data === this.curAnimalSelect.data) {
      this.fsm.do(Transition.DE_SELECT);
      return;
    }

    let isTrue = _.random(0,1) === 1;
    isTrue = true;
    //CHECK TRUE
    if(isTrue){
      this.previousAnimalSelect.collecting();
      this.curAnimalSelect.collecting();

      this.previousAnimalSelect = null;
      this.curAnimalSelect = null;

      //check win
      let isWin = false;
      if(isWin){
        this.fsm.do(Transition.WIN);
      }else{
        this.fsm.do(Transition.DE_SELECT);
      }
    }else{
      this.fsm.do(Transition.DE_SELECT);
    }
  },
  _onPlay:function(){
    this.totalTime = 100;
    this.remainTime = this.totalTime ;
    cc.log("onPlay when transiiton:" + this.fsm.state +"|" + this.totalTime);
    this.isPause = false;
    this._updateTimeOut(0);
  },
  _onSelect:function(lifecycle,animal){
    cc.log("_onSelect:" + this.fsm.state + JSON.stringify(animal.data));
    switch(this.fsm.state){
      case State.SELECT_1:
        this.previousAnimalSelect = animal;
        animal.setSelect(true);
        break;
      case State.SELECT_2:
        this.curAnimalSelect = animal;
        animal.setSelect(true);
        this._onCheck();
        break;
    }
  },
  _onPause:function(){},
  _onDeSelect:function(lifecicle,animal){
    this.previousAnimalSelect && this.previousAnimalSelect.setSelect(false);
    this.curAnimalSelect && this.curAnimalSelect.setSelect(false);
    cc.log("deselect:" + this.fsm.state);
  },
  _onResume:function(){},
  _onWin:function(){},
  _onEndGame:function(){},
  _onTimeOut:function(){
    this.isPause = true;
    cc.log("Game Over");
    this.btnPauseOrResume.getComponentInChildren(cc.Label).string = "⟲";
    this.fsm.do(Transition.END_GAME);

  },
  //endregion

  //region update UI
  _loadPrefabs:function(){
    this.animalPool = new cc.NodePool();
    let initCount = 50;
    for(let i = 0; i < initCount; ++i){
      let animal = cc.instantiate(this.animalPrefab); // create node instance
      animal.getComponent("Animal").unuse();
      this.animalPool.put(animal); // populate your pool with put method
      // cc.log("push to pool");
    }
    cc.log('_load Prefabs done');
  },
  _createAnimalPrefabs:function(parentNode){
    let animal = null;
    // cc.log("pool size:" + this.animalPool.size());
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

  _updateTimeOut:function(dt){
    if(this.isPause){return}
    if(this.fsm.is(State.SELECT_1) || this.fsm.is(State.SELECT_2)){
      this.remainTime -= dt;
      this.progressBar.progress = this.remainTime / this.totalTime;
    }
    if(this.remainTime <= 0){
      this.isPause = true;
      this.fsm.do(Transition.TIMEOUT);
    }
  },
  //endregion

  //region event UI
  /**
   *
   * @param animal {Animal}
   */
  checkAfterTouch:function(animal){
    this.fsm.do(Transition.SELECT,animal);
    cc.log("touch:" + JSON.stringify(animal.data));
  },
  onPauseOrResume:function(){
    if(this.fsm.is(State.IDLE)){
      this.autoStart();
      return;
    }
    this.isPause = !this.isPause;
    this.btnPauseOrResume.getComponentInChildren(cc.Label).string = this.isPause ? "❚❚":"►";

  },
  //endregion


});
