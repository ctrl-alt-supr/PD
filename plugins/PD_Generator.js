/*~struct~TileMapping:
 * @param DungeonId
 * @text Generated tile type
 * @desc The generated tile type.
 * @type select
 * @option Void (Unused tile. Usually 0)
 * @value 0
 * @option Room floor
 * @value 1
 * @option Corridor floor
 * @value 2
 * @option Wall
 * @value 3
 * @option Door
 * @value 4
 * @option Up stairs
 * @value 5
 * @option Down stairs
 * @value 6
 * @default 1
 * 
 * @param RpgmId
 * @text RPGMaker tile id
 * @desc The id of the tile in the tileset the generated tile type should be maped to.
 * @type number
 * @decimals 0
 * @default 0
 * 
 */
/*~struct~PerTilesetTileMapping:
 *  
 * @param TilesetId
 * @text Tileset affected.
 * @desc The tileset that this mappings should be applied to.
 * @type tileset
 * @default 1
 * 
 * @param TileMapping
 * @text Mapping of generated tiles.
 * @desc Sets the mapping for the selected tileset id.
 * @default []
 * @type struct<TileMapping>[]
 *
 * 
 */

//=============================================================================
// SD_Generator.js
//=============================================================================
/*:
 * @plugindesc 4 - Generates dungeon levels during runtime.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * @param defaultsHeader
 * @text Default mappings
 * 
 * @param defaultTileMappings
 * @text Mapping of generated tiles
 * @desc How should each tile be mapped.
 * @parent defaultsHeader
 * @type struct<TileMapping>[]
 * @default ["{\"DungeonId\":\"1\",\"RpgmId\":\"1\"}","{\"DungeonId\":\"2\",\"RpgmId\":\"30\"}","{\"DungeonId\":\"3\",\"RpgmId\":\"4\"}","{\"DungeonId\":\"4\",\"RpgmId\":\"5\"}","{\"DungeonId\":\"5\",\"RpgmId\":\"7\"}","{\"DungeonId\":\"6\",\"RpgmId\":\"24\"}"]
 * 
 * 
 * @param tilesetsHeader
 * @text Per tileset mappings
 * 
 * @param perTilesetTileMappings
 * @text Mapping of generated tiles
 * @desc How should each tile be mapped.
 * @parent tilesetsHeader
 * @type struct<PerTilesetTileMapping>[]
 * @default []
 * 
 * 
*/


//ToDo: Eliminar esto cuando ya no esté debugueando fuera del MV
var generateTestGameMap=function(){
    $gameMap={};
    $gameMap.width=function(){
        return 20;
    }
    $gameMap.height=function(){
        return 20;
    }
}
try{
    if($gameMap==undefined){
        generateTestGameMap();
    }
}catch(err){
    generateTestGameMap();
}


var PD=PD || {};
PD.Generator=PD.Generator||{};

PD.Generator.Dungeon=function(depthLevel){
    PD.Generator.Dungeon.prototype.initialize.call(this, depthLevel);
};
PD.Generator.Dungeon.prototype.initialize=function(depthLevel){
    this._depth=depthLevel;
    this._height=$gameMap.height();
    this._width=$gameMap.width();
    this._minRoomSize=7;
    this._maxRoomSize=9;
    this.reset();
    this.generate();
    this._postGenerate(".");
    this.print();

}
PD.Generator.Dungeon.prototype._preGenerate=function(baseTileId){
    this._tiles=[];
    for (var y = 0; y < this._height; y++) {
        this._tiles[y]=[];
        for (var x = 0; x < this._width; x++) {
            this._tiles[y][x]=baseTileId;
        }
    }
}
PD.Generator.Dungeon.prototype.reset=function(){
    this._rooms=[];
    this._tiles=[];
    this._connected=[];
    this._entranceRoom=null;
    this._exitRoom=null;
    this._preGenerate(" ");
}
PD.Generator.Dungeon.prototype.generate=function(baseTileId){
    if(!this._initRooms()){
        return false;
    }
    var distance=0;
    var retry=0;
    var minDistance=Math.floor(Math.sqrt(this._rooms.length));
    do{
        do{
            this._entranceRoom=PD.Helpers.randomFrom(this._rooms);
        }while(this._entranceRoom.width()<4 || this._entranceRoom.height()<4);
        do{
            this._exitRoom=PD.Helpers.randomFrom(this._rooms);
        }while(this._exitRoom==this._entranceRoom || this._exitRoom.width()<4 || this._exitRoom.height()<4);
        this.buildDistanceMap(this._rooms, this._exitRoom);
        distance = this._entranceRoom.distance();
        retry+=1;
        if(retry>10){
            return false;
        }
    }while(distance<minDistance)

    this._entranceRoom=PD.Generator.Dungeon.Room.Type.ENTRANCE;
    this._exitRoom=PD.Generator.Dungeon.Room.Type.EXIT;

    this._connected=[];
    this._connected.push(this._entranceRoom);

    var pathList = this.buildPath( this._rooms, this._entranceRoom, this._exitRoom );

}
PD.Generator.Dungeon.prototype._initRooms=function(){
    this._rooms=[];
    var fullMapRect=new PD.Generator.Dungeon.ARect(0,0,this._width-1,this._height-1)
    this._splitRect(fullMapRect);
    if(this._rooms.length<8){
        return false;
    }
    for (var i = 0; i < this._rooms.length; i++) {
        for (var j = i+1; j < this._rooms.length; j++) {
            this._rooms[i].addNeigbour(this._rooms[j]);
        }
    }
    return true;
}
PD.Generator.Dungeon.prototype._postGenerate=function(char){
    for (var roomIndex = 0; roomIndex < this._rooms.length; roomIndex++) {
        var element = this._rooms[roomIndex];
        //if(roomIndex%2==0)
        for (var y = element.top; y < element.bottom; y++) {
            for (var x = element.left; x < element.right; x++) {
                this._tiles[y][x]=char;
            }
        }
    }
}
PD.Generator.Dungeon.prototype.print=function(){
    var res="";
    for (var y = 0; y < this._height; y++) {
        for (var x = 0; x < this._width; x++) {
            res+=this._tiles[y][x];
        }
        res+="\n";
    }
    console.log(res);
}
PD.Generator.Dungeon.prototype.getTileId=function(x, y){
    if (x < 0 || y < 0 || x >= this._width || y >= this._height){
        return 0;
    }
    return this._tiles[y][x];
}
PD.Generator.Dungeon.prototype.setTileId=function(x, y, tileId){
    this._tiles[y][x]=tileId;
}

