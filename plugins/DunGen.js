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
// DunGen.js
//=============================================================================
/*:
 * @plugindesc Runtime dungeon generation for RPGMaker MV.
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
var DunGen={};



//1 ,30, 4, 5

//-----------------------------------------------------------------------------
// Enums
//
DunGen.Enums={};
/**
 * @description Enum for generated tile types.
 * @readonly
 * @enum {Object}
 */
DunGen.Enums.Tile={
    0		: {
        symbol:' ',
        name: "Unused",
        floorTile: false
    } ,
    1		: {
        symbol:'.',
        name: "Floor",
        floorTile: true
    },
    2	    : {
        symbol:',',
        name: "Corridor",
        floorTile: true
    },
    3		: {
        symbol:'#',
        name: "Wall",
        floorTile: false
    },
    4	    : { 
        symbol:'+',
        name: "ClosedDoor",
        floorTile: true
    },
    5	    : {
        symbol:'-',
        name: "OpenDoor",
        floorTile: true
    }, 
    6	    : {
        symbol:'<',
        name: "UpStairs",
        floorTile: true
    }, 
    7	    : {
        symbol:'>',
        name: "DownStairs",
        floorTile: true
    }
};
/**
 * @description Enum for directions.
 * @readonly
 * @enum {Object}
 */
DunGen.Enums.Direction=	{
    8:"North",
    2:"South",
    4:"West",
    6:"East"
};


DunGen.Helpers={};
/**
 * @function randomInteger
 * @description Returns a random integer between min and max included
 * @param {number} min - The minimun number that can be returned by the call
 * @param {number} max - The maximun number that can be returned by the call
 * @returns {number} A random integer between min and max (both included)
 */
DunGen.Helpers.randomInteger=function(min, max){
    if(max==undefined || max==null){
        max=min;
        min=0;
    }
    return Math.floor(Math.random()*(max-min+1)+min);
}
/**
 * @function randomFrom
 * @description Returns a random element from listToPickFrom.
 * @function randomFrom
 * @param {array} listToPickFrom - The list of elements to pick from.
 * @returns A random element in listToPickFrom.
 */
DunGen.Helpers.randomFrom=function(listToPickFrom){
    var min=0;
    var max=listToPickFrom.length-1;
    return listToPickFrom[DunGen.Helpers.randomInteger(min,max)];
}
/**
 * @function randomFromWithWeight
 * @description Returns a random element from listToPickFrom using different weights (chances to be picked) for each element.
 * @param {Object[]} listToPickFrom - The list of elements to pick from.
 * @param {number} listToPickFrom[].weightProperty - A property inside each element in the list that should determine its weight.
 * @param {string} weightProperty - The name of the weightProperty of the elements in the array.
 * @returns A random element in listToPickFrom using the weigths given.
 */
DunGen.Helpers.randomFromWithWeight=function(listToPickFrom, weightProperty){
    var sumOfWeights = listToPickFrom.reduce(function(memo, elm) {
        return memo + elm[weightProperty];
    }, 0);
    var rng = Math.floor(Math.random() * (sumOfWeights + 1));
    var findFnc = function(el) {
        rng -= el[weightProperty];
        return rng <= 0;
    };
    return listToPickFrom.find(findFnc);
}
/**
 * @function randomChance
 * @description Returns true with chances probabiliy
 * @param {number} chances - Chance of returning true (over 100).
 * @returns Returns true with chances probabiliy or false
 */
DunGen.Helpers.randomChance=function(chances){
    return DunGen.Helpers.randomInteger(100)<=chances;
}
/**
 * @function shuffleArray
 * @description Returns a suffled (each element of the array placed in a random position) version of the input.
 * @param {array} input - The array to suffle.
 * @returns Returns the shuffled array.
 */
DunGen.Helpers.shuffleArray=function(input){
    var out=input;
    var j, x, i;
    for (i = out.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = out[i];
        out[i] = out[j];
        out[j] = x;
    }
    return out;
}
/**
 * @function transposeArray
 * @description Returns a transposed (each axis swapped) version of the input.
 * @param {array[]} input - The two dimensional array to transpose.
 * @returns Returns the transposed array.
 */
