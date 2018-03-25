/*:
 * @plugindesc C4 - Base class for levels. Each level represents a dungeon depth.
 * @author Alex
 *
 * @help
 * */
PD=PD||{};
PD.Levels=[];
PD.Level=function(depth){
    if(depth!=undefined){
        this._depth=depth;
        this._generator=new PD.Generator.Dungeon(this);
    }
}
PD.Level.prototype.constructor=PD.Level;
PD.Level.prototype.depth=function(){
    return this._depth;
}
PD.Level.prototype.generator=function(){
    return this._generator;
}
PD.Level.prototype.map=function(){
    return this._generator.map();
}
PD.Level.prototype.passabilityMap=function(){
    var originalMap=JSON.parse(JSON.stringify(this.map()));
    var outMap=[];
    for (var y = 0; y < originalMap.length; y++) {
        outMap[y]=[];
        for (var x = 0; x < originalMap[y].length; y++) {
            outMap[y][x]=(PD.Tiles.tile_Through(originalMap[y][x])?1:0);
        }
    }
    return outMap;
}
PD.Level.prototype.occlusionMap=function(){
    var originalMap=JSON.parse(JSON.stringify(this.map()));
    var outMap=[];
    for (var y = 0; y < originalMap.length; y++) {
        outMap[y]=[];
        for (var x = 0; x < originalMap[y].length; y++) {
            outMap[y][x]=(PD.Tiles.tile_Occludes(originalMap[y][x])?1:0);
        }
    }
    return outMap;
}
/**
 * @enum {number} 
 * @readonly
 * @description Enum for level feelings. Level feelings affect how some parts of the dungeon are generated, the exact same generated base layout for each feeling leads to different looking outputs.
 */
PD.Level.Feeling={
    NONE:0,
    CHASM:1,
    WATER:2,
    GRASS:3
}