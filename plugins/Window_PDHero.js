//=============================================================================
// Window_SDHero.js
//=============================================================================
/*:
 * @plugindesc The Choose Hero screen.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

function Scene_ChooseHero() {
    this.initialize.apply(this, arguments);
}

Scene_ChooseHero.prototype = Object.create(Scene_Base.prototype);
Scene_ChooseHero.prototype.constructor = Scene_ChooseHero;

Scene_ChooseHero.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_ChooseHero.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackgroundA();
    this.createBackgroundB();
    this.createChooseHeroTitle();
    this.createHeroList();
    this.createPlayCommands();
};




Scene_ChooseHero.prototype.createHeroList=function(){
    this._helpWindow=new Window_PDChooseHeroHelp();
    this.addChild(this._helpWindow);
    this._heroList=new Window_PDChooseHeroList();
    this._heroList.setHelpWindow(this._helpWindow);
    this._heroList.setHandler('ok',  this.heroChoosenHandler.bind(this));
    this._heroList.setHandler('cancel', this.popScene.bind(this));
    this.addChild(this._heroList);
}
Scene_ChooseHero.prototype.heroChoosenHandler=function(){
    var choosenHeroId=this._heroList.item();
    console.log(choosenHeroId);
    this._heroList.deactivate();
    this._playCommands.open();
    this._playCommands.activate();
    this._playCommands.select(DataManager.isAnySavefileExists()?0:1);
}
Scene_ChooseHero.prototype.heroChoosenCancelHandler=function(){
    this._playCommands.deactivate();
    this._playCommands.close();
    this._heroList.activate();
}
Scene_ChooseHero.prototype.playOrContinueHandler=function(){
    var choosenOpt=this._playCommands.currentSymbol();
    if(choosenOpt=="newGame"){
        this.commandNewGame();
    }else{
        this.commandContinue();
    }
}
Scene_ChooseHero.prototype.createChooseHeroTitle=function(){
    this._title=new Sprite();
    this._title.bitmap=ImageManager.loadTitle2("SD_chooseHeroTitle");
    this.addChild(this._title);
}
Scene_ChooseHero.prototype.createPlayCommands=function(){
    this._playCommands=new Window_PDChooseHeroCommand();
    this._playCommands.setHandler('ok',  this.playOrContinueHandler.bind(this));
    this._playCommands.setHandler('cancel', this.heroChoosenCancelHandler.bind(this));
    this.addChild(this._playCommands);
}
Scene_ChooseHero.prototype.createBackgroundA=function(){
    this._bgA=new TilingSprite();
    this._bgA.move(0,0,Graphics.width, Graphics.height);
    this._bgA.bitmap=ImageManager.loadTitle2("SD_bgA");
    this.addChild(this._bgA);
}
Scene_ChooseHero.prototype.createBackgroundB=function(){
    this._bgB=new TilingSprite();
    this._bgB.move(0,0,Graphics.width, Graphics.height);
    this._bgB.bitmap=ImageManager.loadTitle2("SD_bgB");
    this.addChild(this._bgB);
}
Scene_ChooseHero.prototype.scrollBackgroundA=function(){
    this._bgA.origin.y+=0.5;
}

Scene_ChooseHero.prototype.scrollBackgroundB=function(){
    this._bgB.origin.y+=1;
}

Scene_ChooseHero.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    this._playCommands.close();
    this._heroList.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};

Scene_ChooseHero.prototype.commandContinue = function() {
    this._playCommands.close();
    this._heroList.close();
    SceneManager.goto(Scene_Load);
};


Scene_ChooseHero.prototype.update = function() {
    //if (this.isActive() && !this.isBusy() && this.isTriggered()) {
    //    this.gotoTitle();
    //}
    Scene_Base.prototype.update.call(this);
    this.scrollBackgroundA();
    this.scrollBackgroundB();
};

Scene_ChooseHero.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this._title.y=20;
    this._title.x=Graphics.width/2-this._title.bitmap.width/2;
    this._heroList.y=this._title.y+this._title.height;
    this._heroList.x=Graphics.width/2-this._heroList.width/2;
    this._heroList.height=this._heroList.width;

    //this._playCommands.open();
    this._heroList.refresh();
    this._heroList.select(0);
    this._heroList.activate();
    
    this.startFadeIn(this.slowFadeSpeed(), false);
};

Scene_ChooseHero.prototype.isTriggered = function() {
    return Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered();
};

Scene_ChooseHero.prototype.gotoTitle = function() {
    SceneManager.goto(Scene_Title);
};

//-----------------------------------------------------------------------------
// Window_PDChooseHeroCommand
//
// The window for changing various settings on the options screen.

function Window_PDChooseHeroCommand() {
    this.initialize.apply(this, arguments);
}

Window_PDChooseHeroCommand.prototype = Object.create(Window_PDButtonCommand.prototype);
Window_PDChooseHeroCommand.prototype.constructor = Window_PDChooseHeroCommand;

Window_PDChooseHeroCommand.prototype.initialize = function() {
    Window_PDButtonCommand.prototype.initialize.call(this, [{
        name:"Continue",
        symbol:"continue",
        isToggle:false,
        enabled:DataManager.isAnySavefileExists()
    },{
        name:"New Game",
        symbol:"newGame",
        isToggle:false,
        enabled:true
    }], 2);
    this.updatePlacement();
    this.setCommandToggleChecked(0, ConfigManager["bgmVolume"]==100);
    this.setCommandToggleChecked(1, ConfigManager["seVolume"]==100);
    this.redrawItem(0);
    this.redrawItem(1);
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height);
    this.setBackgroundType(2);
    this.deactivate();
    //this.open();
};
Window_PDChooseHeroCommand.prototype.windowWidth = function() {
    return Graphics.boxWidth-300;
};
Window_PDChooseHeroCommand.prototype.windowHeight = function() {
    return DataManager.PDUI.button.height*2;
};
Window_PDChooseHeroCommand.prototype.itemHeight = function() {
    return Window_PDButtonCommand.prototype.itemHeight.call(this)*2;
};
Window_PDChooseHeroCommand.prototype.getConfigValue = function(symbol) {
    return ConfigManager[symbol];
};
Window_PDChooseHeroCommand.prototype.isSoundSymbol = function(symbol) {
    return symbol=="bgmVolume" || symbol=="seVolume";
};
Window_PDChooseHeroCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height);
};
Window_PDChooseHeroCommand.prototype.processOk = function() {
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
// Window_PDChooseHeroList
//
// The window for selecting an item to buy on the shop screen.

function Window_PDChooseHeroList() {
    this.initialize.apply(this, arguments);
}

Window_PDChooseHeroList.prototype = Object.create(Window_Selectable.prototype);
Window_PDChooseHeroList.prototype.constructor = Window_PDChooseHeroList;

Window_PDChooseHeroList.prototype.initialize = function(x, y, height) {
    var width = this.windowWidth();
    this.preloadImages();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.setBackgroundType(2);
    this.refresh();
    this.select(0);
};

Window_PDChooseHeroList.prototype.update=function(){
    Window_Selectable.prototype.update.call(this);
}

Window_PDChooseHeroList.prototype.preloadImages=function(){
    var availableClasses=$dataClasses.slice(1);
    availableClasses.forEach(function(ea){
        this["_class"+ea.id]=ImageManager.loadTitle2("SD_class"+ea.id);
        this["_class"+ea.id+"_act"]=ImageManager.loadTitle2("SD_class"+ea.id+"_act");
        this["_class"+ea.id+"_dis"]=ImageManager.loadTitle2("SD_class"+ea.id+"_dis");
        this["_class"+ea.id+"_dis_act"]=ImageManager.loadTitle2("SD_class"+ea.id+"_dis_act");
    }, this);
}

Window_PDChooseHeroList.prototype.windowWidth = function() {
    return 456;
};

Window_PDChooseHeroList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_PDChooseHeroList.prototype.maxCols = function() {
    return this._data!=undefined?this._data.length>5?(this._data.length % 2 > 0 ? 3 : 2):(this._data.length % 2 > 0 ? 1 : 2):2;
};


Window_PDChooseHeroList.prototype.itemHeight = function() {
    return this.itemWidth();
};


Window_PDChooseHeroList.prototype.item = function() {
    return this._data[this.index()];
};

Window_PDChooseHeroList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};

Window_PDChooseHeroList.prototype.isEnabled = function(classId) {
    return DataManager.PDGlobalInfo.unlockedClasses.indexOf(classId)>-1;
};

Window_PDChooseHeroList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};

Window_PDChooseHeroList.prototype.makeItemList = function() {
    this._data = [];

    var availableClasses=$dataClasses.slice(1);

    availableClasses.forEach(function(cls) {
        var item = null;
        if(cls.id!=null){
            item=cls.id;
        }
        if (item) {
            this._data.push(item);
            //this._price.push(goods[2] === 0 ? item.price : goods[3]);
        }
    }, this);
};
Window_PDChooseHeroList.prototype.getItemName = function(index) {
    var classInfo=$dataClasses[this._data[index]];
    return classInfo.name;
}

Window_PDChooseHeroList.prototype.updateHelp = function() {
    var classId=this.item();
    this._helpWindow.clear();
    this._helpWindow.setHero(classId);
}

Window_PDChooseHeroList.prototype.drawItem = function(index) {
    var item = this._data[index];
    var rect = this.itemRect(index);
    //rect.width -= this.textPadding();
   
    
    var enabled=this.isEnabled(item);
    var active=this.item()==item;
    this.changePaintOpacity(active);
    var bitmap=active?(enabled?this["_class"+item+"_act"]:this["_class"+item+"_dis_act"]):(enabled?this["_class"+item]:this["_class"+item+"_dis"]);
    this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x+8, rect.y-10, rect.width-16, rect.height-16);
    this.changePaintOpacity(active && enabled);
    this.drawText(this.getItemName(index), rect.x , rect.y+rect.height-this.lineHeight(), rect.width, "center");
    this.changePaintOpacity(true);
};
Window_PDChooseHeroList.prototype.updateCursor = function() {
    this.contents.clear();
    this.drawAllItems();
    this.setCursorRect(0, 0, 0, 0);
    
};

//-----------------------------------------------------------------------------
// Window_PDChooseHeroHelp
//
// The window for displaying the description of the selected item.

function Window_PDChooseHeroHelp() {
    this.initialize.apply(this, arguments);
}

Window_PDChooseHeroHelp.prototype = Object.create(Window_Base.prototype);
Window_PDChooseHeroHelp.prototype.constructor = Window_PDChooseHeroHelp;

Window_PDChooseHeroHelp.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';
    this.setBackgroundType(2);
    this.updatePlacement();
};

Window_PDChooseHeroHelp.prototype.setText = function(text) {
   // if (this._text !== text) {
        this._text = text;
        this.refresh();
        if(text==null || text.length==0){
            if(this.isOpen() || this.isOpening()){
                this.close();
            }
        }else{
            if(!this.isOpen() || this.isClosing()){
                this.open();
            }
        }
   // }
};

Window_PDChooseHeroHelp.prototype.clear = function() {
    this.setText([]);
};

Window_PDChooseHeroHelp.prototype.setHero = function(heroId) {
    this.setText(this.getUnlockText(heroId));
};
Window_PDChooseHeroHelp.prototype.getUnlockText = function(heroId) {
    if(DataManager.PDGlobalInfo.unlockedClasses.indexOf(heroId)==-1){
        return ["To unlock this character class,", "slay the 3rd boss with any other class"];
    }else{
        return [];
    }
}
Window_PDChooseHeroHelp.prototype.refresh = function() {
    this.contents.clear();
    for (var textIndex = 0; textIndex < this._text.length; textIndex++) {
        var txt = this._text[textIndex];
        this.changeTextColor(this.textColor(6));
        this.contents.drawText(txt, 0, 50*textIndex, this.width, 48, 'center');
    }
    
    //this.drawTextEx(this._text, this.textPadding(), 0);
};
Window_PDChooseHeroHelp.prototype.update=function(){
    Window_Base.prototype.update.call(this);
    //if(!this.isClosing() && !this.isOpening()){
        this.updatePlacement();
    //}
}
Window_PDChooseHeroHelp.prototype.updatePlacement = function() {
    this.height=this.windowHeight();
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height);
    this.refresh();
};
Window_PDChooseHeroHelp.prototype.windowHeight=function(){
    return 130;
}
// Window_PDChooseHeroList.prototype.setStatusWindow = function(statusWindow) {
//     this._statusWindow = statusWindow;
//     this.callUpdateHelp();
// };

// Window_PDChooseHeroList.prototype.updateHelp = function() {
//     this.setHelpWindowItem(this.item());
//     if (this._statusWindow) {
//         this._statusWindow.setItem(this.item());
//     }
// };