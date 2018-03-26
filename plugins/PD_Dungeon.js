/*:
 * @plugindesc C5 - Manages the game
 * @author Alex
 *
 * */

PD=PD||{};

PD.Dungeon=function() {
    throw new Error('This is a static class');
}

PD.Dungeon.reset=function() {
    PD.Dungeon._discoveredTiles=[];
    PD.Dungeon._levels=[];
    PD.Dungeon._startPosType=PD.Dungeon.StartPosition.ENTRANCE;
    PD.Dungeon._startPos=new PD.Generator.Dungeon.Point();
    PD.Dungeon.lastCurrentDepth=0;
}

PD.Dungeon._levels=[];
PD.Dungeon.level=function(depth){
    if(this._levels[depth]!=undefined && this._levels[depth]!=null){
        return this._levels[depth];
    }else{
        return null;
    }
}
PD.Dungeon.hasLevel=function(depth){
    if(this._levels[depth]!=undefined && this._levels[depth]!=null){
        return true;
    }else{
        return false;
    }
}
PD.Dungeon.generator=function(depth){
    var lvl=this.level(depth);
    return lvl==null?null:lvl.generator();
}
PD.Dungeon.hasGenerator=function(depth){
    return this.generator(depth)!=null;
}
PD.Dungeon.depth2NewLevel=function(depth){
    var newLvl=new PD.Level(depth);
    this._discoveredTiles[depth]=[];
    return newLvl;
}
PD.Dungeon.createDepthLevel=function(depth){
    if(this.hasLevel(depth)){
        return this.level(depth);
    }else{
        var created=this.depth2NewLevel(depth);
        this._levels[depth]=created;
        this._discoveredTiles[depth]=[];
        return this.level(depth);
    }
    //Shouldn't happen... but whatever...
    return null;
}
PD.Dungeon.prepareDepthLevel=function(depth){
    if(!this.hasLevel(depth)){
        return this.createDepthLevel(depth);
    }else{
        return this.level(depth);
    }
}
PD.Dungeon.maxReachedDepth=function(){
    var len=PD.Dungeon._levels.length;
    return len>0?len-1:0;
}

PD.Dungeon.currentDepth=function(){
    if($gameMap.hasGeneratedDungeon()){
        PD.Dungeon.lastCurrentDepth=$gameMap._dungeonGenerator._depth;
    }
    return PD.Dungeon.lastCurrentDepth;
}

PD.Dungeon.shopOnLevel=function(depth) {
    return depth == 6 || depth == 11 || depth == 16;
}
PD.Dungeon.bossLevel=function(depth) {
    return depth == 5 || depth == 10 || depth == 15 || depth == 20 || depth == 25;
}

PD.Dungeon.StartPosition={
    ENTRANCE:0,
    EXIT:1,
    PIT:2,
    RANDOM:3,
    CUSTOM:4
};
PD.Dungeon.startPosType=function() {
    return PD.Dungeon._startPosType;
}
PD.Dungeon.startPos=function() {
    return PD.Dungeon._startPos;
}

PD.Dungeon.setStartPosToEntrance=function(){
    this.setStartPosType(PD.Dungeon.StartPosition.ENTRANCE);
}
PD.Dungeon.setStartPosToExit=function(){
    this.setStartPosType(PD.Dungeon.StartPosition.EXIT);
}
PD.Dungeon.setStartPosType=function(nType, nPoint){
    PD.Dungeon._startPosType=nType;
    if(nPoint!=undefined && PD.Dungeon._startPosType==PD.Dungeon.StartPosition.CUSTOM ){
        PD.Dungeon._startPos=nPoint;
    }
}