PD.Generator.Dungeon.prototype._splitRect=function(rectToSplit){
    var w=rectToSplit.width(this._width);
    var h=rectToSplit.height(this._height);
    if(w>this._maxRoomSize && h<this._minRoomSize){
        var vw=PD.Helpers.randomInteger(rectToSplit.left+3, rectToSplit.right-3);
        this._splitRect(new PD.Generator.Dungeon.ARect(rectToSplit.left, rectToSplit.top, vw, rectToSplit.bottom));
        this._splitRect(new PD.Generator.Dungeon.ARect(vw, rectToSplit.top, rectToSplit.right, rectToSplit.bottom));
    }else if(h>this._maxRoomSize && w<this._minRoomSize){
        var vh=PD.Helpers.randomInteger(rectToSplit.top+3, rectToSplit.bottom-3);
        this._splitRect(new PD.Generator.Dungeon.ARect(rectToSplit.left, rectToSplit.top, rectToSplit.right, vh));
        this._splitRect(new PD.Generator.Dungeon.ARect(rectToSplit.left, vh, rectToSplit.right, rectToSplit.bottom));
    }else if((Math.random()<=(this._minRoomSize * this._maxRoomSize / rectToSplit.square()) && w<= this._maxRoomSize && h<=this._maxRoomSize) || w < this.minRoomSize || h < this.minRoomSize){
        this._rooms.push(new PD.Generator.Dungeon.Room(rectToSplit));
    }else{
        if(Math.random() < (w - 2)/(w + h - 4)){
            var vw=PD.Helpers.randomInteger(rectToSplit.left+3, rectToSplit.right-3);
            this._splitRect(new PD.Generator.Dungeon.ARect(rectToSplit.left, rectToSplit.top, vw, rectToSplit.bottom));
            this._splitRect(new PD.Generator.Dungeon.ARect(vw, rectToSplit.top, rectToSplit.right, rectToSplit.bottom));
        }else{
            var vh=PD.Helpers.randomInteger(rectToSplit.top+3, rectToSplit.bottom-3);
            this._splitRect(new PD.Generator.Dungeon.ARect(rectToSplit.left, rectToSplit.top, rectToSplit.right, vh));
            this._splitRect(new PD.Generator.Dungeon.ARect(rectToSplit.left, vh, rectToSplit.right, rectToSplit.bottom));
        }
    }
}


PD.Generator.Dungeon.prototype.buildDistanceMap=function( allRooms, focusRoom ) {
    allRooms.forEach(function(er){
        er.distance(Number.MAX_SAFE_INTEGER);
    },this);
    var queue=[];
    focusRoom.distance(0);
    queue.push(focusRoom);
    while (!queue.length==0) {
        var node=queue.shift();
        var distance=node.distance();
        var price=1;      //node.price();
        var susEdges=node.neigbours();
        for (var edgeIndx = 0; edgeIndx < susEdges.length; edgeIndx++) {
            var edge = susEdges[edgeIndx];
            if(edge.distance() > distance+price){
                edge.distance(distance+price);
                queue.push(edge);
            }
        }
    }
}

PD.Generator.Dungeon.prototype.buildPath=function(allRooms, fromRoom, toRoom) {
    var path=[];
    var room=fromRoom;
    while(room!=toRoom){
        var min=room.distance();
        var next=null;
        var edges=room.neigbours();
        for (var edgeIndx = 0; edgeIndx < edges.length; edgeIndx++) {
            var edge = edges[edgeIndx];
            var dis=edge.distance();
            if(dis<min){
                min=dis;
                next=edge;
            }
        }
        if(next==null){
            return null;
        }
        path.add(next);
        room=next
    }
    return path;
}
