//=============================================================================
// SD_Generator.js
//=============================================================================
/*:
 * @plugindesc C3 - An index of all available mapping tiles in the system.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * */
var PD=PD || {};
PD.Tiles={};
PD.Tiles.name2id=function(name){
    return PD.Tiles.name2data(name).tileId;
}
PD.Tiles.id2name=function(name){
    return PD.Tiles.name2data(name).tileId;
}
PD.Tiles.id2data=function(id){
    var list = PD.Tiles.data.filter(function(each){
        return each.tileId==id;
    });
    if(list.length>0){
        return list[0];
    }
    return null;
}
PD.Tiles.name2data=function(name){
    var list = PD.Tiles.data.filter(function(each){
        return each.tileInternalName==name;
    });
    if(list.length>0){
        return list[0];
    }
    return null;
}
//DebugSymbol
PD.Tiles.tile_DebugSymbol=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return false;
    var toRet=null;
    if(foundData.debugSymbol!=undefined && foundData.debugSymbol!=null) toRet=foundData.debugSymbol;
    return toRet;
}
PD.Tiles.tileName_Through=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return false;
    var toRet=null;
    if(foundData.debugSymbol!=undefined && foundData.debugSymbol!=null) toRet=foundData.debugSymbol;
    return toRet;
}
//Passability
PD.Tiles.tile_Through=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return false;
    return foundData.through;
}
PD.Tiles.tileName_Through=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return false;
    return foundData.through;
}
//Occlusion
PD.Tiles.tile_Occludes=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return false;
    return foundData.occluder;
}
PD.Tiles.tileName_Occludes=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return false;
    return foundData.occluder;
}
//Display name
PD.Tiles.tile_DisplayName=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return "";
    return foundData.name;
}
PD.Tiles.tileName_DisplayName=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return "";
    return foundData.name;
}
//Display description
PD.Tiles.tile_Description=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return "";
    return foundData.description;
}
PD.Tiles.tileName_Description=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return "";
    return foundData.description;
}
//Flamable
PD.Tiles.tile_Flamable=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return false;
    return foundData.flamable;
}
PD.Tiles.tileName_Flamable=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return false;
    return foundData.flamable;
}
//Liquid
PD.Tiles.tile_Liquid=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return false;
    return foundData.liquid;
}
PD.Tiles.tileName_Liquid=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return false;
    return foundData.liquid;
}
//Hidden
PD.Tiles.tile_Hidden=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return false;
    return foundData.hidden;
}
PD.Tiles.tileName_Hidden=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return false;
    return foundData.hidden;
}
//Avoid (Tiles that warn the player before moving over them)
PD.Tiles.tile_Avoid=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return false;
    return foundData.avoid;
}
PD.Tiles.tileName_Avoid=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return false;
    return foundData.avoid;
}
//Tileset tile id
PD.Tiles.tile_TilesetTileId=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null) return 0;
    return foundData.tilesetTileId;
}
PD.Tiles.tileName_TilesetTileId=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null) return 0;
    return foundData.tilesetTileId;
}
//Tileset event id
PD.Tiles.tile_EventId=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null || foundData.eventId==undefined) return -1;
    return foundData.eventId;
}
PD.Tiles.tileName_EventId=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null|| foundData.eventId==undefined) return -1;
    return foundData.eventId;
}
//Tileset eventTriggerA
PD.Tiles.tile_EventLocalA=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null || foundData.eventLocalA==undefined) return false;
    return foundData.eventLocalA;
}
PD.Tiles.tileName_EventLocalA=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null || foundData.eventLocalA==undefined) return false;
    return foundData.eventLocalA;
}
//Tileset eventTriggerB
PD.Tiles.tile_EventLocalB=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null || foundData.eventLocalB==undefined) return false;
    return foundData.eventLocalB;
}
PD.Tiles.tileName_EventLocalB=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null || foundData.eventLocalB==undefined) return false;
    return foundData.eventLocalB;
}
//Tileset eventTriggerC
PD.Tiles.tile_EventLocalC=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null || foundData.eventLocalC==undefined) return false;
    return foundData.eventLocalC;
}
PD.Tiles.tileName_EventLocalC=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null || foundData.eventLocalC==undefined) return false;
    return foundData.eventLocalC;
}
//Tileset eventTriggerD
PD.Tiles.tile_EventLocalD=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null || foundData.eventLocalD==undefined) return false;
    return foundData.eventLocalD;
}
PD.Tiles.tileName_EventLocalD=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null || foundData.eventLocalD==undefined) return false;
    return foundData.eventLocalD;
}
//Tileset unstichable
PD.Tiles.tile_Unstichable=function(id){
    var foundData=PD.Tiles.id2data(id);
    if(foundData==null || foundData.eventLocalD==undefined) return false;
    return foundData.unstichable;
}
PD.Tiles.tileName_Unstichable=function(name){
    var foundData=PD.Tiles.name2data(name);
    if(foundData==null || foundData.eventLocalD==undefined) return false;
    return foundData.unstichable;
}
PD.Tiles.data=[
    {
        "tileId":0,
        "tileInternalName":"VOID",
        "debugSymbol":0x25A9,
        "tilesetLayer":3,
        "tilesetTileId":0,
        "name":"Void",
        "description":"You can't see the bottom.",
        "through":false,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":true
    },
    {
        "tileId":1,
        "tileInternalName":"ROOMFLOOR",
        "debugSymbol":0x25A4,
        "tilesetLayer":3, 
        "tilesetTileId":1,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":2,
        "tileInternalName":"FLOORSP",
        "debugSymbol":0x25A4,
        "tilesetLayer":3, 
        "tilesetTileId":30,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":true
    },
    {
        "tileId":3,
        "tileInternalName":"WALL",
        "debugSymbol":0x25EB,
        "tilesetLayer":3, 
        "tilesetTileId":4,
        "name":"Wall",
        "description":"",
        "through":false,
        "occluder":true,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":true
    },
    {
        "tileId":4,
        "tileInternalName":"CLOSEDDOOR",
        "debugSymbol":0x25EA,
        "tilesetLayer":3, 
        "tilesetTileId":5,
        "name":"Closed door",
        "description":"",
        "through":true,
        "occluder":true,
        "eventId":1,
        "eventLocalA":false,
        "eventLocalB":false,
        "eventLocalC":false,
        "eventLocalD":false,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":true
    },
    {
        "tileId":5,
        "tileInternalName":"OPENDOOR",
        "tilesetLayer":3, 
        "tilesetTileId":6,
        "name":"Open door",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":1,
        "eventLocalA":true,
        "eventLocalB":false,
        "eventLocalC":false,
        "eventLocalD":false,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":true
    },
    {
        "tileId":6,
        "tileInternalName":"LOCKEDDOOR",
        "tilesetLayer":3, 
        "tilesetTileId":26,
        "name":"Locked door",
        "description":"This door is locked, you need a matching key to unlock it.",
        "through":false,
        "occluder":false,
        "eventId":1,
        "eventLocalA":false,
        "eventLocalB":true,
        "eventLocalC":false,
        "eventLocalD":false,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":true
    },
    {
        "tileId":7,
        "tileInternalName":"HIDDENDOOR",
        "tilesetLayer":3, 
        "tilesetTileId":3,
        "name":"Wall",
        "description":"",
        "through":false,
        "occluder":false,
        "eventId":-1,
        "flamable":true,
        "hidden":true,
        "liquid":false,
        "avoid":false,
        "unstichable":true
    },
    {
        "tileId":8,
        "tileInternalName":"DECOFLOOR",
        "debugSymbol":0x25A4,
        "tilesetLayer":3, 
        "tilesetTileId":32,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":9,
        "tileInternalName":"DECOWALL",
        "debugSymbol":0x25EB,
        "tilesetLayer":3, 
        "tilesetTileId":28,
        "name":"Wall",
        "description":"",
        "through":false,
        "occluder":true,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":10,
        "tileInternalName":"GRASS",
        "debugSymbol":0x25A4,
        "tilesetLayer":3, 
        "tilesetTileId":31,
        "name":"High grass",
        "description":"Dense vegetation blocks the view.",
        "through":true,
        "occluder":true,
        "eventId":2,
        "eventLocalA":false,
        "eventLocalB":false,
        "eventLocalC":false,
        "eventLocalD":false,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":11,
        "tileInternalName":"TRAMPLEDGRASS",
        "debugSymbol":0x25A4,
        "tilesetLayer":3, 
        "tilesetTileId":2,
        "name":"Trampled grass",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":2,
        "eventLocalA":true,
        "eventLocalB":false,
        "eventLocalC":false,
        "eventLocalD":false,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":12,
        "tileInternalName":"EMBERS",
        "debugSymbol":0x25A4,
        "tilesetLayer":3, 
        "tilesetTileId":25,
        "name":"Embers",
        "description":"Embers cover the floor.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":13,
        "tileInternalName":"WATER",
        "tilesetLayer":3, 
        "tilesetTileId":63,
        "name":"Water",
        "description":"In case of burning step into the water to extinguish the fire.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":true,
        "avoid":false,
        "unstichable":true
    },
    {
        "tileId":14,
        "tileInternalName":"BARRICADE",
        "debugSymbol":0x1F4DA,
        "tilesetLayer":3, 
        "tilesetTileId":29,
        "name":"Barricade",
        "description":"The wooden barricade is firmly set but has dried over the years. Might it burn?",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":15,
        "tileInternalName":"BOOKSHELF",
        "debugSymbol":0x1F4DA,
        "tilesetLayer":3, 
        "tilesetTileId":41,
        "name":"Bookshelf",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":true
    },
    {
        "tileId":16,
        "tileInternalName":"ALCHEMYPOT",
        "tilesetLayer":3, 
        "tilesetTileId":42,
        "name":"Alchemy Pot",
        "description":"Drop some seeds here to cook a potion.",
        "through":false,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":17,
        "tileInternalName":"FULLWELL",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Well",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":18,
        "tileInternalName":"EMPTYWELL",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Empty well",
        "description":"The well has run dry.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":19,
        "tileInternalName":"PEDESTAL",
        "debugSymbol":0x25A4,
        "tilesetLayer":3, 
        "tilesetTileId":27,
        "name":"Pedestal",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":20,
        "tileInternalName":"STATUE",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Statue",
        "description":"Someone wanted to adorn this place, but failed, obviously.",
        "through":false,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":21,
        "tileInternalName":"UPSTAIRS",
        "debugSymbol":0x25B2,
        "tilesetLayer":3, 
        "tilesetTileId":7,
        "name":"Depth entrance",
        "description":"Stairs lead up to the upper depth.",
        "through":true,
        "occluder":false,
        "eventId":5,
        "eventLocalA":false,
        "eventLocalB":false,
        "eventLocalC":false,
        "eventLocalD":false,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":22,
        "tileInternalName":"DOWNSTAIRS",
        "debugSymbol":0x25BC,
        "tilesetLayer":3, 
        "tilesetTileId":24,
        "name":"Depth exit",
        "description":"Stairs lead down to the lower depth.",
        "through":true,
        "occluder":false,
        "eventId":4,
        "eventLocalA":false,
        "eventLocalB":false,
        "eventLocalC":false,
        "eventLocalD":false,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":23,
        "tileInternalName":"BOSSDOOR",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Unlocked depth exit",
        "description":"Stairs lead down to the lower depth.",
        "through":false,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":24,
        "tileInternalName":"LOCKEDBOSSDOOR",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Locked depth exit",
        "description":"Heavy bars block the stairs leading down.",
        "through":false,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":25,
        "tileInternalName":"SIGN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Sign",
        "description":"You can't read the text from here.",
        "through":false,
        "occluder":false,
        "eventId":-1,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":26,
        "tileInternalName":"TRAPTOXIC",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Toxic trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":27,
        "tileInternalName":"TRAPFIRE",
        "tilesetLayer":3, 
        "tilesetTileId":11,
        "name":"Fire trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":3,
        "eventLocalA":false,
        "eventLocalB":false,
        "eventLocalC":false,
        "eventLocalD":false,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":28,
        "tileInternalName":"TRAPPARALYTIC",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Paralytic trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":29,
        "tileInternalName":"TRAPPOISON",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Poison trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":30,
        "tileInternalName":"TRAPALARM",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Alarm trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":31,
        "tileInternalName":"TRAPLIGHTNING",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Lightning trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":32,
        "tileInternalName":"TRAPGRIPPING",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Gripping trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":33,
        "tileInternalName":"TRAPSUMMONING",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Summoning trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true,
        "unstichable":false
    },
    {
        "tileId":34,
        "tileInternalName":"TRAPTOXICHIDDEN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":35,
        "tileInternalName":"TRAPFIREHIDDEN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":36,
        "tileInternalName":"TRAPPARALYTICHIDDEN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":37,
        "tileInternalName":"TRAPPOISONHIDDEN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":38,
        "tileInternalName":"TRAPALARMHIDDEN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":39,
        "tileInternalName":"TRAPLIGHTNINGHIDDEN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":40,
        "tileInternalName":"TRAPGRIPPINGHIDDEN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":41,
        "tileInternalName":"TRAPSUMMONINGHIDDEN",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Floor",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    },
    {
        "tileId":42,
        "tileInternalName":"TRAPTRIGGERED",
        "tilesetLayer":3, 
        "tilesetTileId":15,
        "name":"Triggered trap",
        "description":"The trap has been triggered before and it's not dangerous anymore.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false,
        "unstichable":false
    }    
    
];