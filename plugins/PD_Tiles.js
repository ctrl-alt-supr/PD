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
        "avoid":true
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
        "avoid":false
    },
    {
        "tileId":2,
        "tileInternalName":"CORRIDORFLOOR",
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
        "avoid":false
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
        "avoid":false
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
        "occluder":false,
        "eventId":1,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":5,
        "tileInternalName":"OPENDOOR",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Open door",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":2,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":6,
        "tileInternalName":"LOCKEDDOOR",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Locked door",
        "description":"This door is locked, you need a matching key to unlock it.",
        "through":true,
        "occluder":false,
        "eventId":3,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":7,
        "tileInternalName":"HIDDENDOOR",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Wall",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":4,
        "flamable":true,
        "hidden":true,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":8,
        "tileInternalName":"DECOFLOOR",
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
        "avoid":false
    },
    {
        "tileId":9,
        "tileInternalName":"DECOWALL",
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
        "avoid":false
    },
    {
        "tileId":10,
        "tileInternalName":"GRASS",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"High grass",
        "description":"Dense vegetation blocks the view.",
        "through":true,
        "occluder":false,
        "eventId":5,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":11,
        "tileInternalName":"TRAMPLEDGRASS",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Trampled grass",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":6,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":12,
        "tileInternalName":"EMBERS",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Embers",
        "description":"Embers cover the floor.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":13,
        "tileInternalName":"WATER",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Water",
        "description":"In case of burning step into the water to extinguish the fire.",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":true,
        "avoid":false
    },
    {
        "tileId":14,
        "tileInternalName":"BARRICADE",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Barricade",
        "description":"The wooden barricade is firmly set but has dried over the years. Might it burn?",
        "through":true,
        "occluder":false,
        "eventId":7,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":15,
        "tileInternalName":"BOOKSHELF",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Bookshelf",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":8,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":16,
        "tileInternalName":"ALCHEMYPOT",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Alchemy Pot",
        "description":"Drop some seeds here to cook a potion.",
        "through":false,
        "occluder":false,
        "eventId":9,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":10,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
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
        "eventId":11,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":19,
        "tileInternalName":"PEDESTAL",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Pedestal",
        "description":"",
        "through":true,
        "occluder":false,
        "eventId":-1,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "avoid":false
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
        "eventId":12,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":13,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":14,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":15,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":16,
        "flamable":true,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":17,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
    },
    {
        "tileId":27,
        "tileInternalName":"TRAPFIRE",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Fire trap",
        "description":"Stepping onto a hidden pressure plate will activate the trap.",
        "through":true,
        "occluder":false,
        "eventId":18,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
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
        "eventId":19,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
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
        "eventId":20,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
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
        "eventId":21,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
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
        "eventId":22,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
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
        "eventId":23,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
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
        "eventId":24,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":true
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
        "eventId":25,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":26,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":27,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":28,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":29,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":30,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":31,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
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
        "eventId":32,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
    },
    {
        "tileId":42,
        "tileInternalName":"TRAPTRIGGERED",
        "tilesetLayer":3, 
        "tilesetTileId":0,
        "name":"Triggered trap",
        "description":"The trap has been triggered before and it's not dangerous anymore.",
        "through":true,
        "occluder":false,
        "eventId":33,
        "flamable":false,
        "hidden":false,
        "liquid":false,
        "avoid":false
    }    
    
];