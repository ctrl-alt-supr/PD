//=============================================================================
// SD_UI.js
//=============================================================================
/*:
 * @plugindesc C6 - Templates for some commonly used user interface elements.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */


DataManager.PDUI=[];
DataManager.PDUI.button=ImageManager.loadSystem("PD_UI_btn");
DataManager.PDUI.button_act=ImageManager.loadSystem("PD_UI_btn_act");
DataManager.PDUI.button_dis=ImageManager.loadSystem("PD_UI_btn_dis");
DataManager.PDUI.button_dis_act=ImageManager.loadSystem("PD_UI_btn_dis_act");
DataManager.PDUI.buttonToggle_on=ImageManager.loadSystem("PD_UI_btnToggle_on");
DataManager.PDUI.buttonToggle_off=ImageManager.loadSystem("PD_UI_btnToggle_off");
DataManager.PDUI.buttonToggle_on_dis=ImageManager.loadSystem("PD_UI_btnToggle_on_dis");
DataManager.PDUI.buttonToggle_off_dis=ImageManager.loadSystem("PD_UI_btnToggle_off_dis");

//-----------------------------------------------------------------------------
// Window_PDButtonCommand
//
// The window for selecting New Game/Continue on the title screen.

function Window_PDButtonCommand() {
    this.initialize.apply(this, arguments);
}

Window_PDButtonCommand.prototype = Object.create(Window_Command.prototype);
Window_PDButtonCommand.prototype.constructor = Window_PDButtonCommand;

Window_PDButtonCommand.prototype.initialize = function(commands, columns) {    // {name, symbol, enabled, isToggle}[]
    if(commands==undefined || commands==null){
        commands=[];
    }
    this._cmds=commands;
    this._requestedCols=(columns!=undefined && columns!=null)?columns:1;
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
    this.selectLast();
};

Window_PDButtonCommand._lastCommandSymbol = null;

Window_PDButtonCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_PDButtonCommand.prototype.windowWidth = function() {
    return 300;
};
Window_PDButtonCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 96;
    
};

Window_PDButtonCommand.prototype.makeCommandList = function() {
    this._cmds.forEach(function(each){
        var en=((each.enabled!=undefined && each.enabled!=null)?each.enabled:true);
        var tog=((each.isToggle!=undefined && each.isToggle!=null)?each.isToggle:false)
        this.addCommand(each.name ,each.symbol,en,tog);
    },this);
};


Window_PDButtonCommand.prototype.isContinueEnabled = function() {
    return DataManager.isAnySavefileExists();
};

Window_PDButtonCommand.prototype.processOk = function() {
    Window_PDButtonCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_PDButtonCommand.prototype.selectLast = function() {
    if (Window_PDButtonCommand._lastCommandSymbol) {
        this.selectSymbol(Window_PDButtonCommand._lastCommandSymbol);
    } else if (this.isContinueEnabled()) {
        this.selectSymbol('continue');
    }
};
Window_PDButtonCommand.prototype.updateCursor = function() {
    this.contents.clear();
    this.drawAllItems();
    this.setCursorRect(0, 0, 0, 0);
};
Window_PDButtonCommand.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(true);
    var active=this.currentSymbol()==this.commandSymbol(index);
    var enabled=this.isCommandEnabled(index);
    var bitmap = active?(enabled?(DataManager.PDUI.button_act):(DataManager.PDUI.button_dis_act)):(enabled?(DataManager.PDUI.button):(DataManager.PDUI.button_dis));
    this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x, rect.y, rect.width, rect.height);
    if(this.isCommandToggle(index)){
        var checked=this.isCommandToggleChecked(index);
        var chckBtmp=enabled?(checked?DataManager.PDUI.buttonToggle_on:DataManager.PDUI.buttonToggle_off):(checked?DataManager.PDUI.buttonToggle_on_dis:DataManager.PDUI.buttonToggle_off_dis);
        this.contents.blt(chckBtmp, 0, 0, chckBtmp.width, chckBtmp.height, rect.x+rect.width-Math.min(chckBtmp.height, chckBtmp.width, rect.height), rect.y, Math.min(chckBtmp.height, chckBtmp.width, rect.height), Math.min(chckBtmp.height, chckBtmp.width, rect.height));
    }
    this.outlineColor = 'black';
    this.outlineWidth = 8;
    this.fontSize = 16;
    this.changePaintOpacity(enabled);
    this.drawText(this.commandName(index), rect.x+10, rect.y, rect.width-55, align);
};

Window_PDButtonCommand.prototype.isCommandToggle = function(index) {
    return this._list[index].ext;
};
Window_PDButtonCommand.prototype.isCommandToggleChecked = function(index) {
    return this._list[index].ext && this._list[index].checked;
};
Window_PDButtonCommand.prototype.setCommandToggleChecked = function(index, newState) {
   this._list[index].checked=newState;
};

