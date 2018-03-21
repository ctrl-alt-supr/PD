/*:
 * @plugindesc C4 - Manages the game
 * @author Alex
 *
 * */

PD=PD||{};

PD.Dungeon=function() {
    throw new Error('This is a static class');
}

PD.Dungeon._generators={};
PD.Dungeon.generator=function(depth){
    if(this._generators[depth]!=undefined && this._generators[depth]!=null){
        return this._generators[depth];
    }else{
        return null;
    }
}
PD.Dungeon.hasGenerator=function(depth){
    if(this._generators[depth]!=undefined && this._generators[depth]!=null){
        return true;
    }else{
        return false;
    }
}
PD.Dungeon.shopOnLevel=function(depth) {
    return depth == 6 || depth == 11 || depth == 16;
}
PD.Dungeon.bossLevel=function(depth) {
    return depth == 5 || depth == 10 || depth == 15 || depth == 20 || depth == 25;
}