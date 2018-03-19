//=============================================================================
// Window_SDBadges.js
//=============================================================================
/*:
 * @plugindesc The Badges screen.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

function Scene_Badges() {
    this.initialize.apply(this, arguments);
}

Scene_Badges.prototype = Object.create(Scene_Base.prototype);
Scene_Badges.prototype.constructor = Scene_Badges;

Scene_Badges.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Badges.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackgroundA();
    this.createBackgroundB();
};

Scene_Badges.prototype.createBackgroundA=function(){
    this._bgA=new TilingSprite();
    this._bgA.move(0,0,Graphics.width, Graphics.height);
    this._bgA.bitmap=ImageManager.loadTitle2("SD_bgA");
    this.addChild(this._bgA);
}
Scene_Badges.prototype.createBackgroundB=function(){
    this._bgB=new TilingSprite();
    this._bgB.move(0,0,Graphics.width, Graphics.height);
    this._bgB.bitmap=ImageManager.loadTitle2("SD_bgB");
    this.addChild(this._bgB);
}
Scene_Badges.prototype.scrollBackgroundA=function(){
    this._bgA.origin.y+=0.5;
}

Scene_Badges.prototype.scrollBackgroundB=function(){
    this._bgB.origin.y+=1;
}

Scene_Badges.prototype.update = function() {
    if (this.isActive() && !this.isBusy() && this.isTriggered()) {
        this.gotoTitle();
    }
    Scene_Base.prototype.update.call(this);
    this.scrollBackgroundA();
    this.scrollBackgroundB();
};

Scene_Badges.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.startFadeIn(this.slowFadeSpeed(), false);
};

Scene_Badges.prototype.isTriggered = function() {
    return Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered();
};

Scene_Badges.prototype.gotoTitle = function() {
    SceneManager.goto(Scene_Title);
};