Window_PDButtonCommand.prototype.maxCols = function() {
    return Math.min(this._requestedCols, this._cmds.length);
};


//-----------------------------------------------------------------------------
// PD_Button
//
// The sprite for displaying a button.

function PD_Button() {
    this.initialize.apply(this, arguments);
}

PD_Button.prototype = Object.create(Sprite.prototype);
PD_Button.prototype.constructor = PD_Button;

PD_Button.prototype.initialize = function(text, enabled) {
    Sprite.prototype.initialize.call(this);
    this._touching = false;
    this._coldFrame = null;
    this._hotFrame = null;
    this._clickHandler = null;
    this._text=text;
    this._lastText=null;
    this.bitmap=DataManager.PDUI.button;
    this._active=false;
    this._enabled=((enabled!=undefined && enabled!=null)?enabled:true);
    this._lastEnabled=null;
    this._lastActive=null;
    this._textSprite=new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight))
    this.addChild(this._textSprite);
    this.drawButtonText();
};

PD_Button.prototype.setText = function(newText) {
    this._text=newText;
}

PD_Button.prototype.setActive = function(boolActive) {
    this._active=boolActive;
}
PD_Button.prototype.setEnabled = function(boolEnabled) {
    this._enabled=boolEnabled;
}

PD_Button.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateFrame();
    this.processTouch();
    //if(this._lastText!=this._text){
        this.drawButtonText();
    //}
};
PD_Button.prototype.updateBackgroundImage=function(){
    if(this._lastActive!=this._active || this._lastEnabled!=this._enabled){
        if(this._active){
            if(this._enabled){
                this.bitmap=DataManager.PDUI.button_act;
            }else{
                this.bitmap=DataManager.PDUI.button_dis_act;
            }
        }else{
            if(this._enabled){
                this.bitmap=DataManager.PDUI.button;
            }else{
                this.bitmap=DataManager.PDUI.button_dis;
            }
        }
        this._active=this._lastActive;
        this._enabled=this._lastEnabled;
    }
}
PD_Button.prototype.drawButtonText=function(){
    var x = 0;
    var y = 0;
    var maxWidth = this.bitmap.width;
    this._textSprite.bitmap.clear();
    this._textSprite.bitmap.outlineColor = 'black';
    this._textSprite.bitmap.outlineWidth = 8;
    this._textSprite.bitmap.fontSize = 30;
    this._textSprite.bitmap.drawText(this._text, x, y, maxWidth, 48, 'center');
    this._lastText=this._text;
}

PD_Button.prototype.updateFrame = function() {
    var frame;
    if (this._touching) {
        frame = this._hotFrame;
    } else {
        frame = this._coldFrame;
    }
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};

PD_Button.prototype.setColdFrame = function(x, y, width, height) {
    this._coldFrame = new Rectangle(x, y, width, height);
};

PD_Button.prototype.setHotFrame = function(x, y, width, height) {
    this._hotFrame = new Rectangle(x, y, width, height);
};

PD_Button.prototype.setClickHandler = function(method) {
    this._clickHandler = method;
};

PD_Button.prototype.callClickHandler = function() {
    if (this._clickHandler) {
        this._clickHandler();
    }
};

PD_Button.prototype.processTouch = function() {
    if (this.isActive()) {
        if (TouchInput.isTriggered() && this.isButtonTouched()) {
            this._touching = true;
        }
        if (this._touching) {
            if (TouchInput.isReleased() || !this.isButtonTouched()) {
                this._touching = false;
                if (TouchInput.isReleased()) {
                    this.callClickHandler();
                }
            }
        }
    } else {
        this._touching = false;
    }
};

PD_Button.prototype.isActive = function() {
    var node = this;
    while (node) {
        if (!node.visible) {
            return false;
        }
        node = node.parent;
    }
    return true;
};

PD_Button.prototype.isButtonTouched = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

PD_Button.prototype.canvasToLocalX = function(x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};

PD_Button.prototype.canvasToLocalY = function(y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};

//-----------------------------------------------------------------------------
//  PD_SpriteButton
//-----------------------------------------------------------------------------

function PD_SpriteButton() {
    this.initialize.apply(this, arguments);
}

PD_SpriteButton.prototype = Object.create(Sprite_Button.prototype);
PD_SpriteButton.prototype.constructor = PD_SpriteButton;

PD_SpriteButton.prototype.initialize = function() {
    Sprite_Button.prototype.initialize.call(this);
	this._hidden = false;
    //this.setupButton(gameBtn);
    
};

// PD_SpriteButton.prototype.setupButton = function(b) {
// 	this._btn = b;
// 	this.bitmap = ImageManager.loadSystem(b.image);
// 	var h = this.bitmap.height / 2;
// 	var w = this.bitmap.width;
// 	this.setColdFrame(0, 0, w, h);
// 	this.setHotFrame(0, h, w, h);
	
