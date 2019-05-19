const EMPTY_ID = 0;

var dc = [-1, 0, 1, 0];
var dr = [0, -1, 0, 1];
var Node = function(row, col){
  this.row = row;
  this.col = col;
  this.f = 0;

  this.h = function(target){
    return (this.row - target[0]) * (this.row - target[0]) + (this.col - target[1]) * (this.col - target[1]);
  }
};
var AStar = function(){
  this.row = 0;
  this.col = 0;
  this.setMap= function(map){
    if(map.length === 0){return;}
    this.map = map;
    this.row = this.map.length;
    this.col = this.map[0].length;
  }

  this.getMinF = function(ls){
    var minF = 100000000;
    var idx = -1;
    for (var i = 0; i < ls.length; i++){
      if (ls[i].f < minF) {
        minF = ls[i].f;
        idx = i;
      }
    }
    return idx;
  }

  this.findNode = function(ps, ls){
    for (var i = 0; i < ls.length; i++){
      if (ls[i].row == ps[0] && ls[i].col == ps[1])
        return i;
    }
    return -1;
  }

  this.solve = function(src, trg){
    if(this.map.length === 0) {return -1}
    var OPEN = [];
    var CLOSE = [];

    cc.log("find:" + JSON.stringify(src) + this.map[src[0][src[1]]] +"->" + this.map[trg[0]][trg[1]] + JSON.stringify(trg));
    var nSource = new Node(src[0], src[1]);
    // set f(S) = h(S)
    nSource.g = 0;
    nSource.f = nSource.h(trg);
    // step 1: push source node into OPEN
    OPEN.push(nSource);

    // step 2: process until OPEN is empty
    // or until the route is found
    while (OPEN.length > 0){

      //step 2.1: get the node with min f
      var curIdx = this.getMinF(OPEN);
      var curNode = OPEN[curIdx];
      OPEN.splice(curIdx, 1);

      // step 2.2: check if the route is found
      if (curNode.row == trg[0] && curNode.col == trg[1])
        return curNode;

      // step 3: find 4 adjacent nodes Mi
      for (var i = 0; i < 4; i++){
        // step 3.1: check all valid Mi
        var r = curNode.row + dr[i];
        var c = curNode.col + dc[i];
        var Mi;
        if (r >= 0 && r < this.row && c >=0 && c < this.col && (this.map[r][c] === EMPTY_ID || (r === trg[0] && c === trg[1]))){
          // step 3.2: calculate successor distant
          var dmi = curNode.g + 1;
          // step 3.3: check if Mi is in OPEN
          var oIdx = this.findNode([r,c], OPEN);
          if (oIdx >= 0){
            Mi = OPEN[oIdx];
            // if g(Mi) < d(Mi) => go to step 5
            if (Mi.g < dmi) {
              continue;
            }
          }

          // step 3.4: check if Mi is in OPEN
          var cIdx = this.findNode([r,c], CLOSE);
          if (cIdx >= 0) {
            Mi = CLOSE[cIdx];
            // step 3.4.1: g(Mi) < d(Mi) => go to step 5
            if (Mi.g < dmi){
              continue;
            } else {
              // step 3.4.2: move Mi to OPEN
              OPEN.push(CLOSE[cIdx]);
              CLOSE.splice(cIdx, 1);
            }
          }

          //step 3.5: if Mi neither in OPEN nor CLOSE
          if (oIdx <0 && cIdx < 0){
            // step 3.5.1:
            Mi = new Node(r, c);
            OPEN.push(Mi);
          }

          //step 4: update g(Mi) = d(Mi)
          Mi.g = dmi;
          Mi.f = Mi.g + Mi.h(trg);
          Mi.parent = curNode;
        }
      }

      //step 5: move curNode to CLOSE
      CLOSE.push(curNode);
    }

    return -1;
  };
};

var getCombinations = function(array, size, start, initialStuff, output) {
  if (initialStuff.length >= size) {
    output.push(initialStuff);
  } else {
    var i;

    for (i = start; i < array.length; ++i) {
      getCombinations(array, size, i + 1, initialStuff.concat(array[i]), output);
    }
  }
};

