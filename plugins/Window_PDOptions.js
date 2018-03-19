//=============================================================================
// Window_SDOptions.js
//=============================================================================
/*:
 * @plugindesc The Options screen.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

function Window_PDOptions() {
    this.initialize.apply(this, arguments);
}

Window_PDOptions.prototype = Object.create(Window_PDButtonCommand.prototype);
Window_PDOptions.prototype.constructor = Window_PDOptions;

Window_PDOptions.prototype.initialize = function() {
    Window_PDButtonCommand.prototype.initialize.call(this, [{
        name:"Music",
        symbol:"bgmVolume",
        isToggle:true
    },{
        name:"Sound FX",
        symbol:"seVolume",
        isToggle:true
    },{
        name:"Cancel",
        symbol:"cancel"
    }]);
    this.updatePlacement();
    this.setCommandToggleChecked(0, ConfigManager["bgmVolume"]==100);
    this.setCommandToggleChecked(1, ConfigManager["seVolume"]==100);
    this.redrawItem(0);
    this.redrawItem(1);
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
    this.open();
};
Window_PDOptions.prototype.windowWidth = function() {
    return 240;
};
Window_PDOptions.prototype.getConfigValue = function(symbol) {
    return ConfigManager[symbol];
};
Window_PDOptions.prototype.isSoundSymbol = function(symbol) {
    return symbol=="bgmVolume" || symbol=="seVolume";
};
Window_PDOptions.prototype.updatePlacement = function() {
    this.x = 0;
    this.y = 0;
};
Window_PDOptions.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if(ConfigManager[symbol]!=undefined && ConfigManager[symbol]!=null){
        var value = this.getConfigValue(symbol);
        if(this.isSoundSymbol(symbol)){
            if(value==100){
                ConfigManager[symbol] = 0;
                SoundManager.playCursor();
            }else if(value==0){
                ConfigManager[symbol] = 100;
                SoundManager.playCursor();
            }else{
                ConfigManager[symbol] = 0;
                SoundManager.playCursor();
            }
            this.setCommandToggleChecked(index, ConfigManager[symbol]==100);
            this.redrawItem(index);
            //this.refresh();
        }
    }else{
        Window_PDButtonCommand.prototype.processOk.call(this);
    }
};

//-----------------------------------------------------------------------------
// Scene_PDOptions
//
// The scene class of the options screen.

function Scene_PDOptions() {
    this.initialize.apply(this, arguments);
}

Scene_PDOptions.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PDOptions.prototype.constructor = Scene_PDOptions;

Scene_PDOptions.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PDOptions.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
};

Scene_PDOptions.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};

Scene_PDOptions.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_PDOptions();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};