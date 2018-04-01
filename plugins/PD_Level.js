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
        this._feeling=PD.Level.Feeling.NONE;
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
PD.Level.prototype.water=function(generator) {
    return generator.generateTerrainPatch( this._feeling == PD.Level.Feeling.WATER ? 0.60 : 0.45, 5 );
}
PD.Level.prototype.grass=function(generator) {
    return generator.generateTerrainPatch( this._feeling == PD.Level.Feeling.GRASS ? 0.60 : 0.40, 4 );
}
PD.Level.prototype.decorate=function(generator) {
    var wallTile=PD.Tiles.name2id("WALL");
    var wallDecoTile=PD.Tiles.name2id("DECOWALL");
    var waterTile=PD.Tiles.name2id("WATER");
    for (var y = 0; y < generator._height; y++) {
        for (var x = 0; x < generator._width; x++) {
            var tileThere=generator.getTileId(x, y);
            if(tileThere==wallTile){
                var tileDown=generator.getTileId(x, y+1);
                if(tileDown==waterTile && PD.Helpers.randomInteger(3)==0){
                    generator.setTileId(x, y, wallDecoTile);
                }
            }
        }
    }
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