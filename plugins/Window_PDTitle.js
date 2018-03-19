//=============================================================================
// Window_SDTitle.js
//=============================================================================
/*:
 * @plugindesc The Title screen.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

//=============================================================================
// Window_SDTitle.js
//=============================================================================
PD=PD || {};
PD.Aliases=PD.Aliases || {};
PD.Aliases.Scene_Title={};
PD.Aliases.Scene_Title.create=Scene_Title.prototype.create;
Scene_Title.prototype.create=function(){
    PD.Aliases.Scene_Title.create.call(this);
    Scene_Base.prototype.create.call(this);

    this._logoStep=1;
    this._logoCount=0;

    this._lastSelected=-1;

    this.prepareGraphics();

    this.createBackgroundA();
    this.createBackgroundB();
    this.createLogo();
    this.createFireballs();
    //this.createBackground();
    //this.createForeground();
    this.createWindowLayer();
    this.createCommandWindow();

    this.createCommandButtons();

}
// Scene_Title.prototype.createPDButton=function(){
//     this._PDButton=new PD_Button("Holaaa");
//     this._PDButton.x=Graphics.width/2-this._PDButton.width/2;
//     this._PDButton.y=Graphics.height/2-92;
//     this.addChild(this._PDButton);
// }
Scene_Title.prototype.prepareGraphics = function() {
    this._btnPlayBitmap=ImageManager.loadTitle2("SD_btnPlay");
    this._btnStatsBitmap=ImageManager.loadTitle2("SD_btnStats");
    this._btnBadgesBitmap=ImageManager.loadTitle2("SD_btnBadges");
    this._btnCreditsBitmap=ImageManager.loadTitle2("SD_btnCredits");
    this._btnOptionsBitmap=ImageManager.loadTitle2("SD_btnOptions");
    this._btnExitBitmap=ImageManager.loadTitle2("SD_btnExit");

    this._btnPlayDisabledBitmap=ImageManager.loadTitle2("SD_btnPlay_dis");
    this._btnStatsDisabledBitmap=ImageManager.loadTitle2("SD_btnStats_dis");
    this._btnBadgesDisabledBitmap=ImageManager.loadTitle2("SD_btnBadges_dis");
    this._btnCreditsDisabledBitmap=ImageManager.loadTitle2("SD_btnCredits_dis");
    this._btnOptionsDisabledBitmap=ImageManager.loadTitle2("SD_btnOptions_dis");
    this._btnExitDisabledBitmap=ImageManager.loadTitle2("SD_btnExit_dis");

    this._btnPlayActiveBitmap=ImageManager.loadTitle2("SD_btnPlay_act");
    this._btnStatsActiveBitmap=ImageManager.loadTitle2("SD_btnStats_act");
    this._btnBadgesActiveBitmap=ImageManager.loadTitle2("SD_btnBadges_act");
    this._btnCreditsActiveBitmap=ImageManager.loadTitle2("SD_btnCredits_act");
    this._btnOptionsActiveBitmap=ImageManager.loadTitle2("SD_btnOptions_act");
    this._btnExitActiveBitmap=ImageManager.loadTitle2("SD_btnExit_act");

    this._btnPlayDisabledActiveBitmap=ImageManager.loadTitle2("SD_btnPlay_dis_act");
    this._btnStatsDisabledActiveBitmap=ImageManager.loadTitle2("SD_btnStats_dis_act");
    this._btnBadgesDisabledActiveBitmap=ImageManager.loadTitle2("SD_btnBadges_dis_act");
    this._btnCreditsDisabledActiveBitmap=ImageManager.loadTitle2("SD_btnCredits_dis_act");
    this._btnOptionsDisabledActiveBitmap=ImageManager.loadTitle2("SD_btnOptions_dis_act");
    this._btnExitDisabledActiveBitmap=ImageManager.loadTitle2("SD_btnExit_dis_act");

    this._fireballBaseBitmap=ImageManager.loadTitle2("SD_fireballBase");
    this._fireballBase2Bitmap=ImageManager.loadTitle2("SD_fireballBase2");
    this._fireballFlameBitmap=ImageManager.loadTitle2("SD_fireballFlame");
    this._fireballFlame2Bitmap=ImageManager.loadTitle2("SD_fireballFlame2");
}

PD.Aliases.Scene_Title.start=Scene_Title.prototype.start;
Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();

    this._logo.y=this._logoDetail.y=48;
    this._logo.x=this._logoDetail.x=Graphics.width/2-this._logo.bitmap.width/2;

    this._fireballBaseL.x=this._logo.x;
    this._fireballBaseL.y=this._logo.y;

    this._fireballOverL.x=this._fireballBaseL.x;
    this._fireballOverL.y=this._fireballBaseL.y;
    
    this._fireballBaseR.x=this._logo.x+this._logo.width-this._fireballBaseR.width;
    this._fireballBaseR.y=this._logo.y;

    this._fireballOverR.x=this._fireballBaseR.x;
    this._fireballOverR.y=this._fireballBaseR.y;
    
    this._fireballBase2L.x=this._fireballBaseL.x;
    this._fireballBase2L.y=this._fireballBaseL.y;

    this._fireballBase2R.x=this._fireballBaseR.x;
    this._fireballBase2R.y=this._fireballBaseR.y;


    //This is required for the rotation to work as expected.
    this._fireballBaseL.anchor.set(0.5,0.5);
    this._fireballBaseL.x += this._fireballBaseL.width*0.5;
    this._fireballBaseL.y += this._fireballBaseL.height*0.5;
     //This is required for the rotation to work as expected.
     this._fireballBaseR.anchor.set(0.5,0.5);
     this._fireballBaseR.x += this._fireballBaseR.width*0.5;
     this._fireballBaseR.y += this._fireballBaseR.height*0.5;

     //This is required for the rotation to work as expected.
    this._fireballBase2L.anchor.set(0.5,0.5);
    this._fireballBase2L.x += this._fireballBase2L.width*0.5;
    this._fireballBase2L.y += this._fireballBase2L.height*0.5;
    //This is required for the rotation to work as expected.
    this._fireballBase2R.anchor.set(0.5,0.5);
    this._fireballBase2R.x += this._fireballBase2R.width*0.5;
    this._fireballBase2R.y += this._fireballBase2R.height*0.5;
    
    //This is required for the rotation to work as expected.
    this._fireballOverL.anchor.set(0.5,0.5);
    this._fireballOverL.x += this._fireballOverL.width*0.5;
    this._fireballOverL.y += this._fireballOverL.height*0.5;
     //This is required for the rotation to work as expected.
    this._fireballOverR.anchor.set(0.5,0.5);
    this._fireballOverR.x += this._fireballOverR.width*0.5;
    this._fireballOverR.y += this._fireballOverR.height*0.5;
    
    

    this._btnNewGameText = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._btnNewGameText);
    this.drawButtonText(this._btnNewGame, this._btnNewGameText, "Play");
    this._btnStatsText = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._btnStatsText);
    this.drawButtonText(this._btnStats, this._btnStatsText, "Rankings");
    this._btnBadgesText = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._btnBadgesText);
    this.drawButtonText(this._btnBadges, this._btnBadgesText, "Badges");
    this._btnCreditsText = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._btnCreditsText);
    this.drawButtonText(this._btnCredits, this._btnCreditsText, "About");

    this._commandWindow.activate();

    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
};

PD.Aliases.Scene_Title.update=Scene_Title.prototype.update;
Scene_Title.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);
    this.scrollBackgroundA();
    this.scrollBackgroundB();
    this.updateFireballs();
    this.animateLogo();
    this.setupActiveButtons();
};
Scene_Title.prototype.createBackgroundA=function(){
    this._bgA=new TilingSprite();
    this._bgA.move(0,0,Graphics.width, Graphics.height);
    this._bgA.bitmap=ImageManager.loadTitle2("SD_bgA");
    this.addChild(this._bgA);
}
Scene_Title.prototype.createBackgroundB=function(){
    this._bgB=new TilingSprite();
    this._bgB.move(0,0,Graphics.width, Graphics.height);
    this._bgB.bitmap=ImageManager.loadTitle2("SD_bgB");
    this.addChild(this._bgB);
}
Scene_Title.prototype.createLogo=function(){
    this._logo=new Sprite();
    this._logo.bitmap=ImageManager.loadTitle2("SD_logo");
    this.addChild(this._logo);
    this._logoDetail=new Sprite();
    this._logoDetail.bitmap=ImageManager.loadTitle2("SD_logoDetail");
    this.addChild(this._logoDetail);
}

Scene_Title.prototype.createFireballs=function(){
    this._fireballBaseL=new Sprite();
    this._fireballBaseL.bitmap=this._fireballBaseBitmap;
    this._fireballOverL=new Sprite();
    this._fireballOverL.bitmap=this._fireballBaseBitmap;

    this._fireballBase2L=new Sprite();
    this._fireballBase2L.bitmap=this._fireballBase2Bitmap;

    this._fireballBaseR=new Sprite();
    this._fireballBaseR.bitmap=this._fireballBaseBitmap;
    this._fireballOverR=new Sprite();
    this._fireballOverR.bitmap=this._fireballBaseBitmap;

    this._fireballBase2R=new Sprite();
    this._fireballBase2R.bitmap=this._fireballBase2Bitmap;
    
    this.addChild(this._fireballBaseL);
    this.addChild(this._fireballBaseR);
    this.addChild(this._fireballBase2L);
    this.addChild(this._fireballBase2R);
    this.addChild(this._fireballOverL);
    this.addChild(this._fireballOverR);
    
    
}

Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.x=Graphics.boxWidth;
    this._commandWindow.y=Graphics.boxHeight;
    //this._commandWindow.setHandler('play',  this.commandNewGame.bind(this));
    this._commandWindow.setHandler('play',  this.commandPlay.bind(this));
    //this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    this._commandWindow.setHandler('stats',  this.commandStats.bind(this));
    this._commandWindow.setHandler('badges',  this.commandBadges.bind(this));
    this._commandWindow.setHandler('exit',  this.commandExit.bind(this));
    this._commandWindow.setHandler('credits',  this.commandCredits.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Title.prototype.drawButtonText=function(under, layer, text){
    var x = under.x;
    var y = under.y + under.bitmap.height;
    var maxWidth = under.bitmap.width;
    layer.bitmap.outlineColor = 'black';
    layer.bitmap.outlineWidth = 8;
    layer.bitmap.fontSize = 30;
    layer.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
}
Scene_Title.prototype.commandPlay = function() {
    if(this._commandWindow._index===2){
        this._commandWindow.close();
        SceneManager.push(Scene_ChooseHero);
        // DataManager.setupNewGame();
        // this._commandWindow.close();
        // this.fadeOutAll();
        // SceneManager.goto(Scene_Map);
    }else{
        this._commandWindow.select(2);
    }
};

Scene_Title.prototype.commandContinue = function() {
    if(this._commandWindow._index===3){
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    }else{
        this._commandWindow.select(3);
    }
};

Scene_Title.prototype.commandOptions = function() {
    if(this._commandWindow._index===0){
        this._commandWindow.close();
        SceneManager.push(Scene_PDOptions);
    }else{
        this._commandWindow.select(0);
    }
};
Scene_Title.prototype.commandBadges = function() {
    if(this._commandWindow._index===4){
        this._commandWindow.close();
        SceneManager.push(Scene_Badges);
    }else{
        this._commandWindow.select(4);
    }
};
Scene_Title.prototype.commandStats = function() {
    if(this._commandWindow._index===3){
        this._commandWindow.close();
        SceneManager.push(Scene_Options);
    }else{
        this._commandWindow.select(3);
    }
};
Scene_Title.prototype.commandCredits = function() {
    if(this._commandWindow._index===5){
        this._commandWindow.close();
        SceneManager.push(Scene_Credits);
    }else{
        this._commandWindow.select(5);
    }
};
Scene_Title.prototype.commandExit = function() {
    if(this._commandWindow._index===1){
        this._commandWindow.close();
        SceneManager.exit();
    }else{
        this._commandWindow.select(1);
    }
};
Scene_Title.prototype.createCommandButtons = function() {

    this._btnOptions = new Sprite_Button();
    this._btnOptions.bitmap=this._btnOptionsBitmap;
    this._btnOptions.y=0;
    this._btnOptions.x=0;
    this._btnOptions.setClickHandler(this.buttonClickHandler.bind(this, 0));
    this.addChild(this._btnOptions);

    this._btnExit = new Sprite_Button();
    this._btnExit.bitmap=this._btnExitBitmap;
    this._btnExit.y=0;
    this._btnExit.x=Graphics.width-40;
    this._btnExit.setClickHandler(this.buttonClickHandler.bind(this, 1));
    this.addChild(this._btnExit);

    this._btnNewGame = new Sprite_Button();
    this._btnNewGame.bitmap=this._btnPlayBitmap;
    this._btnNewGame.y=Graphics.height/2;
    this._btnNewGame.x=Graphics.width/2 - 48 -92;
    this._btnNewGame.setClickHandler(this.buttonClickHandler.bind(this, 2));
    this.addChild(this._btnNewGame);
    this._btnStats = new Sprite_Button();
    this._btnStats.bitmap=this._btnStatsBitmap;
    this._btnStats.y=this._btnNewGame.y;
    this._btnStats.x=Graphics.width/2 + 92 - 48;
    this._btnStats.setClickHandler(this.buttonClickHandler.bind(this, 3));
    this.addChild(this._btnStats);
    this._btnBadges = new Sprite_Button();
    this._btnBadges.bitmap=this._btnBadgesBitmap;
    this._btnBadges.y=this._btnNewGame.y + 92 + 48 ;
    this._btnBadges.x=this._btnNewGame.x;
    this._btnBadges.setClickHandler(this.buttonClickHandler.bind(this, 4));
    this.addChild(this._btnBadges);
    this._btnCredits = new Sprite_Button();
    this._btnCredits.bitmap=this._btnCreditsBitmap;
    this._btnCredits.y=this._btnStats.y + 92 + 48 ;
    this._btnCredits.x=this._btnStats.x;
    this._btnCredits.setClickHandler(this.buttonClickHandler.bind(this, 5));
    this.addChild(this._btnCredits);
};
Scene_Title.prototype.buttonClickHandler=function(index){
    if(this._commandWindow._index===index){
        this._commandWindow.processOk();
       // SoundManager.playOk();
    }else{
        this._commandWindow.select(index);
        SoundManager.playCursor();
    }
}
Scene_Title.prototype.setupActiveButtons=function(){
    if(this._lastSelected==this._commandWindow._index)
        return;
    this._btnOptions.bitmap=this._btnOptionsBitmap;
    this._btnExit.bitmap=this._btnExitBitmap;
    this._btnNewGame.bitmap=this._btnPlayBitmap;
    this._btnStats.bitmap=this._btnStatsBitmap;
    this._btnBadges.bitmap=this._btnBadgesBitmap;
    this._btnCredits.bitmap=this._btnCreditsBitmap;
    if(this._commandWindow._index===0){
        this._btnOptions.bitmap=this._btnOptionsActiveBitmap;
    }else if(this._commandWindow._index===1){
        this._btnExit.bitmap=this._btnExitActiveBitmap;
    }else if(this._commandWindow._index===2){
        this._btnNewGame.bitmap=this._btnPlayActiveBitmap;
    }else if(this._commandWindow._index===3){
        this._btnStats.bitmap=this._btnStatsActiveBitmap;
    }else if(this._commandWindow._index===4){
        //if(DataManager.isAnySavefileExists()){
        this._btnBadges.bitmap=this._btnBadgesActiveBitmap;
    }else if(this._commandWindow._index===5){
        this._btnCredits.bitmap=this._btnCreditsActiveBitmap;
    }
    this._lastSelected=this._commandWindow._index;
}
Scene_Title.prototype.scrollBackgroundA=function(){
    this._bgA.origin.y+=0.5;
}
Scene_Title.prototype.scrollBackgroundB=function(){
    this._bgB.origin.y+=1;
}

Scene_Title.prototype.updateFireballs=function(){
    
    this._fireballBaseL.rotation += 0.1;
    this._fireballBaseR.rotation += 0.1;
    this._fireballBase2L.rotation -= 0.1;
    this._fireballBase2R.rotation -= 0.1;
    this._fireballOverL.rotation -= 0.1;
    this._fireballOverR.rotation -= 0.1;
}

Scene_Title.prototype.animateLogo=function(){
    if(this._logoCount>0){
        this._logoCount=this._logoCount-1;
    }else{
        if(this._logoDetail.opacity>=255){
            this._logoStep=-1;
            this._logoCount=100;
        }else if(this._logoDetail.opacity<=0){
            this._logoStep=1;
            this._logoCount=100;
        }
        this._logoDetail.opacity=this._logoDetail.opacity+this._logoStep;
        if(this._logoCount>0){
            this._logoCount=this._logoCount-1;
        }
    }
}


Scene_Title.prototype.isBusy = function() {
    return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};



Window_Base.prototype.standardBackOpacity = function() {
    return 255;
};



//-----------------------------------------------------------------------------
// Window_TitleCommand
//
// The window for selecting New Game/Continue on the title screen.

function Window_TitleCommand() {
    this.initialize.apply(this, arguments);
}

Window_TitleCommand.prototype = Object.create(Window_Command.prototype);
Window_TitleCommand.prototype.constructor = Window_TitleCommand;

Window_TitleCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
    this.selectLast();
};

Window_TitleCommand._lastCommandSymbol = null;

Window_TitleCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_TitleCommand.prototype.windowWidth = function() {
    return 240;
};

Window_TitleCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 96;
};

Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.options,   'options');
    this.addCommand("Exit",   'exit');
    this.addCommand(TextManager.newGame, 'play');
    this.addCommand("Rankings", 'stats');
    this.addCommand("Badges", 'badges');
    this.addCommand("Credits", 'credits');
   // this.addCommand(TextManager.newGame,   'newGame');
   // this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
   // this.addCommand(TextManager.options,   'options');
};

Window_TitleCommand.prototype.isContinueEnabled = function() {
    return DataManager.isAnySavefileExists();
};

Window_TitleCommand.prototype.processOk = function() {
    Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_TitleCommand.prototype.selectLast = function() {
    if (Window_TitleCommand._lastCommandSymbol) {
        this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
    } else{
        this.selectSymbol('play');
    }//else if (this.isContinueEnabled()) {
    //    this.selectSymbol('continue');
   // }
};

Window_TitleCommand.prototype.maxCols = function() {
    return 2;
};





