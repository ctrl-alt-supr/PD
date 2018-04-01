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
    PD.Dungeon._classId=1;
    PD.Dungeon._discoveredTiles=[];
    PD.Dungeon._levels=[];
    PD.Dungeon._startPosType=PD.Dungeon.StartPosition.ENTRANCE;
    PD.Dungeon.PotionKnowledge={};
    PD.Dungeon._knownPotions=[];
    PD.Dungeon.ScrollKnowledge={};
    PD.Dungeon._knownScrolls=[];
    PD.Dungeon.RingKnowledge={};
    PD.Dungeon._knownRings=[];
    PD.Dungeon.WandKnowledge={};
    PD.Dungeon._knownWands=[];
    PD.Dungeon._startPos=new PD.Generator.Dungeon.Point();
    PD.Dungeon.PotionKnowledge=PD.Item.generatePotionKnowledge();
    PD.Dungeon.ScrollKnowledge=PD.Item.generateScrollKnowledge();
    PD.Dungeon.lastCurrentDepth=0;
}

DataManager.setupNewGame = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer($dataSystem.startMapId,
        $dataSystem.startX, $dataSystem.startY);
    Graphics.frameCount = 0;
};
PD.Dungeon.identifiedPotionId=function(unidentifieditem){
    for (var property in PD.Dungeon.PotionKnowledge) {
        var element = PD.Dungeon.PotionKnowledge[property];
        if(element==unidentifieditem.id){
            return Number(property);
        }
    }
    return null;
}
PD.Dungeon.identifiedScrollId=function(unidentifieditem){
    for (var property in PD.Dungeon.ScrollKnowledge) {
        var element = PD.Dungeon.ScrollKnowledge[property];
        if(element==unidentifieditem.id){
            return Number(property);
        }
    }
    return null;
}
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
PD.Dungeon.isDiscoveredTile=function(depth, x, y){
    return PD.Dungeon._discoveredTiles[depth].filter(function(itm){
        return (itm.x==x && itm.y==y);
    }).length>0;  
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
    if($gameMap.hasGeneratedDungeon() || $gameMap.shouldGenerateDungeon()){
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
//Contains key value pairs of the ids of the known and unknown potion

Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
        this.setDirection(this._newDirection);
        if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
            $gameMap.setup(this._newMapId);
            this._needsMapReload = false;
            if($gameMap.hasGeneratedDungeon()){
                //If the destination map is a dungeon depth we adjust the new player position according to 
                //what was set in PD.Dungeon as the current startPosition Type (Exit, entrance, pit, random, custom...)
                var startPosType=PD.Dungeon.startPosType();
                if(startPosType==PD.Dungeon.StartPosition.EXIT){
                    this._newX=$gameMap._dungeonGenerator._exitPoint.x;
                    this._newY=$gameMap._dungeonGenerator._exitPoint.y;
                }else if(startPosType==PD.Dungeon.StartPosition.PIT){
                    
                }else if(startPosType==PD.Dungeon.StartPosition.RANDOM){
                    
                }else if(startPosType==PD.Dungeon.StartPosition.CUSTOM){
                    var startPos=PD.Dungeon.startPos();
                    if(startPos!=undefined && startPos!=null){
                        if($gameMap.isValid(startPos.x, startPos.y)){
                            this._newX=startPos.x;
                            this._newY=startPos.y;
                        }else{      //If the custom position is invalid, we teleport to the entrance as a fallback
                            this._newX=$gameMap._dungeonGenerator._entrancePoint.x;
                            this._newY=$gameMap._dungeonGenerator._entrancePoint.y;
                        }
                    }
                }else{
                    this._newX=$gameMap._dungeonGenerator._entrancePoint.x;
                    this._newY=$gameMap._dungeonGenerator._entrancePoint.y;
                }  
                $gamePlayer._visibleTiles=[];  
            }
        }
        this.locate(this._newX, this._newY);
        this.refresh();
        this.clearTransferInfo();
    }
};


