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
 * @plugindesc G1 - Generates dungeon levels during runtime.
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
        return 30;
    }
    $gameMap.height=function(){
        return 30;
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

PD.Generator.Dungeon=function(levelObject){
    PD.Generator.Dungeon.prototype.initialize.call(this, levelObject);
};
PD.Generator.Dungeon.prototype.initialize=function(levelObject){
    this._depth=levelObject._depth;
    this._height=$gameMap.height();
    this._width=$gameMap.width();
    this._minRoomSize=7;
    this._maxRoomSize=9;
    this.reset();
    var genOk=false;
    var tryes=0;
    do{
        genOk=this.generate();
        tryes+=1;
    }while(!genOk && tryes<10);
    if(!genOk){
        console.error("Couldn't create dungeon after 10 tryes");
    }

    this.print();
    this._showStats();
}
PD.Generator.Dungeon.prototype.map=function(){
    return this._tiles;
}
PD.Generator.Dungeon.prototype._preGenerate=function(){
    this._tiles=[];
    var voidTile=PD.Tiles.name2id("VOID");
    for (var y = 0; y < this._height; y++) {
        this._tiles[y]=[];
        for (var x = 0; x < this._width; x++) {
            this._tiles[y][x]=voidTile;
        }
    }
}
PD.Generator.Dungeon.prototype._showStats=function(){
    var specialRooms=[PD.Generator.Dungeon.Room.Type.ENTRANCE,
                      PD.Generator.Dungeon.Room.Type.EXIT, 
                      PD.Generator.Dungeon.Room.Type.ARMORY, 
                      PD.Generator.Dungeon.Room.Type.WEAK_FLOOR, 
                      PD.Generator.Dungeon.Room.Type.MAGIC_WELL, 
                      PD.Generator.Dungeon.Room.Type.CRYPT, 
                      PD.Generator.Dungeon.Room.Type.POOL, 
                      PD.Generator.Dungeon.Room.Type.GARDEN, 
                      PD.Generator.Dungeon.Room.Type.LIBRARY,
                      PD.Generator.Dungeon.Room.Type.TREASURY, 
                      PD.Generator.Dungeon.Room.Type.TRAPS, 
                      PD.Generator.Dungeon.Room.Type.STORAGE, 
                      PD.Generator.Dungeon.Room.Type.STATUE, 
                      PD.Generator.Dungeon.Room.Type.LABORATORY, 
                      PD.Generator.Dungeon.Room.Type.VAULT, 
                      PD.Generator.Dungeon.Room.Type.ALTAR];
    var generatedSpecialRooms=this.connectedsByType(specialRooms);
    for (var i = 0; i < generatedSpecialRooms.length; i++) {
        var rm=generatedSpecialRooms[i];
        console.log(rm.type()+" "+PD.Generator.Dungeon.Room.Type.getName(rm.type()));
    }
}
PD.Generator.Dungeon.prototype.reset=function(){
    this._rooms=[];
    this._tiles=[];
    this._connected=[];
    this._entranceRoom=null;
    this._exitRoom=null;
    this._shopRoom=null;
    this._specials=[
        PD.Generator.Dungeon.Room.Type.ARMORY, 
        PD.Generator.Dungeon.Room.Type.WEAK_FLOOR, 
        PD.Generator.Dungeon.Room.Type.MAGIC_WELL, 
        PD.Generator.Dungeon.Room.Type.CRYPT, 
        PD.Generator.Dungeon.Room.Type.POOL, 
        PD.Generator.Dungeon.Room.Type.GARDEN, 
        PD.Generator.Dungeon.Room.Type.LIBRARY,
        PD.Generator.Dungeon.Room.Type.TREASURY, 
        PD.Generator.Dungeon.Room.Type.TRAPS, 
        PD.Generator.Dungeon.Room.Type.STORAGE, 
        PD.Generator.Dungeon.Room.Type.STATUE, 
        PD.Generator.Dungeon.Room.Type.LABORATORY, 
        PD.Generator.Dungeon.Room.Type.VAULT, 
        PD.Generator.Dungeon.Room.Type.ALTAR];
    this._specials=PD.Helpers.shuffleArray(this._specials);
    this._preGenerate();
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

    this._entranceRoom.type(PD.Generator.Dungeon.Room.Type.ENTRANCE);
    this._exitRoom.type(PD.Generator.Dungeon.Room.Type.EXIT);

    this._connected=[];
    this._connected.push(this._entranceRoom);

    var pathList = this.buildPath( this._rooms, this._entranceRoom, this._exitRoom );
    var room=this._entranceRoom;
    for (var roomPathIndex = 0; roomPathIndex < pathList.length; roomPathIndex++) {
        var next = pathList[roomPathIndex];
        room.connect(next);
        room=next;
        if(!(this._connected.map(function(e) { return e.GUID; }).indexOf(room.GUID)>-1)){
            this._connected.push(room);
        }
    }

    this.setPrice(pathList, this._entranceRoom.distance());
    this.buildDistanceMap(this._rooms, this._exitRoom);
    pathList = this.buildPath( this._rooms, this._entranceRoom, this._exitRoom );
    room=this._entranceRoom;
    for (var roomPathIndex = 0; roomPathIndex < pathList.length; roomPathIndex++) {
        var next = pathList[roomPathIndex];
        room.connect(next);
        room=next;
        if(!(this._connected.map(function(e) { return e.GUID; }).indexOf(room.GUID)>-1)){
            this._connected.push(room);
        }
    }

    var nConnected = (this._rooms.length * (PD.Helpers.randomInteger(50,70)/100));
    while(this._connected.length<nConnected){
        var cr=PD.Helpers.randomFrom(this._connected);
        var or=PD.Helpers.randomFrom(cr.neigbours());
        if(!(this._connected.map(function(e) { return e.GUID; }).indexOf(or.GUID)>-1)){
            cr.connect(or);
            this._connected.push(or);
        }
    }

    if(PD.Dungeon.shopOnLevel(this._depth)){
        this._shopRoom=null;
        for (var connectedIndex = 0; connectedIndex < this._entranceRoom.connected.length; connectedIndex++) {
            var connectedRoom = this._entranceRoom.connected[connectedIndex].room;
            if(connectedRoom.connected.length==1 && connectedRoom.width()>=5 && connectedRoom.height()>=5){
                this._shopRoom=connectedRoom;
                break;
            }
        }
        if(this._shopRoom==null){
            return false;
        }else{
            this._shopRoom.type(PD.Generator.Dungeon.Room.Type.SHOP);
        }
    }

    this.assignRoomTypes();
    this.paint();

    return true;

}
PD.Generator.Dungeon.prototype.paint=function(){
    var voidTile=PD.Tiles.name2id("VOID");
    for (var roomIndex = 0; roomIndex < this._rooms.length; roomIndex++) {
        var room = this._rooms[roomIndex];
        if(room.type()!=null){
            this.placeDoors(room);
            var typePainter=PD.Generator.Dungeon.Room.Type.getPainter(room.type());
            if(typePainter!=undefined && typePainter!=null){
                typePainter.paint(this, room);
            }else{
                console.warn("No painter obtained for type "+room.type());
            }
        }
    }
    for (var roomIndex = 0; roomIndex < this._connected.length; roomIndex++) {
        var room = this._connected[roomIndex];
        this.paintDoors(room);
    }
}
PD.Generator.Dungeon.prototype.placeDoors=function(room) {
    for (var index = 0; index < room.connected.length; index++) {
        var neig=room.connected[index].room;
        var door=room.connected[index].door;
        if(door==null){
            var rct=room.intersect(neig);
            if(rct.width()==0){
                door=new PD.Generator.Dungeon.Door(rct.left, PD.Helpers.randomInteger(rct.top+1, rct.bottom-1));
            }else{
                door=new PD.Generator.Dungeon.Door(PD.Helpers.randomInteger(rct.left+1, rct.right-1), rct.top);
            }
            var indOfNeig=(room.connected.map(function(e) { return e.room.GUID; }).indexOf(neig.GUID));
            var indOfRoom=(neig.connected.map(function(e) { return e.room.GUID; }).indexOf(room.GUID));
            if(indOfNeig>-1){
                room.connected[indOfNeig]={room:neig, door:door};
            }else{
                room.connected.push({room:neig, door:door});
            }
            if(indOfRoom>-1){
                neig.connected[indOfRoom]={room:room, door:door};
            }else{
                neig.connected.push({room:room, door:door});
            }
        }
    }
}
PD.Generator.Dungeon.prototype.paintDoors=function(room) {
    var doorTile=PD.Tiles.name2id("CLOSEDDOOR");
    var floorTile=PD.Tiles.name2id("ROOMFLOOR");
    for (var idx = 0; idx < room.connected.length; idx++) {
        var roomanddoor = room.connected[idx];
        var o_room=roomanddoor.room;
        var door=roomanddoor.door;
        if(room.type()==PD.Generator.Dungeon.Room.Type.TUNNEL && o_room.type()==PD.Generator.Dungeon.Room.Type.TUNNEL){
            this.setTileId(door.x, door.y, floorTile);
        }else{
            this.setTileId(door.x, door.y, doorTile);
        }
    }
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
    var symbols=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R"]
    for (var roomIndex = 0; roomIndex < this._rooms.length; roomIndex++) {
        var element = this._rooms[roomIndex];
        //if(roomIndex%2==0)
        for (var y = element.top; y < element.bottom; y++) {
            for (var x = element.left; x < element.right; x++) {
                this._tiles[y][x]=symbols[roomIndex];
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
        path.push(next);
        room=next
    }
    return path;
}

PD.Generator.Dungeon.prototype.setPrice=function(listToSet, priceValue ) {
    for (var index = 0; index < listToSet.length; index++) {
        var room = listToSet[index];
        room.price( priceValue );
    }
}

PD.Generator.Dungeon.prototype.assignRoomTypes=function() {
    var specialRooms=0;

    for (var index = 0; index < this._rooms.length; index++) {
        var room = this._rooms[index];
        if(room.type()==null && room.connected.length==1){
            if(this._specials.length>0 && room.width()>3 && room.height()>3 &&  PD.Helpers.randomInteger(specialRooms*specialRooms+1)==0){
                if(this._depth%5==2 && this._specials.indexOf(PD.Generator.Dungeon.Room.Type.LABORATORY)>-1){
                    room.type(PD.Generator.Dungeon.Room.Type.LABORATORY);
                }else{
                    var sp=PD.Helpers.randomFrom(this._specials);
                    room.type(sp);
                }
                this._specials.splice(this._specials.indexOf(room.type()), 1);
                specialRooms+=1;
            }else if(PD.Helpers.randomInteger(1)==0){
                var neigs=[];
                for (var neigIndex = 0; neigIndex < room.neigbours().length; neigIndex++) {
                    var neig = room.neigbours()[neigIndex];
                    if(room.connected.filter(function(eac){
                        return eac.room.GUID==neig.GUID;
                    }).length==0){      //ToDo: Add a check for no-special room that may appear
                        neigs.push( neig );
                    }
                }
                if(neigs.length>1){
                    room.connect(PD.Helpers.randomFrom(neigs));
                }
            }
        }
    }
    var count=0;
    for (var index = 0; index < this._rooms.length; index++) {
        var room = this._rooms[index];
        if(room.type()==null){
            var cons=room.connected.length;
            if(cons==0){
                console.log("Room with no connections!!!");
            }else if(PD.Helpers.randomInteger(cons*cons-1)==0){
                room.type(PD.Generator.Dungeon.Room.Type.STANDARD);
                count+=1;
            }else{
                room.type(PD.Generator.Dungeon.Room.Type.TUNNEL);
            }
        }
    }
    while(count<4){
        var room = this.randomRoom( PD.Generator.Dungeon.Room.Type.TUNNEL, 1 );
        if (room != null) {
            room.type(PD.Generator.Dungeon.Room.Type.STANDARD);
            count+=1;
        }
    }
}
PD.Generator.Dungeon.prototype.randomRoom=function(type, tryes) {
    for (let cTry = 0; cTry < tryes; cTry++) {
        var room=PD.Helpers.randomFrom(this._rooms);
        if(room.type()==type){
            return room;
        }        
    }
    return null;
}
PD.Generator.Dungeon.prototype.connectedsByType=function(types) {
    if(types==undefined){
        return this._connected;
    }
    var res=[];
    for (let index = 0; index < this._connected.length; index++) {
        var room=this._connected[index];
        if(types.indexOf(room.type())>-1){
            res.push(room);
        }        
    }
    return res;
}