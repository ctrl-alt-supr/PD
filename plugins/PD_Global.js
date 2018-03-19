//=============================================================================
// SD_Global.js
//=============================================================================
/*:
 * @plugindesc 1 - Takes care of the global save game where, for example, unlocked classes are stored.
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