// 	this.x = b.x;
// 	this.y = b.y;
// };

PD_SpriteButton.prototype.processTouch = function() {
    if (this.isActive() && this.opacity >= 255) {
        if (TouchInput.isTriggered() && this.isButtonTouched()) {
            this._touching = true;
			this._wasTouching = true;
		}
        if (this._touching) {
            if (TouchInput.isReleased() || !this.isButtonTouched()) {
                if (this._wasTouching) {
					console.log(this._btn);
                    this.callClickHandler();
                }
				this._touching = false;
				this._wasTouching = false;
            } else {
				// while pressed
				this.callPressHandler();
			}
        } else if (this._wasTouching) {
			// for click holding, moving off of button and releasing issue
			this.callClickHandler();
			this._wasTouching = false;
			this._touching = false;
		}
    } else {
        this._touching = false;
		if (this._wasTouching) {
			this.callClickHandler();
			this._wasTouching = false;
		};
    }
};

PD_SpriteButton.prototype.setPressHandler = function(method) {
    this._pressHandler = method;
};

PD_SpriteButton.prototype.callPressHandler = function() {
    if (this._pressHandler) {
        this._pressHandler();
    }
};

PD_SpriteButton.prototype.update = function() {
	Sprite_Button.prototype.update.call(this);
	//this.updateVisibility();
};

// PD_SpriteButton.prototype.updateVisibility = function() {
// 	if ($gameSystem._hideBtns) {
// 		this.opacity -= Galv.SBTNS.fade;
// 	} else if ($gameMap.isEventRunning()) {
// 		this.opacity = Math.max(this.opacity - 0.1,this._btn.eOpacity);
// 	} else {
// 		this.opacity += 0.1;
// 	}
// };
PD_SpriteButton.onButton = function() {
	var x = TouchInput.x;
	var y = TouchInput.y;
	var btns = SceneManager._scene._PDButtons;
	if (!btns) return false;
	var result = false;
	for (var i = 0; i < btns.length; i++) {
		if (btns[i] && x > btns[i].x && x < btns[i].x + btns[i].width && y > btns[i].y && y < btns[i].y + btns[i].height) {
			result = true;
			break;
		};
	}
	return result;
};
PD=PD||{};
PD.Aliases=PD.Aliases||{};
PD.Aliases.Scene_Base=PD.Aliases.Scene_Base||{};
PD.Aliases.Scene_Base.initialize=Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function() {
	Input.clear();
	this._PDuttons = [];
    PD.Aliases.Scene_Base.initialize.call(this);
}
PD.Aliases.Game_Temp=PD.Aliases.Game_Temp||{};
PD.Aliases.Game_Temp.setDestination=Game_Temp.prototype.setDestination;
Game_Temp.prototype.setDestination = function(x, y) {
	if (!PD.UI.touchInputActiveForCurrentPosition()) return;
    PD.Aliases.Game_Temp.setDestination.call(this,x,y);
};
PD=PD||{};
PD.UI=PD.UI||{};
PD.UI._touchInputInactiveRects=[];
PD.UI._inactiveRectIndex=function(rectToFind){
    var match=-1;
    for (var tiiri = 0; tiiri < PD.UI._touchInputInactiveRects.length; tiiri++) {
        var tiir = PD.UI._touchInputInactiveRects[tiiri];
        if(tiir.x==rectToFind.x && tiir.y==rectToFind.y && tiir.width==rectToFind.width && tiir.height==rectToFind.height){
            match=tiiri;
            return match;
        }
    }
    return match;
}
PD.UI.addInactiveRect=function(rectToMakeInactive){
    if(PD.UI._inactiveRectIndex(rectToMakeInactive)==-1){
        PD.UI._touchInputInactiveRects.push(rectToMakeInactive);
    }
}
PD.UI.removeInactiveRect=function(rectToMakeActive){
    var found=PD.UI._inactiveRectIndex(rectToMakeActive);
    if(found>-1){
        PD.UI._touchInputInactiveRects.splice(found, 1);
    }
}
PD.UI.touchInputActiveForCurrentPosition = function() {
    var x = TouchInput.x;
	var y = TouchInput.y;
	var inactiveRects = PD.UI._touchInputInactiveRects;
	if (!inactiveRects) return false;
	var result = false;
	for (var i = 0; i < inactiveRects.length; i++) {
		if (inactiveRects[i] && x > inactiveRects[i].x && x < inactiveRects[i].x + inactiveRects[i].width && y > inactiveRects[i].y && y < inactiveRects[i].y + inactiveRects[i].height) {
			result = true;
			break;
		};
	}
	return (!PD_SpriteButton.onButton() && !result);
};