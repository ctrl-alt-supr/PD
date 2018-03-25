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
    PD.Dungeon._levels=[];
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
    return newLvl;
}
PD.Dungeon.createDepthLevel=function(depth){
    if(this.hasLevel(depth)){
        return this.level(depth);
    }else{
        var created=this.depth2NewLevel(depth);
        this._levels[depth]=created;
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
PD.Dungeon.shopOnLevel=function(depth) {
    return depth == 6 || depth == 11 || depth == 16;
}
PD.Dungeon.bossLevel=function(depth) {
    return depth == 5 || depth == 10 || depth == 15 || depth == 20 || depth == 25;
}