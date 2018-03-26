//=============================================================================
// Window_PDUI.js
//=============================================================================
/*:
 * @plugindesc The panels that are shown over the game map while playing.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

function Window_PDUI() {
    this.initialize.apply(this, arguments);
}

Window_PDUI.prototype = Object.create(Window_Base.prototype);
Window_PDUI.prototype.constructor = Window_PDUI;

Window_PDUI.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._statusLeft_bitmap=ImageManager.loadSystem("PD_statusLeft");
    this._statusMiddle_bitmap=ImageManager.loadSystem("PD_statusMiddle");
    this._statusRight_bitmap=ImageManager.loadSystem("PD_statusRight");
    this._actions_bitmap=ImageManager.loadSystem("PD_actionButtons");
    this._actionBar_bitmap=ImageManager.loadSystem("PD_actionBar");
    this.createStatusBar();
    this.createActionButtons();
    this.createActionBar();
    this.setBackgroundType(2);
    this.createButtons();
    this.updatePositions();
};

Window_PDUI.prototype.createStatusBar = function() {
    this._statusLeft=new Sprite();
    this._statusLeft.bitmap=this._statusLeft_bitmap;
    this.addChild(this._statusLeft);
    this._statusMiddle=new TilingSprite();
    this._statusMiddle.bitmap=this._statusMiddle_bitmap;
    this.addChild(this._statusMiddle);
    this._statusRight=new Sprite();
    this._statusRight.bitmap=this._statusRight_bitmap;
    this.addChild(this._statusRight);
    this._statusRight.x=Graphics.boxWidth-this._statusRight_bitmap.width;
};
Window_PDUI.prototype.createActionButtons = function() {
    this._actions=new Sprite();
    this._actions.bitmap=this._actions_bitmap;
    this.addChild(this._actions);
};
Window_PDUI.prototype.createActionBar = function() {
    this._actionBar=new Sprite();
    this._actionBar.bitmap=this._actionBar_bitmap;
    this.addChild(this._actionBar);
};
Window_PDUI.prototype.createButtons = function() {
    SceneManager._scene._PDButtons=[];
    this._btnOptions = new PD_SpriteButton();
    this._btnOptions.setClickHandler(this.buttonOptionsHandler.bind(this));

    this.addChild(this._btnOptions);
    SceneManager._scene._PDButtons.push(this._btnOptions);
};
Window_PDUI.prototype.buttonOptionsHandler=function(){
    SceneManager.push(Scene_PDOptions);
}
Window_PDUI.prototype.start = function() {
    this.updatePositions();
};

Window_PDUI.prototype.updatePositions=function(){
    this._statusRight.x=Graphics.boxWidth-this._statusRight_bitmap.width;
    this._statusMiddle.move(this._statusLeft_bitmap.width,0,Graphics.width-this._statusRight_bitmap.width, this._statusMiddle_bitmap.height);
    this._actions.y=Graphics.boxHeight-this._actions_bitmap.height;
    this._actionBar.y=Graphics.boxHeight-this._actionBar_bitmap.height;
    this._actionBar.x=Graphics.boxWidth-this._actionBar_bitmap.width;
    this._btnOptions.width=36;
    this._btnOptions.height=36;
    this._btnOptions.y=9;
    this._btnOptions.x=Graphics.boxWidth-this._btnOptions.width-7;
}

Window_PDUI.prototype.windowWidth = function() {
    return Graphics.width;
};

Window_PDUI.prototype.windowHeight = function() {
    return Graphics.height;
};

Window_PDUI.prototype.refresh = function() {
    this.contents.clear();
    this.updatePositions();
};


Window_PDUI.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

Window_PDUI.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if(!this.isOpening() && !this.isOpen()){
        this.open();
        this.refresh();
    }
};




PD.Aliases.Scene_Map=PD.Aliases.Scene_Map||{};
PD.Aliases.Scene_Map.createDisplayObjects=Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    PD.Aliases.Scene_Map.createDisplayObjects.call(this);
    this.createSDUI();
};
Scene_Map.prototype.createSDUI= function() {
    this._PDUI=new Window_PDUI();
    this.addChild(this._PDUI);
    this._PDUI.close();
}
