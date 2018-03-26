//=============================================================================
// SD_Global.js
//=============================================================================
/*:
 * @plugindesc C2 - Takes care of the global save game where, for example, unlocked classes are stored.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

DataManager.PDGlobalInfo={};

DataManager.loadGlobalInfo = function() {
    var json;
    try {
        json = StorageManager.load(0);
    } catch (e) {
        console.error(e);
        return [];
    }
    if (json) {
        var globalInfo = JSON.parse(json);
        for (var i = 1; i <= this.maxSavefiles(); i++) {
            if (!StorageManager.exists(i)) {
                delete globalInfo[i];
            }
        }
        return globalInfo;
    } else {
        return [];
    }
};

DataManager.loadPDGlobalInfo = function() {
    var json;
    try {
        json = StorageManager.load(1000);
    } catch (e) {
        console.error(e);
        return {};
    }
    if (json) {
        var PDGlobalInfo = JSON.parse(json);
        return PDGlobalInfo;
    } else {
        return {};
    }
};
DataManager.saveGlobalInfo = function(info) {
    StorageManager.save(0, JSON.stringify(info));
};
DataManager.savePDGlobalInfo = function(info) {
    StorageManager.save(1000, JSON.stringify(info));
};

DataManager.saveGameWithoutRescue = function(savefileId) {
   var json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    var globalInfo = this.loadGlobalInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    this.saveGlobalInfo(globalInfo);
    return true;
};
DataManager.makeSaveContents = function() {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    var contents = {};

    contents.system       = $gameSystem;
    contents.screen       = $gameScreen;
    contents.timer        = $gameTimer;
    contents.switches     = $gameSwitches;
    contents.variables    = $gameVariables;
    contents.selfSwitches = $gameSelfSwitches;
    contents.actors       = $gameActors;
    contents.party        = $gameParty;
    if($gameMap.hasGeneratedDungeon()){
        var PDSaveContents=PD.MakeDungeonSaveContents()
        contents.PD=PDSaveContents;
        delete $gameMap._dungeonLevel;
        delete $gameMap._dungeonGenerator;
        delete $gameMap._pathFindingFinder;
        delete $gameMap._pathFindingGrid;
        contents.map          = $gameMap;
        //$gameMap._dungeonLevel=dungeonLevel;
        //$gameMap._dungeonGenerator=dungeonGenerator;
    }else{
        contents.map          = $gameMap;
    }
    contents.player       = $gamePlayer;
    return contents;
};

DataManager.extractSaveContents = function(contents) {
    
    $gameSystem        = contents.system;
    $gameScreen        = contents.screen;
    $gameTimer         = contents.timer;
    $gameSwitches      = contents.switches;
    $gameVariables     = contents.variables;
    $gameSelfSwitches  = contents.selfSwitches;
    $gameActors        = contents.actors;
    $gameParty         = contents.party;
    $gameMap           = contents.map;
    if(contents.PD!=undefined && contents.PD!=null){
        PD.ParseDungeonSaveContents(contents.PD);
    }
    $gamePlayer        = contents.player;
};


var aliasSceneCreate=Scene_Title.prototype.create;
Scene_Title.prototype.create=function(){
    DataManager.PDGlobalInfo=DataManager.loadPDGlobalInfo();
    var modified=false;
    if(JSON.stringify(DataManager.PDGlobalInfo)=="{}"){
        DataManager.PDGlobalInfo.version="0.0.0";
        modified=true;
    }
    if(DataManager.PDGlobalInfo.unlockedClasses==undefined){
        DataManager.PDGlobalInfo.unlockedClasses=[];
        DataManager.PDGlobalInfo.unlockedClasses.push(1);
        DataManager.PDGlobalInfo.unlockedClasses.push(2);
        DataManager.PDGlobalInfo.unlockedClasses.push(3);
        modified=true;
    }
    if(modified){
        DataManager.savePDGlobalInfo(DataManager.PDGlobalInfo);
    }
}


PD.ParseDungeonSaveContents=function(contents){
    PD.Dungeon.reset();
    PD.Dungeon.lastCurrentDepth=contents.lastCurrentDepth;
    PD.Dungeon._discoveredTiles=contents.discoveredTiles;
    for (var lvlIndx = 0; lvlIndx < contents.levels.length; lvlIndx++) {
        var genLevl = contents.levels[lvlIndx];
        if(genLevl==undefined || genLevl==null){
            PD.Dungeon._levels.push(genLevl);
            continue;
        }
        var genData=genLevl._generator;
        var genInst=Object.assign(new PD.Generator.Dungeon(),genData);
        genInst.prototype=PD.Generator.Dungeon;
        var lvlInst=Object.assign(new PD.Level(), {_depth: genLevl._depth, _generator:genInst });
        lvlInst.prototype=PD.Level;
        PD.Dungeon._levels.push(lvlInst);
    }
    if(contents.currLevel!=null){
        var genData=contents.currLevel._generator;
        var genInst=Object.assign(new PD.Generator.Dungeon(),genData);
        genInst.prototype=PD.Generator.Dungeon;
        var lvlInst=Object.assign(new PD.Level(), {_depth: contents.currLevel._depth, _generator:genInst });
        lvlInst.prototype=PD.Level;
        $gameMap._dungeonGenerator=genInst;
        $gameMap._dungeonLevel=lvlInst;
    }
}
PD.MakeDungeonSaveContents=function(){
    var generatorInfo={
        _depth:0,
        _height:0,
        _width:0,
        _minRoomSize:0,
        _maxRoomSize:9,
        _tiles:[],
        _specials:[],
        _entranceRoom:null,
        _exitRoom:null,
        _shopRoom:null,
        _connected:[],
        _rooms:[],
        _entrancePoint:null,
        _exitPoint:null,
    };
    var levelInfo={
        _depth:0,
        _generator:null,
    };
    var contents={};
    contents.lastCurrentDepth=PD.Dungeon.lastCurrentDepth;
    contents.discoveredTiles=PD.Dungeon._discoveredTiles;
    contents.levels=[];
    for (var lvlIndx = 0; lvlIndx < PD.Dungeon._levels.length; lvlIndx++) {
        var genLevl = PD.Dungeon._levels[lvlIndx];
        if(genLevl==undefined || genLevl==null){
            contents.levels.push(genLevl); 
            continue;
        } 
        var genInfo={};
        for (var property in generatorInfo) {
            if (generatorInfo.hasOwnProperty(property) && genLevl._generator.hasOwnProperty(property)) {
                genInfo[property]=genLevl._generator[property];
            }
        };
        var lvlInfo={
            _depth:genLevl._depth,
            _generator:genInfo
        }
        contents.levels.push(lvlInfo);
    }

    contents.currLevel=null;
    if($gameMap.hasGeneratedDungeon()){
        var genInMap=$gameMap._dungeonGenerator;
        var genInfo={};
        for (var property in generatorInfo) {
            if (generatorInfo.hasOwnProperty(property) && genInMap.hasOwnProperty(property)) {
                genInfo[property]=genInMap[property];
            }
        };
        var lvlInfo={
            _depth:genInfo._depth,
            _generator:genInfo
        }
        contents.currLevel=lvlInfo;
    }
    return contents;
    
}

Scene_Save.prototype.onSaveSuccess = function() {
    SoundManager.playSave();
	StorageManager.cleanBackup(this.savefileId());
    SceneManager.goto(Scene_Title);
};