DunGen.Helpers.transposeArray=function(a){
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

//-----------------------------------------------------------------------------
// Classes
//
/**
 * Creates a new CustomFeature.
 * Custom features are non-randomly generated rooms in the dungeon that can help make
 * each level special or more interesting. For example a shop, blacksmithing or treasure room
 * can be good examples or custom features in a generated dungeon.
 * @class
 */
DunGen.CustomFeature=function(options){
    DunGen.CustomFeature.prototype.initialize.call(this, options);
};
/**
 * @function
 * @private
 */
DunGen.CustomFeature.prototype.initialize=function(options){
    if(options==undefined || options==null){
        options={};
    }
    this._name=null;
    this._appareanceGroup=-1;
    this._minAppareances=0;
    this._maxAppareances=-1;
    this._weight=1;
    for(var propertyName in DunGen.CustomFeature.Defaults) {
        this["_"+propertyName] = options[propertyName]?options[propertyName]:DunGen.CustomFeature.Defaults[propertyName];
    }
}
DunGen.CustomFeature.Defaults={
    //Dungeon map width
    name:"Unnamed feature",
    //Minimun of times this feature can appear in a generations
    minAppareances:0,
    //Maximun of times this feature can appear in a generations
    maxAppareances:0,
    //Chances of each generated custom feature being this one
    weight:1
};
DunGen.CustomFeature.prototype.height=function(){
    return this._data.length;
}
DunGen.CustomFeature.prototype.width=function(){
    return this._data.length>0?this._data[0].length:0;
}

DunGen.Dungeon=function(options){
    DunGen.Dungeon.prototype.initialize.call(this, options);
};
DunGen.Dungeon.Defaults={
    //Dungeon map width
    width:17,
    //Dungeon map height
    height:13,
    //Maximun of features to place on the dungeon
    maxFeatures:50,
    //The times that the system should try to connect corridors with only one way
    corridorConsistency:50,
    //Minimun size for a room side
    minRoomSize:3,
    //Maximun size for a room side
    maxRoomSize:6,
    //Minimun length for a corridor
    minCorridorLength:3,
    //Maximun lenght for a corridor
    maxCorridorLength:8,
    //The chances of a new feature being a room.
    roomChance:50,
    //The number of tiles each side of the wall extends to. Use -1 to leave gaps.
    wallHeight:{
        2:1,
        4:1,
        6:1,
        8:1
    },
    //Chances of a room being surrounded by a wall
    roomWallChance:100,
    //Chances of a corridor being surrounded by a wall
    corridorWallChance:100,
    //A list of CustomFeatures
    customFeatures:[],
    //Chances of a new feature being a custom feature
    customFeatureChance:10,
    //Maximun number of rooms to create
    maxRooms:10,
    //Maximun number of corridors to create
    maxCorridors:10
};
DunGen.Dungeon.prototype.initialize=function(options){
    if(options==undefined || options==null){
        options={};
    }
    for(var propertyName in DunGen.Dungeon.Defaults) {
        this["_"+propertyName] = options[propertyName]?options[propertyName]:DunGen.Dungeon.Defaults[propertyName];
    }
    this.preGenerate(0);
    this.resetValues();
}

DunGen.Dungeon.prototype.resetValues=function(){
    this._entrance=null;
    this._exit=null;
    this._rooms=[];
    this._pendingFeatures=[];
    this._createdFeatures=[];
    this.fillPendingFeatures();
    this._corridors=[];
    this._exits=[];
    this._lastGeneratedCorridor=null;
    this._lastGeneratedRoom=null;
}

DunGen.Dungeon.prototype.preGenerate=function(baseTileId){
    this._tiles=[];
    for (var y = 0; y < this._height; y++) {
        this._tiles[y]=[];
        for (var x = 0; x < this._width; x++) {
            this._tiles[y][x]=baseTileId;
        }
    }
}
DunGen.Dungeon.prototype.getRandomCustomFeature=function(filter){
    if(filter==undefined || filter==null){
        filter=function(cf){
            return true;
        }
    }
    var filtered=this._customFeatures.filter(filter);
    return DunGen.Helpers.randomFromWithWeight(filtered, "_weight");
}
DunGen.Dungeon.prototype.getCustomFeatures=function(filter){
    if(filter==undefined || filter==null){
        filter=function(cf){
            return true;
        }
    }
    return this._customFeatures.filter(filter);
}
//Returns a random room from the dungeon
DunGen.Dungeon.prototype.getRandomRoom=function(filter){
    if(filter==undefined || filter==null){
        filter=function(cf){
            return true;
        }
    }
    var filtered=this._rooms.filter(filter);
    return DunGen.Helpers.randomFrom(filtered);
}
//Returns a random corridor from the dungeon
DunGen.Dungeon.prototype.getRandomCorridor=function(filter){
    if(filter==undefined || filter==null){
        filter=function(cf){
            return true;
        }
    }
    var filtered=this._corridors.filter(filter);
    return DunGen.Helpers.randomFrom(filtered);
}
//Returns a random randomly generated room from the dungeon
DunGen.Dungeon.prototype.getRandomGeneratedRoom=function(filter){
    if(filter==undefined || filter==null){
        filter=function(cf){
            return true;
        }
    }
    var slf=this;
    var generatedFilter=function(cf){
        return slf._createdFeatures.filter(function(ef){
            return (ef.rect.x==cf.x && ef.rect.y==cf.y && ef.rect.width==cf.width && ef.rect.height==cf.height)
        }).length==0;
    }
    var filtered=this._rooms.filter(generatedFilter).filter(filter);
    return DunGen.Helpers.randomFrom(filtered);
}
DunGen.Dungeon.prototype.getRandomCellInRoom=function(room, cellFilter){
    if(cellFilter==undefined || cellFilter==null){
        cellFilter=function(cf){
            return true;
        }
    }
    var susCells=this.getCellsInRoom(room);
    susCells=susCells.filter(cellFilter);
    return susCells.length>0?DunGen.Helpers.randomFrom(susCells):null;
}
DunGen.Dungeon.prototype.getCellsInRoom=function(room){
    var lst=[];
    for (var iY = room.y; iY < room.y+room.height; iY++) {
        for (var iX = room.x; iX < room.x+room.width; iX++) {
            lst.push({x:iX, y:iY});
        }
    }
    return lst;
}

DunGen.Dungeon.prototype.fillPendingFeatures=function(){
    var cFeatures=[];
    //First we add those that are mandatory
    var mandatoryCustomFeatures=this.getCustomFeatures(function(ft){
        return (ft._minAppareances!=undefined && ft._minAppareances!=null && ft._minAppareances>0)?true:false;
    });
    for (var mcfi = 0; mcfi < mandatoryCustomFeatures.length; mcfi++) {
        var element = mandatoryCustomFeatures[mcfi];
        for (var cant = 0; cant < element._minAppareances; cant++) {
            cFeatures.push(element);      
        }
    }
    this._pendingFeatures=DunGen.Helpers.shuffleArray(cFeatures);
}
//Checks if the generated dungeon is valid for the configuration given.
DunGen.Dungeon.prototype.validate=function(){
    //Right now the only condition for a generated dungeon to be valid is to have all mandatory custom features layed out.
    return this._pendingFeatures.length==0;
}
DunGen.Dungeon.prototype.generate=function(){
    var isValid=false;
    var exitLoop=false;
    while(!isValid && !exitLoop){
        this.preGenerate(0);
        this.resetValues();
        //We place the first room on the center of the dungeon
        if(!this._makeFirstRoom()){
            console.error("Unable to generate first room!");
            exitLoop=true;
            break;
        }
        //We place as many features as required by the options
        for (var i = 1; i < this._maxFeatures; i++) {
            if(!this._createFeature()){
                console.log("Couldn't create a feature.");
            }            
        }  
        isValid=this.validate();
        if(!isValid) console.log("The generated dungeon was invalid as its missing "+this._pendingFeatures.length+" required custom features. Trying to regenerate...");
    }
    this.generateGOs();
    console.log("DONE GENERATING!! ("+this._rooms.length+") ("+this._corridors.length+")");
    this.print(true);
}
DunGen.Dungeon.prototype.generateGOs=function(){
    var slf=this;
    var onlyFloorTileFilter=function(tl){
        var onlyFloor=function(tl2){
            var isVal=$gameMap.isValid(tl2.x, tl2.y);
            if(!isVal) return true;
            return (slf._getTileId(tl2.x, tl2.y)==1 || slf._getTileId(tl2.x, tl2.y)==2);
        };
        var notDoor=function(tl2){
            var isVal=$gameMap.isValid(tl2.x, tl2.y);
            if(!isVal) return true;
            return slf._getTileId(tl2.x, tl2.y)!=4;
        };
        return (onlyFloor(tl) && notDoor({x:tl.x-1, y:tl.y}) && notDoor({x:tl.x+1, y:tl.y}) && notDoor({x:tl.x, y:tl.y-1}) && notDoor({x:tl.x, y:tl.y+1}));
    };
    
    var entranceRoom=this.getRandomGeneratedRoom();
    var entranceTile=this.getRandomCellInRoom(entranceRoom, onlyFloorTileFilter);
    this._setTileId(entranceTile.x, entranceTile.y, 5)
    var exitRoom=this.getRandomGeneratedRoom(function(r){
        return r.x!=entranceRoom.x && r.y!=entranceRoom.y;
    });
    var exitTile=this.getRandomCellInRoom(exitRoom, onlyFloorTileFilter);
    this._setTileId(exitTile.x, exitTile.y, 6);
}
DunGen.Dungeon.prototype._makeFirstRoom=function(){
    for (var i = 0; i < 1000; i++) {
        if(this._makeRoom(Math.floor(this._width/2), Math.floor(this._height/2),DunGen.Helpers.randomFrom([8,6,4,2]), true, this._roomWallChance, null, null)){
            return true;
        }
    }
    return false;
}
DunGen.Dungeon.prototype.print=function(asSymbols){
    var res="";
    for (var y = 0; y < this._height; y++) {
        for (var x = 0; x < this._width; x++) {
            if(asSymbols){
                res+=DunGen.Enums.Tile[this._tiles[y][x]]!=undefined?DunGen.Enums.Tile[this._tiles[y][x]].symbol:"?";
            }else{
                res+=this._tiles[y][x];
            }
        }
        res+="\n";
    }
    console.log(res);
}

DunGen.Dungeon.prototype._getTileId=function(x, y){
    if (x < 0 || y < 0 || x >= this._width || y >= this._height){
        return 0;
    }
    return this._tiles[y][x];
}
DunGen.Dungeon.prototype._setTileId=function(x, y, tileId){
    this._tiles[y][x]=tileId;
}
DunGen.Dungeon.prototype._getWallHeight=function(side){
    return (this._wallHeight[side]==-1?0:this._wallHeight[side]);
}
DunGen.Dungeon.prototype._leaveGapBetweenFeatures=function(side){
    return !(this._wallHeight[side]==-1);
}
DunGen.Dungeon.prototype._makeRoom=function(x, y, direction, isFirstRoom, wallChance, connectedRoom, connectedCorridor){
    if(isFirstRoom==undefined || isFirstRoom==null){
        isFirstRoom=false;
    }
    if(wallChance==undefined || wallChance==null){
        wallChance=this._roomWallChance;
    }
    var customFeatureToCreate=null;
    //If there are mandatory pending custom features, we check the chances to summon one of them
    if(this._pendingFeatures.length>0){
        var makeCustomPendingFeature=DunGen.Helpers.randomChance(this._customFeatureChance);
        if(makeCustomPendingFeature){
            customFeatureToCreate=this._pendingFeatures[this._pendingFeatures.length-1];
            console.log("Creating custom feature '"+customFeatureToCreate._name+"'");
        }
    }

    var roomRect={
        x:0,
        y:0,
        height:0,
        width:0
    };
    var useWall=DunGen.Helpers.randomChance(wallChance);
    if(customFeatureToCreate!=null){
        roomRect.width=customFeatureToCreate.width;
        roomRect.height=customFeatureToCreate.height;
    }else{
        roomRect.width=DunGen.Helpers.randomInteger(this._minRoomSize,this._maxRoomSize);
        roomRect.height=DunGen.Helpers.randomInteger(this._minRoomSize,this._maxRoomSize);
    }
    if(direction==8){     //North
        roomRect.x = x-Math.floor(roomRect.width/2);
        roomRect.y = y-roomRect.height;
    }else if(direction==2){     //South
        roomRect.x = x-Math.floor(roomRect.width/2);
        roomRect.y = y+1;
    }else if(direction==4){     //West
        roomRect.x = x-roomRect.width;
        roomRect.y = y-Math.floor(roomRect.height/2);
    }else if(direction==6){     //East
        roomRect.x = x+1;
        roomRect.y = y-Math.floor(roomRect.height/2);
    }
    
    if(this._tryPlaceRect(roomRect,useWall)){
        var newData=[];
        if(customFeatureToCreate!=null){
            var tilesData=$gameMap.mvDataToTileIdData(customFeatureToCreate.data, customFeatureToCreate.tilesetId, customFeatureToCreate.width, customFeatureToCreate.height)
            var count=0;
            for (var y = 0; y < roomRect.height; y++){
                newData[y]=[];
                for (var x = 0; x < roomRect.width; x++){
                    newData[y][x]=tilesData[count];
                    count+=1;
                }
            }
            //newData=DunGen.Helpers.transposeArray(newData);
        }
        this._placeRect(roomRect, newData.length>0?newData:1,  useWall, connectedRoom, connectedCorridor);
            if(customFeatureToCreate!=null){
                var dataForArray=this._pendingFeatures.pop()
                dataForArray.rect=roomRect;
                this._createdFeatures.push(dataForArray);
            }
        //ToDo: EXITS!!!!
        //storeRectExits returns the same rect that was passed with its exits added to a property in the rect, so we store the return value in the rooms instead of the original rect to keep that
        //information
        var toPush=this._storeRectExits(roomRect, direction, isFirstRoom)
        toPush._connectedRooms=[];
        if(connectedRoom!=null){
            toPush._connectedRooms.push(connectedRoom);
        }
        toPush._connectedCorridors=[];
        if(connectedCorridor!=null){
            toPush._connectedCorridors.push(connectedCorridor);
        }
        this._rooms.push(toPush);
        this._lastGeneratedCorridor=null;
        this._lastGeneratedRoom=toPush;
        return true;
    }
    return false;
}
DunGen.Dungeon.prototype._storeRectExits=function(rect, dir, isFirstRoom){
    rect.exits = rect.exits || [];
    if(dir!=2 || isFirstRoom){
        var exit={
            x: rect.x,
            y: rect.y-1,
            width: rect.width, 
            height:1
        };
        this._exits.push(exit);
        rect.exits.push(exit);
    }
    if(dir!=8 || isFirstRoom){
        var exit={
            x: rect.x,
            y: rect.y + rect.height,
            width: rect.width, 
            height:1
        };
        this._exits.push(exit);
        rect.exits.push(exit);
    }
    if(dir!=6 || isFirstRoom){
        var exit={
            x: rect.x-1,
            y: rect.y,
            width: 1, 
            height: rect.height
        };
        this._exits.push(exit);
        rect.exits.push(exit);
    }
    if(dir!=4 || isFirstRoom){
        var exit={
            x: rect.x + rect.width,
            y: rect.y,
            width: 1, 
            height: rect.height
        };
        this._exits.push(exit);
        rect.exits.push(exit);
    }
    return rect;
}
DunGen.Dungeon.prototype._tryPlaceRect=function(rect, doCheckWallsAlso){
    if (rect.x < this._getWallHeight(4) || rect.y < this._getWallHeight(8) || rect.x + rect.width > this._width - this._getWallHeight(6) || rect.y + rect.height > this._height - this._getWallHeight(2)){
        return false;
    }
    var initY=0;
    var initX=0;
    var destY=0;
    var destX=0;
    var roomInitY=rect.y;
    var roomInitX=rect.x;
    var roomDestY=rect.y + rect.height;
    var roomDestX=rect.x + rect.width;
    if(doCheckWallsAlso){
        initY=rect.y-this._getWallHeight(8);
        destY=rect.y + rect.height + this._getWallHeight(2);
        initX=rect.x-this._getWallHeight(4);
        destX=rect.x + rect.width + this._getWallHeight(6);
    }else{
        initY=rect.y;
        destY=rect.y + rect.height;
        initX=rect.x;
        destX=rect.x + rect.width;
    }
    
    var shouldBeWall=function(x, y){
        if(!doCheckWallsAlso){
            return false;
        }
        if(x<roomInitX || y<roomInitY || x>roomDestX-1 || y>roomDestY-1){
            return true;
        }
        return false;
    }
    for (var y = initY; y < destY; y++){
        for (var x = initX; x < destX; x++){
            if (shouldBeWall(x,y)){
                //If we are checking a future wall tile, it should not be occupied by a walkable tile as we dont mind overlapping walls.
                if(this._getTileId(x,y)==1 || this._getTileId(x,y)==2){        //The tile is already in use by a floor tile
                    return false;
                }
            }else{
                if(this._getTileId(x,y)!=0){        //The tile is already in use
                    return false;
                }
            }
        }
    }
    return true;
}

DunGen.Dungeon.prototype._placeRect=function(rect, dataOrTileId, doAddWalls, connectedRoom, connectedCorridor){
    if (rect.x < this._getWallHeight(4) || rect.y < this._getWallHeight(8) || rect.x + rect.width > this._width - this._getWallHeight(6) || rect.y + rect.height > this._height - this._getWallHeight(2)){
        return false;
    }
    var newData=[];
    if(dataOrTileId.constructor === Array){     //We are being given the array containing the data tileids the room should contain.
        newData=dataOrTileId;
    }else{                                      //We are being given a tile id to fill the room with
        for (var y = 0; y < rect.height; y++){
            newData[y]=[];
            for (var x = 0; x < rect.width; x++){
                newData[y][x]=dataOrTileId;
            }
        }
    }
    var initY=0;
    var initX=0;
    var destY=0;
    var destX=0;
    var roomInitY=rect.y;
    var roomInitX=rect.x;
    var roomDestY=rect.y + rect.height;
    var roomDestX=rect.x + rect.width;
    if(doAddWalls){
        initY=rect.y-this._getWallHeight(8);
        destY=rect.y + rect.height + this._getWallHeight(2);
        initX=rect.x-this._getWallHeight(4);
        destX=rect.x + rect.width + this._getWallHeight(6);
    }else{
        initY=rect.y;
        destY=rect.y + rect.height;
        initX=rect.x;
        destX=rect.x + rect.width;
    }
    var shouldBeWall=function(x, y){
        if(!doAddWalls){
            return false;
        }
        if(x<roomInitX || y<roomInitY || x>roomDestX-1 || y>roomDestY-1){
            return true;
        }
        return false;
    }
    for (var y = initY; y < destY; y++){
        for (var x = initX; x < destX; x++){
            if (shouldBeWall(x,y)){
                //place a wall
                this._setTileId(x,y,3);
            }else{
                //place the tile in data
                try{
                    var tileInData=newData[y-roomInitY][x-roomInitX];
                    this._setTileId(x,y,tileInData);
                }catch(ex){
                    console.error(ex);
                    debugger;
                }
            }
        }
    }
    console.log(rect.width+" x "+rect.height+" rect added at ("+rect.x+","+rect.y+")");
    return true;
}
DunGen.Dungeon.prototype._createCorridorConsistentFeature=function(){
    //To make corridors make more sense, the exit to use is picked from corridors without two ways if there are any
    var corridorsFilter=function(c){
        return c._connectedRooms.length<2;
    }
    var previousCorridor=this.getRandomCorridor(corridorsFilter);
    if(previousCorridor==null){
        return false;
    }
    var side=DunGen.Helpers.randomFrom(previousCorridor.exits);
    var x=DunGen.Helpers.randomInteger(side.x, side.x + side.width-1)
    var y=DunGen.Helpers.randomInteger(side.y, side.y + side.height-1);

    //console.log("Trying to give consistency to x:"+previousCorridor.x+", y:"+previousCorridor.y);
    //Try to create the feature in each direction until success
    if(!this._tryCreateFeature(x, y, 8, null, previousCorridor)){
        if(!this._tryCreateFeature(x, y, 2, null, previousCorridor)){
            if(!this._tryCreateFeature(x, y, 4, null, previousCorridor)){
                if(!this._tryCreateFeature(x, y, 6, null, previousCorridor)){
                    return false;
                }
            }
        }
    }
    return true;
}
DunGen.Dungeon.prototype._createFeature=function(){
    //for (var i = 0; i < 1000; i++) {
        if(this._exits.length==0){
            return false;
        }
        //This variables will hold the room or corridor this new feature will be built from
        var previousRoom=null;
        var previousCorridor=null;

        //To reduce the "I've thrown a bunch of random corridors leading to nowhere" effect that is caused because that's basically what we are doing
        //we try to preferably create each new feature on top of an existing corridor that has only one entrance/exit if we find any.
        var corridorConsistentTryes=this._corridorConsistency;
        while(corridorConsistentTryes>0){
            if(this._createCorridorConsistentFeature()){
                console.log("Created corridor consistent feature.")
                return true;
            }
            corridorConsistentTryes-=1;
        }

        //To be able to keep track of rooms and corridors connected to other features, instead of directly pickin an item from the _exits array, we pick
        //a random room or corridor specifically and choose a side of it to try to attach to
        var side=null;
        if(DunGen.Helpers.randomChance(50) || this._corridors.length==0){
            previousRoom=this.getRandomRoom();
            side=DunGen.Helpers.randomFrom(previousRoom.exits);
        }else{
            previousCorridor=this.getRandomCorridor();
            side=DunGen.Helpers.randomFrom(previousCorridor.exits);
        }

        //var sidePositionIndex=DunGen.Helpers.randomInteger(this._exits.length-1);
        //var x=DunGen.Helpers.randomInteger(this._exits[sidePositionIndex].x, this._exits[sidePositionIndex].x + this._exits[sidePositionIndex].width-1);
        //var y=DunGen.Helpers.randomInteger(this._exits[sidePositionIndex].y, this._exits[sidePositionIndex].y + this._exits[sidePositionIndex].height-1);
        var x=DunGen.Helpers.randomInteger(side.x, side.x + side.width-1)
        var y=DunGen.Helpers.randomInteger(side.y, side.y + side.height-1);

        //Try to create the feature in each direction until success
        if(!this._tryCreateFeature(x, y, 8, previousRoom, previousCorridor)){
            if(!this._tryCreateFeature(x, y, 2, previousRoom, previousCorridor)){
                if(!this._tryCreateFeature(x, y, 4, previousRoom, previousCorridor)){
                    if(!this._tryCreateFeature(x, y, 6, previousRoom, previousCorridor)){
                        return false;
                    }
                }
            }
        }
        return true;
   // }
}
DunGen.Dungeon.prototype._tryCreateFeature=function(x, y, dir, connectedRoom, connectedCorridor){
    var dx=0;
    var dy=0;

    if(dir==8){           //North
        dy=1;
    }else if(dir==2){     //South
        dy=-1;
    }else if(dir==4){     //Oeste
        dx=1;
    }else if(dir==6){     //Este
        dx=-1;
    }
    //If the previous tile (according to the direction) is not a floor or corridor tile, this is an invalid position as every new feature should be built
    //on top of an already existing one
    var prevTile=this._getTileId(x+dx, y+dy);
    if(prevTile!=1 && prevTile!=2){
        return false;
    }
    var extraChances=(connectedCorridor!=undefined && connectedCorridor!=null?30:-100);
    var shouldAddRoom=(DunGen.Helpers.randomChance(this._roomChance+extraChances));
    if(this._rooms.length>this._maxRooms){
        //if(this._corridors.length>this._maxCorridors){
        //    return false;
        //}
        //shouldAddRoom=false;
        return false;
    }

    if(shouldAddRoom){
        //We add a room
        if(this._makeRoom(x, y, dir, false, this._roomWallChance, connectedRoom, connectedCorridor)){
            //ToDo: Doors?
            this._setTileId(x, y, 4);
            return true;
        }
    }else{
        //We add a corridor
        if(this._makeCorridor(x, y, dir, this._corridorWallChance, connectedRoom, connectedCorridor)){
            //ToDo: Doors?
            if(prevTile!=2){
                this._setTileId(x, y, 4);
            }else{
                this._setTileId(x, y, 2);
            }
            return true;
        }
    }
    return false;
}


DunGen.Dungeon.prototype._makeCorridor=function(x, y, dir, wallChance, connectedRoom, connectedCorridor){
    var corridorRect={
        x:0,
        y:0,
        width:0,
        height:0
    };
    corridorRect.x=x;
    corridorRect.y=y;
    var forceVertical=false;
    var forceHorizontal=false;
    if(this._getWallHeight(dir)>1){
        if(dir==2 || dir==8){
            forceVertical=true;
        }else if(dir==4 || dir==6){
            forceHorizontal=true;
        }
    }
    if(!forceHorizontal && !forceVertical){
        forceHorizontal=DunGen.Helpers.randomChance(50);
        forceVertical=!forceHorizontal;
    }
    if(forceHorizontal){
        //Horizontal corridor
        corridorRect.width=DunGen.Helpers.randomInteger(this._minCorridorLength,this._maxCorridorLength);
        corridorRect.height=1;
        if(dir==8){           //North
            corridorRect.y = y - 1;
            //ToDo: xq coño se hace esto?...
            if(DunGen.Helpers.randomInteger(100)<=50){
                corridorRect.x = x - corridorRect.width + 1;
            }
        }else if(dir==2){     //South
            corridorRect.y = y + 1;
             //ToDo: xq coño se hace esto?...
            if(DunGen.Helpers.randomInteger(100)<=50){
                corridorRect.x = x - corridorRect.width + 1;
            }
        }else if(dir==4){     //West
            corridorRect.x = x - corridorRect.width;
        }else if(dir==6){     //East
            corridorRect.x = x + 1;
        }
    }else{
        //Vertical corridor
        corridorRect.width=1;
        corridorRect.height=DunGen.Helpers.randomInteger(this._minCorridorLength,this._maxCorridorLength);
        if(dir==8){           //North
            corridorRect.y = y - corridorRect.height;
        }else if(dir==2){     //South
            corridorRect.y = y + 1;
        }else if(dir==4){     //West
            corridorRect.x = x - 1;
            //ToDo: xq coño se hace esto?...
            //if(DunGen.Helpers.randomInteger(100)<=50){
           //     corridorRect.y = y - corridorRect.height + 1;
            //}
        }else if(dir==6){     //East
            corridorRect.x = x + 1;
            //ToDo: xq coño se hace esto?...
           // if(DunGen.Helpers.randomInteger(100)<=50){
           //     corridorRect.y = y - corridorRect.height + 1;
           // }
        }
    }
    if(wallChance==undefined || wallChance==null){
        wallChance=this._corridorWallChance;
    }
    var useWall=DunGen.Helpers.randomChance(wallChance);
    var collisionRect=JSON.parse(JSON.stringify(corridorRect));
    if(this._getWallHeight(dir)>1){
        if(dir==8){
            collisionRect.height-=this._getWallHeight(dir)-1;
        }if(dir==2){
            collisionRect.height-=this._getWallHeight(dir)-1;
            collisionRect.y+=this._getWallHeight(dir)-1;
        }if(dir==4){
            collisionRect.width-=this._getWallHeight(dir)-1;
        }if(dir==6){
            collisionRect.width-=this._getWallHeight(dir)-1;
            collisionRect.x+=this._getWallHeight(dir)-1;
        }
    }
    if(this._tryPlaceRect(collisionRect, useWall)){
        if(this._placeRect(corridorRect, 2, useWall, connectedRoom, connectedCorridor)){
            var toPush=this._storeRectExits(corridorRect, dir, false);
            toPush._connectedRooms=[];
            if(connectedRoom!=null){
                toPush._connectedRooms.push(connectedRoom);
            }
            toPush._connectedCorridors=[];
            if(connectedCorridor!=null){
                toPush._connectedCorridors.push(connectedCorridor);
            }
            this._corridors.push(toPush);
            this._lastGeneratedCorridor=toPush;
            this._lastGeneratedRoom=null;
            return true;
        }
    }
    return false;
}




//-----------------------------------------------------------------------------
// MV related code
//
DunGen.Parameters={};
try{
    if(PluginManager!=undefined){
        var pars=PluginManager.parameters('DunGen');
        DunGen.Parameters={};
        DunGen.Parameters.defaultTileMappings = JSON.parse(pars["defaultTileMappings"] || "[]")
        for (var index = 0; index < DunGen.Parameters.defaultTileMappings.length; index++) {
            var element = DunGen.Parameters.defaultTileMappings[index];
            DunGen.Parameters.defaultTileMappings[index]=JSON.parse(element);
            DunGen.Parameters.defaultTileMappings[index]["DungeonId"]=JSON.parse(DunGen.Parameters.defaultTileMappings[index]["DungeonId"]);
            DunGen.Parameters.defaultTileMappings[index]["RpgmId"]=JSON.parse(DunGen.Parameters.defaultTileMappings[index]["RpgmId"]);
        }
        DunGen.Parameters.perTilesetTileMappings = JSON.parse(pars["perTilesetTileMappings"] || "[]")
        for (var index = 0; index < DunGen.Parameters.perTilesetTileMappings.length; index++) {
            var element = DunGen.Parameters.perTilesetTileMappings[index];
            DunGen.Parameters.perTilesetTileMappings[index]=JSON.parse(element);
            DunGen.Parameters.perTilesetTileMappings[index]["TilesetId"]=JSON.parse(DunGen.Parameters.perTilesetTileMappings[index]["TilesetId"]);
            for (var index2 = 0; index < DunGen.Parameters.perTilesetTileMappings[index].TileMapping.length; index2++) {
                var element2 = DunGen.Parameters.perTilesetTileMappings[index].TileMapping[index2];
                DunGen.Parameters.perTilesetTileMappings[index].TileMapping[index2]=JSON.parse(element2);
                DunGen.Parameters.perTilesetTileMappings[index].TileMapping[index2]["DungeonId"]=JSON.parse(DunGen.Parameters.perTilesetTileMappings[index].TileMapping[index2]["DungeonId"]);
                DunGen.Parameters.perTilesetTileMappings[index].TileMapping[index2]["RpgmId"]=JSON.parse(DunGen.Parameters.perTilesetTileMappings[index].TileMapping[index2]["RpgmId"]);
            }
        }
                


        DunGen.Aliases={};
        DunGen.Aliases.Game_Map={};

        DunGen.Aliases.Game_Map.initialize=Game_Map.prototype.initialize;
        Game_Map.prototype.initialize=function(){
            DunGen.Aliases.Game_Map.initialize.call(this);
            this._hasGeneratedDungeon=false;
            this._otherMapDatas=[];
        }
        DunGen.Aliases.Game_Map.setup=Game_Map.prototype.setup;
        Game_Map.prototype.setup=function(mapId){
            DunGen.Aliases.Game_Map.setup.call(this, mapId);
            this._hasGeneratedDungeon=false;
            this._dungeonOptions=null;
            if(this.shouldGenerateDungeon()){
                this.parseCustomFeatures();
                this.generateDungeon();
            }
        }


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
                for(var propertyName in DunGen.Dungeon.Defaults) {
                    if(dp.documentElement.attributes[propertyName]!=null){
                        if(propertyName=="wallHeight"){
                            var splitVal=dp.documentElement.attributes[propertyName].value.split(",");
                            this._dungeonOptions[propertyName]={2:Number(splitVal[0]), 4:Number(splitVal[1]), 6:Number(splitVal[2]), 8:Number(splitVal[3])};
                        }else if(propertyName=="maxRooms"){
                            this._dungeonOptions[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                        }else if(propertyName=="maxCorridors"){
                            this._dungeonOptions[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                        }else if(propertyName=="roomChance"){
                            this._dungeonOptions[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                        }else if(propertyName=="customFeatureChance"){
                            this._dungeonOptions[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                        }else if(propertyName=="maxFeatures"){
                            this._dungeonOptions[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                        }else{
                            this._dungeonOptions[propertyName]=dp.documentElement.attributes[propertyName].value;
                        }
                    }else{
                        this._dungeonOptions[propertyName]=DunGen.Dungeon.Defaults[propertyName];
                    }
                }
                toReturn= this._dungeonOptions;//Object.assign(defOpts, temporalAttrs);
            }
            return toReturn;
        }

        Game_Map.prototype.generateDungeon=function(){
            var lasOpts=Object.assign(this._dungeonOptions, {width:$gameMap.width(), height:$gameMap.height()});
            this._dungeonGenerator=new DunGen.Dungeon(lasOpts);
            this._dungeonGenerator.generate();
            this._hasGeneratedDungeon=true;
        }

        DunGen.Helpers.rotateMapToRight=function(array) {
            var result = [];
            array.forEach(function (a, i, aa) {
                a.forEach(function (b, j, bb) {
                    result[bb.length - j - 1] = result[bb.length - j - 1] || [];
                    result[bb.length - j - 1][i] = b;
                });
            });
            return result;
        }

        DunGen.Helpers.rotateMapToLeft=function(array) {
            var result = [];
            array.forEach(function (a, i, aa) {
                a.forEach(function (b, j, bb) {
                    result[j] = result[j] || [];
                    result[j][aa.length - i - 1] = b;
                });
            });
            return result;
        }

        Game_Map.prototype.getGeneratedData=function (x, y, z) {
            var width = $dataMap.width;
            var height = $dataMap.height;
            //Z ES LA CAPA EN EL EDITOR!!!!! JODEEEEEER!!!
            if(z==2){
                //var tmpData=DunGen.Helpers.rotateMapToLeft(this._dungeonGenerator._tiles);
                return this.getMappedTile(this._dungeonGenerator._getTileId(x,y));
            }else{
                return $dataMap.data[(z * height + y) * width + x] || 0;
            }
        }

        Game_Map.prototype.getMappedTile=function (generatedTileId) {
            var found=DunGen.Parameters.defaultTileMappings.filter(function(gt){
                return gt.DungeonId==generatedTileId;
            });
            return found.length>0?found[0].RpgmId:0;
        }
        Game_Map.prototype.getMappedTileInverse=function (mvTileId, layer) {
            var found=DunGen.Parameters.defaultTileMappings.filter(function(gt){
                return gt.RpgmId==mvTileId;
            });
            return found.length>0?found[0].DungeonId:0;
        }
        DunGen.Aliases.Game_Map.isPassable=Game_Map.prototype.isPassable;
        Game_Map.prototype.isPassable = function(x, y, d) {
            if(this.hasGeneratedDungeon()){
                var tId=this._dungeonGenerator._getTileId(x, y);
                return tId!=3; //&& tId!=4;
            }else{
                return DunGen.Aliases.Game_Map.isPassable.call(this, x, y, d);
            }
        };
        DunGen.Aliases.Game_Map.data=Game_Map.prototype.data;
        Game_Map.prototype.data=function(){
            if(this.hasGeneratedDungeon()){
                var len=DunGen.Aliases.Game_Map.data.call(this).length;
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
                return DunGen.Aliases.Game_Map.data.call(this);
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
            var tmpGen=new DunGen.Dungeon();
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
                //We also load all child maps datas
                var childMapIds=this.getChildMapIds(mapId);
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
        Game_Map.prototype.loadChildMapDatas=function () {
            var childMapIds=this.getChildMapIds();
            for (var childIndex = 0; childIndex < childMapIds.length; childIndex++) {
                var cmapId = childMapIds[childIndex];
                if(window["$dataMap_"+cmapId]!=undefined && window["$dataMap_"+cmapId]!=null){
                    return window["$dataMap_"+cmapId];
                }else{
                    DataManager.loadOtherMapData(cmapId);
                }
            }
        }
        Game_Map.prototype.getChildMapData=function (childId) {
            return window["$dataMap_"+childId];
        }
        Game_Map.prototype.getChildMapDatas=function(){
            var toRet=[];
            var childMapIds=this.getChildMapIds();
            for (var childIndex = 0; childIndex < childMapIds.length; childIndex++) {
                var cmapId = childMapIds[childIndex];
                toRet.push(this.getChildMapData(cmapId));
            }
            return toRet;
        }

        Game_Map.prototype.parseFeatureNotetag=function(eNote){
            var toReturn=null;
            var rgx=new RegExp("<\\s*feature\\s+([\\w\\s\\d='\":_\\.\\*\\+-\\{\\}]*)\\s*\\/?\\s*>", "ig");
            var regexMatch = rgx.exec(eNote);
            if(regexMatch){
                var dp=new window.DOMParser().parseFromString(regexMatch[0], "text/xml");
                var ftOpts={};
                for(var propertyName in DunGen.CustomFeature.Defaults) {
                    if(dp.documentElement.attributes[propertyName]!=null){
                        if(propertyName!="data"){
                            if(propertyName!="name"){
                                ftOpts[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                            }else{
                                ftOpts[propertyName]=dp.documentElement.attributes[propertyName].value;
                            }
                            
                        }
                    }else{
                        ftOpts[propertyName]=DunGen.CustomFeature.Defaults[propertyName];
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
                    var newFeat=new DunGen.CustomFeature(susFeatOpts);
                    if(this._dungeonOptions){
                        newFeat.data=cData.data;
                        newFeat.width=cData.width;
                        newFeat.height=cData.height;
                        this._dungeonOptions.customFeatures.push(newFeat);
                    }
                }
            }
        }
    }
}catch(err){
    console.error(err);
}