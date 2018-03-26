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
 * @help This plugin doesn't provide any plugin command.
 * 
 * @param defaultsHeader
 * @text Default mappings
 * 
 * @param TileEventDBMapId
 * @text Tile Event Database MapId
 * @description The id of the map containing the event templates for interactive tiles.
 * @default 4
 * @type number
 * @decimals 0
 * 
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


var PD=PD || {};
PD.Generator=PD.Generator||{};

PD.Generator.Dungeon=function(levelObject){
    if(levelObject!=undefined){
        PD.Generator.Dungeon.prototype.initialize.call(this, levelObject);
    }
};
PD.Generator.Dungeon.prototype.initialize=function(levelObject){
    if(levelObject!=undefined){
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
}
PD.Generator.Dungeon.prototype.map=function(){
    return this._tiles;
}
PD.Generator.Dungeon.prototype._preGenerate=function(){
    this._tiles=[];
    var genTile=PD.Tiles.name2id("WALL");//("VOID");
    
    for (var y = 0; y < this._height; y++) {
        this._tiles[y]=[];
        for (var x = 0; x < this._width; x++) {
            this._tiles[y][x]=genTile;
        }
    }
}
PD.Generator.Dungeon.prototype._showStats=function(){
    var specialRooms=[PD.Generator.Dungeon.Room.Type.ENTRANCE,
                      PD.Generator.Dungeon.Room.Type.EXIT, 
                      PD.Generator.Dungeon.Room.Type.SHOP,
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
    this._entrancePoint=null;
    this._exitRoom=null;
    this._exitPoint=null;
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
    this.addToConnections(this._entranceRoom);

    var pathList = this.buildPath( this._rooms, this._entranceRoom, this._exitRoom );
    var room=this._entranceRoom;
    for (var roomPathIndex = 0; roomPathIndex < pathList.length; roomPathIndex++) {
        var next = pathList[roomPathIndex];
        room.connect(next);
        room=next;
        this.addToConnections(room);
    }

    this.setPrice(pathList, this._entranceRoom.distance());
    this.buildDistanceMap(this._rooms, this._exitRoom);
    pathList = this.buildPath( this._rooms, this._entranceRoom, this._exitRoom );
    room=this._entranceRoom;
    for (var roomPathIndex = 0; roomPathIndex < pathList.length; roomPathIndex++) {
        var next = pathList[roomPathIndex];
        room.connect(next);
        room=next;
        this.addToConnections(room);
    }

    var nConnected = (this._rooms.length * (PD.Helpers.randomInteger(50,70)/100));
    while(this._connected.length<nConnected){
        var cr=PD.Helpers.randomFrom(this._connected);
        var or=PD.Helpers.randomFrom(cr.neigbours());
        cr.connect(or);
        this.addToConnections(or);
        // if(!(this._connected.map(function(e) { return e.GUID; }).indexOf(or.GUID)>-1)){
        //     cr.connect(or);
        //     this._connected.push(or);
        // }
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
    //this.placeAllDoors();
    this.paint();
    this.paintAllDoors();

    return true;

}
PD.Generator.Dungeon.prototype.paint=function(){
    var voidTile=PD.Tiles.name2id("VOID");
    for (var roomIndex = 0; roomIndex < this._connected.length; roomIndex++) {
        var room = this._connected[roomIndex];
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
    
}
PD.Generator.Dungeon.prototype.placeAllDoors=function() {
    for (var index = 0; index < this._connected.length; index++) {
        var r=this._connected[index];
        this.placeDoors(r);
    }
}
PD.Generator.Dungeon.prototype.paintAllDoors=function() {
    for (var index = 0; index < this._connected.length; index++) {
        var r=this._connected[index];
        this.paintDoors(r);
    }
}
///////////////////////////////////////////////
/////  TODOTODOTODOTODO  /// Las asignaciones de las puertas a Generator._connected no esta funcionando como es debido, ya que el valor es nulo en algun momento
///////////////////////////////////////////////
PD.Generator.Dungeon.prototype.placeDoors=function(room) {
    for (var index = 0; index < room.connected.length; index++) {
        var neig=room.connected[index].room;
        var door=room.connected[index].door;
        if(door==null){
            console.log("Placing unexisting door ("+index+") for "+room.GUID+" and "+neig.GUID);
            var rct=room.intersect(neig);
            var ndoor=null;
            if(rct.width()==0){
                ndoor=new PD.Generator.Dungeon.Door(rct.left, PD.Helpers.randomInteger(rct.top+1, rct.bottom-1));
            }else{
                ndoor=new PD.Generator.Dungeon.Door(PD.Helpers.randomInteger(rct.left+1, rct.right-1), rct.top);
            }
            room.connected[index]={room:neig, door:ndoor};
            var roomIndexOfRoom=neig.connected.map(function(e) { return e.room.GUID; }).indexOf(room.GUID);
            neig.connected[roomIndexOfRoom]={room:room, door:ndoor};
            
            // var indOfNeig=(room.connected.filter(function(e) {  }).map(function(e) { return e.room.GUID; }).indexOf(neig.GUID));
            // var indOfRoom=(neig.connected.filter(function(e) {  }).map(function(e) { return e.room.GUID; }).indexOf(room.GUID));
            // if(indOfNeig>-1){
            //     //console.log("End door "+door);
            //     var roomIndexOfNeig=this._connected.map(function(e) { return e.GUID; }).indexOf(neig.GUID);
            //     if((roomIndexOfNeig>-1)){
            //         this._connected[roomIndexOfNeig]=neig;
            //     }
            // }else{
            //     //console.log("End door "+door);
            //     if((roomIndexOfNeig>-1)){
            //         this._connected[roomIndexOfNeig]=neig;
            //     }else{
            //         this._connected.push(neig);
            //     }
            // }
            // if(indOfRoom>-1){
            //     neig.connected[indOfRoom]={room:room, door:door};
            //     //console.log("End door "+door);
            // }else{
            //     neig.connected.push({room:room, door:door});
            //     //console.log("End door "+door);
            // }
        }
        
    }
}
PD.Generator.Dungeon.prototype.addToConnections=function(room) {
    if(!(this._connected.map(function(e) { return e.GUID; }).indexOf(room.GUID)>-1)){
        this._connected.push(room);
        console.log("Added room "+room.GUID+" to connections");
    }
}
PD.Generator.Dungeon.prototype.paintDoors=function(room) {
    var doorTile=PD.Tiles.name2id("CLOSEDDOOR");
    var floorTile=PD.Tiles.name2id("ROOMFLOOR");
    for (var idx = 0; idx < room.connected.length; idx++) {
        var roomanddoor = room.connected[idx];
        var o_room=roomanddoor.room;
        var door=roomanddoor.door;
        if(door!=null){
            if(room.type()==PD.Generator.Dungeon.Room.Type.TUNNEL && o_room.type()==PD.Generator.Dungeon.Room.Type.TUNNEL){
                this.setTileId(door.x, door.y, floorTile);
            }else{
                this.setTileId(door.x, door.y, doorTile);
            }
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
PD.Generator.Dungeon.prototype.print=function(doNotUseSymbols){
    var res="";
    var roomCenters=[];
    var rIdentifierNames=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9"];
    for (var i = 0; i < this._connected.length; i++) {
        var element = this._connected[i];
        roomCenters.push(element.center());
    }
    for (var y = 0; y < this._height; y++) {
        for (var x = 0; x < this._width; x++) {
            var tileToPaint=this._tiles[y][x];
            if(doNotUseSymbols==undefined || doNotUseSymbols==false){
                var ds=String.fromCodePoint(PD.Tiles.tile_DebugSymbol(tileToPaint));
                if(ds!=null)tileToPaint=ds;  
            }
            res+=tileToPaint;
        }
        res+="\n";
    }
    console.log("%c"+res, "font-family: serif, sans-serif; line-height: 15px; font-size:15px");
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

    for (var index = 0; index < this._connected.length; index++) {
        var room = this._connected[index];
        if(room.type()==null && room.connected.length==1){
            if(this._specials.length>0 && room.width()>3 && room.height()>3 &&  PD.Helpers.randomInteger(specialRooms*specialRooms+1)==0){
                if(this._depth%5==2 && this._specials.indexOf(PD.Generator.Dungeon.Room.Type.LABORATORY)>-1){
                    room.type(PD.Generator.Dungeon.Room.Type.LABORATORY);
                }else{
                    var isInvalidSpecial=function(rm){
                        if(rm.type()==PD.Generator.Dungeon.Room.Type.WEAK_FLOOR && rm.connected.length>1){
                            return true;
                        }
                        return false;
                    }
                    do{
                        var sp=PD.Helpers.randomFrom(this._specials);
                        room.type(sp);
                    }while(isInvalidSpecial(room));
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
                    var rndRoom=PD.Helpers.randomFrom(neigs);
                    room.connect(rndRoom);
                    this.addToConnections(rndRoom);
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
    for (var cTry = 0; cTry < tryes; cTry++) {
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
    for (var index = 0; index < this._connected.length; index++) {
        var room=this._connected[index];
        if(types.indexOf(room.type())>-1){
            res.push(room);
        }        
    }
    return res;
}













var isInMV=true;

try{
    if(PluginManager==undefined){
        generateTestGameMap();
        isInMV=false;
    }
}catch(err){
    generateTestGameMap();
    isInMV=false;
}


/**
 * MV only code starts here!!!
 */
if(isInMV && PluginManager!=undefined){
    var pars=PluginManager.parameters('PD_Generator');
    PD.Generator.Parameters={};
    PD.Generator.Parameters.TileEventDBMapId = Number(pars["TileEventDBMapId"] || "4");

            


    PD.Generator.Aliases=PD.Generator.Aliases||{};
    PD.Generator.Aliases.Game_Map={};

    PD.Generator.Aliases.Game_Map.initialize=Game_Map.prototype.initialize;
    Game_Map.prototype.initialize=function(){
        PD.Generator.Aliases.Game_Map.initialize.call(this);
        this._hasGeneratedDungeon=false;
        this._otherMapDatas=[];
    }
    PD.Generator.Aliases.Game_Map.setup=Game_Map.prototype.setup;
    Game_Map.prototype.setup=function(mapId){
        PD.Generator.Aliases.Game_Map.setup.call(this, mapId);
        this._hasGeneratedDungeon=false;
        this._dungeonOptions=null;
        if(this.shouldGenerateDungeon()){
            //this.parseCustomFeatures();
            this.generateDungeon();
            this._hasGeneratedDungeon=true;
            if(this.createPathfinder!=undefined){
                this._pathFindingFinder=new PF.AStarFinder();
            }
            this.setupTileEvents();
            var startPosType=PD.Dungeon.startPosType();
            if(startPosType==PD.Dungeon.StartPosition.EXIT){
                $gamePlayer.reserveTransfer(this.mapId(),this._dungeonGenerator._exitPoint.x, this._dungeonGenerator._exitPoint.y, $gamePlayer.direction(), 2);
            }else if(startPosType==PD.Dungeon.StartPosition.PIT){
                
            }else if(startPosType==PD.Dungeon.StartPosition.RANDOM){
                
            }else if(startPosType==PD.Dungeon.StartPosition.CUSTOM){
                var startPos=PD.Dungeon.startPos();
                if(startPos!=undefined && startPos!=null){
                    if($gameMap.isValid(startPos.x, startPos.y)){
                        $gamePlayer.reserveTransfer(this.mapId(),startPos.x, startPos.y, $gamePlayer.direction(), 2);
                    }else{      //If the custom position is invalid, we teleport to the entrance as a fallback
                        $gamePlayer.reserveTransfer(this.mapId(),this._dungeonGenerator._entrancePoint.x, this._dungeonGenerator._entrancePoint.y, $gamePlayer.direction(), 2);
                    }
                }
            }else{
                $gamePlayer.reserveTransfer(this.mapId(),this._dungeonGenerator._entrancePoint.x, this._dungeonGenerator._entrancePoint.y, $gamePlayer.direction(), 2);
            }
        }
    }
    PD.Generator.Aliases.Game_Player=PD.Generator.Aliases.Game_Player||{};
    PD.Generator.Aliases.Game_Player.performTransfer=Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer=function(){
        PD.Generator.Aliases.Game_Player.performTransfer.call(this);
    }
    Game_Map.prototype.getTileEventDBData=function(pdTileID){
        var tlEventId=PD.Tiles.tile_EventId(pdTileID);
        if(tlEventId<=0) return null;
        if(window["$dataMap_"+PD.Generator.Parameters.TileEventDBMapId]==undefined || window["$dataMap_"+PD.Generator.Parameters.TileEventDBMapId]==null){
            return null;
        }
        var db=window["$dataMap_"+PD.Generator.Parameters.TileEventDBMapId];
        return db.events.length>tlEventId?db.events[tlEventId]:null;
    }
    Game_Map.prototype.getTileEventLocalTriggers=function(pdTileID){
        var lA=PD.Tiles.tile_EventLocalA(pdTileID);
        var lB=PD.Tiles.tile_EventLocalB(pdTileID);
        var lC=PD.Tiles.tile_EventLocalC(pdTileID);
        var lD=PD.Tiles.tile_EventLocalD(pdTileID);
        return [lA, lB,lC,lD];
    }
    Game_Map.prototype.setupTileEvents = function() {
        this._tileEvents = [];
        for (var y = 0; y < this.height(); y++) {
            for (var x = 0; x < this.width(); x++) {
                var genTileId=this._dungeonGenerator.getTileId(x, y);
                var eventDBData=this.getTileEventDBData(genTileId);
                if(eventDBData!=null){
                    var tlEventId=PD.Tiles.tile_EventId(genTileId);
                    var lts=this.getTileEventLocalTriggers(genTileId);
                    $gameSelfSwitches.setValue([this._mapId,this._events.length,"A"],lts[0]);
                    $gameSelfSwitches.setValue([this._mapId,this._events.length,"B"],lts[1]);
                    $gameSelfSwitches.setValue([this._mapId,this._events.length,"C"],lts[2]);
                    $gameSelfSwitches.setValue([this._mapId,this._events.length,"D"],lts[3]);
                    this._events.push(new Game_TileEvent(this._mapId, x, y, tlEventId, eventDBData, this._events.length));
                    this._tileEvents.push(this._events[this._events.length-1]);
                }
            }
        }
        this.refreshTileEvents();
    };

    Game_Map.prototype.shouldGenerateDungeon=function(){
        if(this.parseDungeonNotetag($dataMap.note)!=null){
            return true;
        }
        return false;
    }

    Game_Map.prototype.hasGeneratedDungeon=function(){
        return this._hasGeneratedDungeon;
    }

    Game_Map.prototype.parseDungeonNotetag=function(eNote){
        var toReturn=null;
        var rgx=new RegExp("<\\s*dungeon\\s+([\\w\\s\\d='\":_\\.\\*\\+-\\{\\}]*)\\s*\\/?\\s*>", "ig");
        var regexMatch = rgx.exec(eNote);
        if(regexMatch){
            var dp=new window.DOMParser().parseFromString(regexMatch[0], "text/xml");
            this._dungeonOptions={};
            var defOpts={
                depth:1
            };
            for(var propertyName in defOpts) {
                if(dp.documentElement.attributes[propertyName]!=null){
                    if(propertyName=="wallHeight"){
                        var splitVal=dp.documentElement.attributes[propertyName].value.split(",");
                        this._dungeonOptions[propertyName]={2:Number(splitVal[0]), 4:Number(splitVal[1]), 6:Number(splitVal[2]), 8:Number(splitVal[3])};
                    }else if(propertyName=="depth"){
                        this._dungeonOptions[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                    }
                }else{
                    this._dungeonOptions[propertyName]=defOpts[propertyName];
                }
            }
            toReturn= this._dungeonOptions;//Object.assign(defOpts, temporalAttrs);
        }
        return toReturn;
    }

    Game_Map.prototype.generateDungeon=function(){
        //var lasOpts=Object.assign(this._dungeonOptions, {width:$gameMap.width(), height:$gameMap.height()});
        //this._dungeonGenerator=new PD.Generator.Dungeon(lasOpts);
        this._dungeonLevel=PD.Dungeon.prepareDepthLevel(this._dungeonOptions.depth);
        this._dungeonGenerator=this._dungeonLevel.generator();
        //this._dungeonGenerator.generate();
        this._hasGeneratedDungeon=true;
    }
    Game_Map.prototype.getGeneratedData=function (x, y, z) {
        var width = $dataMap.width;
        var height = $dataMap.height;
        //Z ES LA CAPA EN EL EDITOR!!!!! JODEEEEEER!!!
        if(z==2){
            //var tmpData=PD.Generator.Helpers.rotateMapToLeft(this._dungeonGenerator._tiles);
            return this.getMappedTile(this._dungeonGenerator.getTileId(x,y));
        }else{
            return $dataMap.data[(z * height + y) * width + x] || 0;
        }
    }

    Game_Map.prototype.getMappedTile=function (generatedTileId) {
        return PD.Tiles.tile_TilesetTileId(generatedTileId);
    }
    Game_Map.prototype.getMappedTileInverse=function (mvTileId, layer) {
        var found=PD.Generator.Parameters.defaultTileMappings.filter(function(gt){
            return gt.RpgmId==mvTileId;
        });
        return found.length>0?found[0].DungeonId:0;
    }
    PD.Generator.Aliases.Game_Map.isPassable=Game_Map.prototype.isPassable;
    Game_Map.prototype.isPassable = function(x, y, d) {
        if(this.hasGeneratedDungeon()){
            var tId=this._dungeonGenerator.getTileId(x, y);
            return tId!=3; //&& tId!=4;
        }else{
            return PD.Generator.Aliases.Game_Map.isPassable.call(this, x, y, d);
        }
    };
    PD.Generator.Aliases.Game_Map.data=Game_Map.prototype.data;
    Game_Map.prototype.data=function(){
        if(this.hasGeneratedDungeon()){
            var len=PD.Generator.Aliases.Game_Map.data.call(this).length;
            var theData=[];
            var width = $dataMap.width;
            var height = $dataMap.height;
            for (var z = 0; z < 6; z++) {
                for (var y = 0; y < height; y++) {
                    for (var x = 0; x < width; x++) {
                        theData.push(this.getGeneratedData(x,y,z));
                    }
                }
            }
            
            return theData;
        }else{
            return PD.Generator.Aliases.Game_Map.data.call(this);
        }
    }
    //Gets a lists with the ids of the maps that are parented to this one in the RPGMaker MV map editor
    Game_Map.prototype.getChildMapIds=function () {
        return DataManager.getChildMapIds(this.mapId());
    }
    DataManager.getChildMapIds=function(parentId){
        return $dataMapInfos.filter(function(dmi){return dmi!=null && dmi.parentId==parentId}).map(function(dmi){return dmi.id});
    }
    Scene_Load.prototype.onLoadSuccess = function() {
        SoundManager.playLoad();
        this.fadeOutAll();
        if($gameMap.hasGeneratedDungeon()){
            DataManager.onDungeonMapLoaded();
        }
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    };
    DataManager.onDungeonMapLoaded=function(){
        var originalDungeonData=$gameMap._dungeonGenerator;
        var tmpGen=new PD.Generator.Dungeon();
        var newGen = Object.assign(tmpGen, originalDungeonData);
        $gameMap._dungeonGenerator=newGen;
    }
    //Loads each map data to a different global variable to keep the original $dataMap as is cause we still need it
    DataManager.loadOtherMapData = function(mapId, outVarName) {
        if (mapId > 0) {
            this._loadingMaps.push(mapId);
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap_'+mapId, filename));
            this.loadDataFile('$dataMap_'+mapId, filename);
        } 
    };
    DataManager.loadMapData = function(mapId) {
        this._loadingMaps=[];
        if (mapId > 0) {
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
            this.loadDataFile('$dataMap', filename);
            //We load the EventTileDatabase (ToDo:    HARDCODED TO 004!!! CHANGE THIS SOOON)
            var eventTileDatabaseMapId = PD.Generator.Parameters.TileEventDBMapId;
            if(window["$dataMap_"+eventTileDatabaseMapId]==undefined || window["$dataMap_"+eventTileDatabaseMapId]==null){
                DataManager.loadOtherMapData(eventTileDatabaseMapId);
            }
            //We also load all child maps datas
            var childMapIds=[];            //this.getChildMapIds(mapId);
            for (var childIndex = 0; childIndex < childMapIds.length; childIndex++) {
                var cmapId = childMapIds[childIndex];
                if(window["$dataMap_"+cmapId]==undefined || window["$dataMap_"+cmapId]==null){
                    DataManager.loadOtherMapData(cmapId);
                }
            }
        } else {
            this.makeEmptyMap();
        }
    };
    DataManager.isMapLoaded = function() {
        this.checkError();
        var isAnyDataMissing=false;
        isAnyDataMissing=!!!$dataMap;
        for (var index = 0; index < this._loadingMaps.length; index++) {
            var element = this._loadingMaps[index];
            isAnyDataMissing=!!!window["$dataMap_"+element];
        }
        return !isAnyDataMissing;
    };
    //Takes care of the loading of all the data maps on initialization
    // Game_Map.prototype.loadChildMapDatas=function () {
    //     var childMapIds=this.getChildMapIds();
    //     for (var childIndex = 0; childIndex < childMapIds.length; childIndex++) {
    //         var cmapId = childMapIds[childIndex];
    //         if(window["$dataMap_"+cmapId]!=undefined && window["$dataMap_"+cmapId]!=null){
    //             return window["$dataMap_"+cmapId];
    //         }else{
    //             DataManager.loadOtherMapData(cmapId);
    //         }
    //     }
    // }
    Game_Map.prototype.getChildMapData=function (childId) {
        return window["$dataMap_"+childId];
    }
    Game_Map.prototype.getChildMapDatas=function(){
        var toRet=[];
        // var childMapIds=this.getChildMapIds();
        // for (var childIndex = 0; childIndex < childMapIds.length; childIndex++) {
        //     var cmapId = childMapIds[childIndex];
        //     toRet.push(this.getChildMapData(cmapId));
        // }
        return toRet;
    }

    Game_Map.prototype.parseFeatureNotetag=function(eNote){
        var toReturn=null;
        var rgx=new RegExp("<\\s*feature\\s+([\\w\\s\\d='\":_\\.\\*\\+-\\{\\}]*)\\s*\\/?\\s*>", "ig");
        var regexMatch = rgx.exec(eNote);
        if(regexMatch){
            var dp=new window.DOMParser().parseFromString(regexMatch[0], "text/xml");
            var ftOpts={};
            for(var propertyName in PD.Generator.CustomFeature.Defaults) {
                if(dp.documentElement.attributes[propertyName]!=null){
                    if(propertyName!="data"){
                        if(propertyName!="name"){
                            ftOpts[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                        }else{
                            ftOpts[propertyName]=dp.documentElement.attributes[propertyName].value;
                        }
                        
                    }
                }else{
                    ftOpts[propertyName]=PD.Generator.CustomFeature.Defaults[propertyName];
                }
            }
            toReturn= ftOpts;//Object.assign(defOpts, temporalAttrs);
        }
        return toReturn;
    }
    Game_Map.prototype.mvDataToTileIdData=function(mvData, tilesetId, mapW, mapH){
        var tileIdData=[];
        for (var index = 0; index < 6; index++) {
            if(index==3){
                //var element = $dataMap.data.slice(index*($dataMap.height*$dataMap.width),index*($dataMap.height*$dataMap.width) + $dataMap.height*$dataMap.width)
                var splitData=mvData.slice(index*(mapH*mapW),index*(mapH*mapW) + mapH*mapW);
                for (var subindex = 0; subindex < splitData.length; subindex++) {
                    var element = splitData[subindex];
                    tileIdData.push($gameMap.getMappedTileInverse(element, 3));
                }
            }
            
        }
        return tileIdData;
    }
    Game_Map.prototype.parseCustomFeatures=function(){
        var cfs=[];
        var cDatas=this.getChildMapDatas();
        for (var index = 0; index < cDatas.length; index++) {
            var cData = cDatas[index];
            var laNote=cData.note;
            var susFeatOpts=this.parseFeatureNotetag(laNote);
            if(susFeatOpts!=undefined && susFeatOpts!=null){
                var newFeat=new PD.Generator.CustomFeature(susFeatOpts);
                if(this._dungeonOptions){
                    newFeat.data=cData.data;
                    newFeat.width=cData.width;
                    newFeat.height=cData.height;
                    this._dungeonOptions.customFeatures.push(newFeat);
                }
            }
        }
    }







    //-----------------------------------------------------------------------------
    // Game_TileEvent
    //
    // The game object class for an event. It contains functionality for event page
    // switching and running parallel process events.

    function Game_TileEvent() {
        this.initialize.apply(this, arguments);
    }

    Game_TileEvent.prototype = Object.create(Game_Event.prototype);
    Game_TileEvent.prototype.constructor = Game_TileEvent;

    Game_TileEvent.prototype.initialize = function(mapId, xPos, yPos, dbEventId, dbEventData, eventId) {
        Game_Character.prototype.initialize.call(this);
        this._dbEventId = dbEventId;
        this._dbEventData=dbEventData;
        this._mapId = mapId;
        this._eventId = eventId;
        this.locate(xPos, yPos);
        this.refresh();
        
    };

    Game_TileEvent.prototype.setupPage=function(){
        Game_Event.prototype.setupPage.call(this);
        this.checkTileNameComment();
    }
    Spriteset_Map.prototype.refreshTilemap = function() {
        if(this._tilemap==undefined || this._tilemap==null){
            // if (Graphics.isWebGL()) {
            //     this._tilemap = new ShaderTilemap();
            // } else {
            //     this._tilemap = new Tilemap();
            // }
            // this._tilemap.tileWidth = $gameMap.tileWidth();
            // this._tilemap.tileHeight = $gameMap.tileHeight();
            // this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
            // this._tilemap.verticalWrap = $gameMap.isLoopVertical();
            return false;
        }
        this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
        this._tilemap.refresh();
    };
    
    Game_TileEvent.prototype.checkTileNameComment = function() {
        if (!this._erased && this.page()) {this.list().forEach(function(l) {
                if (l.code === 108) {var comment = l.parameters[0].split(' : ');
                    if (comment[0].toLowerCase() == "tilename"){
                        var tileInternalName=String(comment[1]);
                        var tid=PD.Tiles.name2id(tileInternalName);
                        $gameMap._dungeonGenerator.setTileId(this.x, this.y, tid);	
                        if(SceneManager._scene._spriteset!=undefined && SceneManager._scene._spriteset!=null){
                            //SceneManager._scene._spriteset._tilemap=null;
                            SceneManager._scene._spriteset.refreshTilemap();
                            $gamePlayer.updateFOW();
                        }
                        //$gameMap._tilemap.refresh(); 
                    };
                };
            }, this);
        };
    };
    Game_TileEvent.prototype.hasOtherEventOver=function(){
        var eventsHere=$gameMap.eventsXy(this.x, this.y);
        var slf=this;
        return eventsHere.filter(function(eE){
            return eE.eventId!=slf.eventId;
        }).length>0;
    }
    Game_TileEvent.prototype.hasPlayerOver=function(){
        return $gamePlayer.x==this.x && $gamePlayer.y==this.y;
    }
    Game_TileEvent.prototype.hasSomethingOver=function(){
        return this.hasPlayerOver()||this.hasOtherEventOver();
    }
    Game_TileEvent.prototype.event = function() {
        return window["$dataMap_"+PD.Generator.Parameters.TileEventDBMapId].events[this._dbEventId];
    };
    Game_TileEvent.prototype.initMembers = function() {
        Game_Event.prototype.initMembers.call(this);
    };

    Game_TileEvent.prototype.dbEventId = function() {
        return this._dbEventId;
    };
    Game_TileEvent.prototype.dbEventData = function() {
        return this._dbEventData;
    };
}