var getAllPossibleCombinations = function(array, size, output) {
  getCombinations(array, size, 0, [], output);
};

var NodeAnimal = function(){
  this.row = -1;
  this.col = -1;
  this.id = EMPTY_ID;   //loai animal (0,1,2,...) 0 IS EMTPTY
};

var AnimalSolveMap = function(arrNode){
  if(arrNode === undefined) { arrNode = []}
  this.open = [];
  this.close = [];
  this.arrNode = arrNode;
  this.map = [];
  this.setArrNode = function(arrNode){
      this.arrNode = arrNode;
  };

  //astar => map + diem dau + diem cuoi => return ok|not
  this.init = function(){
    /** @type {NodeAnimal[]}*/
    let arrNode = this.arrNode;
    let len = arrNode.length;
    let arrIdPos = {};
    let maxRow = 0;
    let maxCol = 0;

    //gen all open
    for(let i = 0; i < len; i++){
      /** @type {NodeAnimal}*/
      let node = arrNode[i];
      let id = node.id;
      if(id !== EMPTY_ID){
        if(arrIdPos[id] == null){
          arrIdPos[id] = [];
        }
        arrIdPos[id].push(node);
      }
      if(maxCol < node.col){maxCol = node.col}
      if(maxRow < node.row){maxRow = node.row}
    }
    maxCol += 1;
    maxRow += 1;
    //clear open
    this.open.length = 0;
    for(let id in arrIdPos){
      if(arrIdPos.hasOwnProperty(id)){
        let combination = [];
        let arrNodeSameId = arrIdPos[id];
        getAllPossibleCombinations(arrNodeSameId,2,combination);
        for(let i = 0; i < combination.length; i++){
          this.open.push(combination[i]);
        }
      }
    }

    //clear map to EMPTY_ID
    // this.map.length = maxRow;
    // for(let i = 0; i < maxRow; i++){
    //   if(this.map[i]==null){this.map[i] = [];}
    //   this.map[i].length = maxCol;
    //   for(let j = 0; j < maxCol; j++){
    //     this.map[i][j] = EMPTY_ID;
    //   }
    // }
    this.map.length = 0;
    for(let i = 0; i < maxRow; i++){
      this.map.push([]);
      for(let j = 0; j < maxCol; j++){
        this.map[i].push(EMPTY_ID);
      }
    }
    //gen map
    for(let i = 0; i < len; i++){
      let node = arrNode[i];
      this.map[node.row][node.col] = node.id;
    }

    this.close.length = 0;
  };

  this.solve = function(){
    //astar => map + diem dau + diem cuoi => return ok|not
    let aStar = new AStar();
    aStar.setMap(this.map);
    printArray(this.map);
    printArray(this.open);
    let isContinue = true;
    while(isContinue){
      isContinue = false;
      let find = -1;
      let fromTo;
      /** @type {NodeAnimal}*/
      let to,from;
      let indexOpen;
      for(let i = 0; i < this.open.length; i++){
        if(this.open[i].length < 2){
          cc.error("failed");
          return;
        }
        indexOpen = i;
        fromTo = this.open[i];
        from = this.open[i][0];
        /** @type {NodeAnimal}*/
        to = this.open[i][1];
        find = aStar.solve([from.row,from.col],[to.row,to.col]);
        if(find !== -1){
          break;
        }
      }
      if(find !== -1){
        this.close.push(fromTo);
        //clear map
        this.open.splice(indexOpen,1);
        this.map[from.row][from.col] = EMPTY_ID;
        this.map[to.row][to.col] = EMPTY_ID;
        isContinue = true;
      }else{
        //roll back
        if(this.close.length > 0){

          let fromToRollBack = this.close.pop();
          /** @type {NodeAnimal}*/
          let fromRoll = fromToRollBack[0];
          /** @type {NodeAnimal}*/
          let toRoll = fromToRollBack[1];
          cc.log("roll back [%s,%s]-[%s,%s]",fromRoll.row,fromRoll.col,toRoll.row,toRoll.col);
          this.map[fromRoll.row][fromRoll.col] = fromRoll.id;
          this.map[toRoll.row][toRoll.col] = toRoll.id;
          this.open.push(fromToRollBack);
          isContinue = true;
        }else{
          cc.log("can't find solve");
        }
      }
    }
    return this.close;
  }
};

