//=============================================================================
// Window_SDCredits.js
//=============================================================================
/*:
 * @plugindesc The Credits screen.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

function Scene_Credits() {
    this.initialize.apply(this, arguments);
}

Scene_Credits.prototype = Object.create(Scene_Base.prototype);
Scene_Credits.prototype.constructor = Scene_Credits;

Scene_Credits.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Credits.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackgroundA();
    this.createBackgroundB();
    this.createIcon();
    this.createTextSprite();
};

Scene_Credits.prototype.createBackgroundA=function(){
    this._bgA=new TilingSprite();
    this._bgA.move(0,0,Graphics.width, Graphics.height);
    this._bgA.bitmap=ImageManager.loadTitle2("SD_bgA");
    this.addChild(this._bgA);
}
Scene_Credits.prototype.createBackgroundB=function(){
    this._bgB=new TilingSprite();
    this._bgB.move(0,0,Graphics.width, Graphics.height);
    this._bgB.bitmap=ImageManager.loadTitle2("SD_bgB");
    this.addChild(this._bgB);
}
Scene_Credits.prototype.createIcon=function(){
    this._iconBg=new Sprite();
    this._iconBg.bitmap=ImageManager.loadTitle2("SD_creditsIconBg");
    this.addChild(this._iconBg);
    this._iconA=new Sprite();
    this._iconA.bitmap=ImageManager.loadTitle2("SD_creditsIconA");
    this.addChild(this._iconA);
}
Scene_Credits.prototype.createTextSprite=function(){
    this._creditsText = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._creditsText);
    this._creditsText.bitmap.outlineColor = 'black';
    this._creditsText.bitmap.outlineWidth = 8;
    this._creditsText.bitmap.fontSize = 30;
    

    var texts=["This starter pack is based on Pixel Dungeon by Watabou.",
    "Ported to RPGMaker MV by Alex",
    "",
    "Graphics: Watabou",
    "Music: Cube_Code",
    "FOW base code: CityShrimp",
    "Field of view: Dominik Marczuk",
    "Pathfinding: Xueqiao Xu"];
    for (var textIndex = 0; textIndex < texts.length; textIndex++) {
        var txt = texts[textIndex];
        if(txt!=null && typeof txt === 'object'){
            this._creditsText.bitmap.drawText(txt.text, Graphics.boxWidth/2-((Graphics.boxWidth-100)/2), 120+this._iconA.bitmap.height + (50*(textIndex+1)), Graphics.boxWidth-100, 48, 'left');
        }else if(txt!=null){
            this._creditsText.bitmap.drawText(txt, Graphics.boxWidth/2-((Graphics.boxWidth-100)/2), 120+this._iconA.bitmap.height + (50*(textIndex+1)), Graphics.boxWidth-100, 48, 'left');
        }
    }
}
Scene_Credits.prototype.scrollBackgroundA=function(){
    this._bgA.origin.y+=0.5;
}

Scene_Credits.prototype.scrollBackgroundB=function(){
    this._bgB.origin.y+=1;
}

Scene_Credits.prototype.animateIconBg=function(){
    this._iconBg.rotation += 0.01;
}

Scene_Credits.prototype.update = function() {
    if (this.isActive() && !this.isBusy() && this.isTriggered()) {
        this.gotoTitle();
    }
    Scene_Base.prototype.update.call(this);
    this.scrollBackgroundA();
    this.scrollBackgroundB();
    this.animateIconBg();
    
};

Scene_Credits.prototype.start = function() {
    Scene_Base.prototype.start.call(this);

    this._iconBg.y=120-this._iconBg.bitmap.height/2;
    this._iconA.y=120-this._iconA.bitmap.height/2;
    this._iconBg.x=Graphics.width/2-this._iconBg.bitmap.width/2;
    this._iconA.x=Graphics.width/2-this._iconA.bitmap.width/2;

    this._iconBg.opacity=60;

    //This is required for the rotation to work as expected.
    this._iconBg.anchor.set(0.5,0.5);
    this._iconBg.x += this._iconBg.width*0.5;
    this._iconBg.y += this._iconBg.height*0.5;

    this.startFadeIn(this.slowFadeSpeed(), false);
};

Scene_Credits.prototype.isTriggered = function() {
    return Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered();
};

Scene_Credits.prototype.gotoTitle = function() {
    SceneManager.goto(Scene_Title);
};