var AnimalGenMap = function(){
  /** @type {EMPTY_ID|NodeAnimal[][]}*/
  this.map = [];
  this.row = 11;
  this.col = 11;

  this.listIdContainer = [0,1,2,3]; //nhung id co trong van choi
  /** @type {NodeAnimal[]}*/
  this.result = [];
  /** @type {NodeAnimal[][]}*/
  this.allNodeAnimal = [];

  this.solveMap = new AnimalSolveMap();
  this.cachePositionViaId = {
    /*
    * id : [
    *   [{row,col},{row,col}],
    *   [pos,pos]
    * ]
    * */
  };

  this.init = function(){
    for(let i = 0; i < this.row; i++){
      for(let j = 0; j < this.col; j++){
        if(this.map[i] == null){
          this.map[i] = [];
        }
        this.map[i][j] = EMPTY_ID;
      }
    }
    this.cachePositionViaId = {};



  };
  this.getTotalNode = function(){
    return (this.row - 2) * (this.col - 2);
  };
  this.createAllNodeAnimal = function(){
    let total = this.getTotalNode();
    for(let i = 0; i < total; i++){
      let id = this.listIdContainer[i % this.listIdContainer.length];
      let nodeA = new NodeAnimal();
      let nodeB = new NodeAnimal();
      nodeA.id = id;
      nodeB.id = id;

      this.allNodeAnimal.push([nodeA,nodeB]);

      i++;
    }
  };
  this.gen = function(row,col,idContainer){
    if(row < 3) row = 3;
    if(col < 3) col = 3;
    this.row = row;
    this.col = col;
    if(this.getTotalNode() % 2 !== 0){
      cc.error("can't create need animal is %2==0");
      return;
    }
    cc.log("gen: " + row+"|" + col + JSON.stringify(idContainer));
    this.listIdContainer = idContainer;

    this.init();

    this.createAllNodeAnimal();

    let isContinue = true;
    while(isContinue){
      isContinue = false;
      if(this._addNewCoupleAnimal()){
        while(this._updateLastCoupleAnimalToAnotherPos()){
          if(this._checkSolveMap()){
            isContinue = true;
          }
          break;
        }
      }
      break;
    }
    if(this._isFullMap()){
      return this.result;
    }
    cc.error("can't find any match");
  };
  this._isFullMap = function(){
    return (this.result.length === this.getTotalNode());
  };
  this._checkSolveMap = function(){
      this.solveMap.setArrNode(this.result);
      this.solveMap.init();
      return this.solveMap.solve().length > 0;
  };
  this._addNewCoupleAnimal = function(){
    if(this.allNodeAnimal.length >= 2){
      let couple = this.allNodeAnimal.pop();
      this.result.push(couple[0]);
      this.result.push(couple[1]);
      return true;
    }
    return false;
  };
  this.getPositionFromIndex = function(index){
    cc.log(index);
    let row = parseInt(index/this.col);
    let col = index%this.col;
    return {row:row,col:col};
  };
  this._updateLastCoupleAnimalToAnotherPos= function(){
    // random start point
    //tim 1 vi tri trong chua co trong list den
    //update =>
    let len = this.result.length;
    if(len < 2) return false;
    let nodeA = this.result[len -1];
    let nodeB = this.result[len - 2];
    if(nodeA.id !== nodeB.id){
      cc.error("failed, not the same id Node");
      return false;
    }
    let idNode = nodeA.id;
    let cachePos = this.cachePositionViaId[idNode];
    let total = this.row * this.col;
    //random 1 vi tri
    //star => end
    //random 2 vi tri
    //start2 -> end
    //check xem vi tri do hop le
    //hop le => ok
    //NOT -> return false;
    let startA = _.random(0,total);
    let isContinue = true;
    let newStartA = startA;
    while(isContinue){
      let newPosA = this.getPositionFromIndex(newStartA);
      if(this.isValidPositionForAnimal(newPosA)){

        let startB = _.random(0,total);
        let newStartB = startB;
        let isContinueB = true;
        while(isContinueB){
          let newPosB = this.getPositionFromIndex(newStartB);
          if(this.isValidPositionForAnimal(newPosB) && newPosB.row !== newPosA.row && newPosB.col !== newPosA.col){
            //check if not contain in history
            let isNotContain = true;
            if(cachePos){
              for(let i = 0; i < cachePos.length; i++){
                let poss = cachePos[i];
                let a = poss[0];
                let b = poss[1];
                if((
                  newPosA.row === a.row &&
                  newPosA.col === a.col &&
                  newPosB.row === b.row &&
                  newPosB.col === b.col
                )|| (
                  newPosA.row === b.row &&
                  newPosA.col === b.col &&
                  newPosB.row === a.row &&
                  newPosB.col === a.col
                )){
                  isNotContain = false;
                }
              }
            }
            if(isNotContain){
              if(cachePos == null) cachePos = [];
              cachePos.push([newPosA,newPosB]);

              nodeA.row = newPosA.row;
              nodeA.col = newPosA.col;

              nodeB.row = newPosB.row;
              nodeB.col = newPosB.col;
              return true;
            }
          }

          //check stop loop B
          newStartB ++;
          if(newStartB >= total){newStartB = 0}
          isContinue = newStartB !== startB;
        }
      }
      //check stop loop A
      newStartA ++;
      if(newStartA >= total){newStartA = 0}
      isContinue = newStartA !== startA;
    }
    return false;
  };
  this.isValidPositionForAnimal= function(pos){
    // let result = (0 < pos.row && pos.row < this.row - 1 && 0 < pos.col && pos.col < this.col - 1);
    // cc.log(JSON.stringify(pos) + "| " +result);
    return (0 < pos.row && pos.row < this.row - 1 && 0 < pos.col && pos.col < this.col -1);
  };
  this.testAStar = function(){
    cc.log("animalGenMap: on load");
    let astar = new AStar();
    let map = [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];
    printArray(map);
    astar.setMap(map);
    let result = astar.solve([0,0],[2,2]);
    if(result !== -1){
      cc.log(result.row +  "," + result.col);
      while(result.parent !=  null){
        result = result.parent;
        cc.log(result.row +  "," + result.col);
      }
      cc.log("done");
    }
  };
  /**
   *
   * @param row {number}
   * @param col {number}
   * @param idContainer {number[]}
   * @return {NodeAnimal[]}
   */
  this.genSimple = function(row, col, idContainer){
    cc.log("gen Simple: row:" + row + "| col:" + col +"|" + JSON.stringify(idContainer));
    /** @type {NodeAnimal[]}*/
    let result = [];
    let len = idContainer.length;
    this.row = row;
    this.col = col;

    let total = this.getTotalNode();
    let id;
    let index = 0;
    for(let i = 0; i < row; i++){
      for(let j = 0; j < col; j++){
        let pos = {row:i,col:j};

        if(this.isValidPositionForAnimal(pos)){
          let node = new NodeAnimal();
          if((index % 2) === 0){
            id = idContainer[_.random(0,len)];
          }
          node.row = pos.row;
          node.col = pos.col;
          node.id = id;
          index ++;

          result.push(node);
        }
      }
    }
    return result;
  }
};

var printArray = function(arr){
  cc.log("[");
  for(let i = 0; i < arr.length; i++){
    if(_.isArray(arr[i][0])){
      printArray(arr[i]);
    }else{
      cc.log(JSON.stringify(arr[i]) + ((i < arr.length - 1)? "," : ""))
    }
  }
  cc.log("]");
};

module.exports = AnimalGenMap;