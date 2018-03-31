//-----------------------------------------------------------------------------
// Scene_PDInventory
//
// The scene class of the options screen.

function Scene_PDInventory() {
    this.initialize.apply(this, arguments);
}

Scene_PDInventory.prototype = Object.create(Scene_MenuBase.prototype);
Scene_PDInventory.prototype.constructor = Scene_PDInventory;

Scene_PDInventory.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_PDInventory.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createInventory();
};

Scene_PDInventory.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};

Scene_PDInventory.prototype.createInventory= function() {
    this._PDInventory=new Window_PDInventory();
    this._PDInventory.updatePositions();
    this._PDInventoryList=new Window_PDInventoryList(this._PDInventory.x, this._PDInventory.y+40, this._PDInventory.width, this._PDInventory.height-85);
    this.addChild(this._PDInventory);
    this.addChild(this._PDInventoryList);
    this._PDInventoryList.setHandler('cancel', this.popScene.bind(this));
    this._PDInventory.setOnTabChanged(this.onTabChanged.bind(this));
    this._PDInventory.close();
    this._PDInventoryList.close();
    this.updatePositions();
    
}
Scene_PDInventory.prototype.start=function(){
    this.updatePositions();
    this._PDInventory.open();
    this._PDInventory.setTitle("BACKPACK");
    this._PDInventoryList.open();
    this._PDInventoryList.selectFirstItem();
    this._PDInventoryList.activate();
    this._PDInventoryList.refresh();
}

Scene_PDInventory.prototype.updatePositions=function(){
    this._PDInventoryList.width=this._PDInventory.width;
    this._PDInventoryList.height=this._PDInventory.height-65;
    this._PDInventoryList.x=this._PDInventory.x;
    this._PDInventoryList.y=this._PDInventory.y+30;
}

Scene_PDInventory.prototype.onTabChanged=function(oldTabId, oldType, newTabId, newType){
    if(newType==0){
        this._PDInventory.setTitle("BACKPACK");
    }else if(newType==1){
        this._PDInventory.setTitle("KEY RING");
    }else if(newType==2){
        this._PDInventory.setTitle("SEED POUCH");
    }else if(newType==3){
        this._PDInventory.setTitle("SCROLL HOLDER");
    }else if(newType==4){
        this._PDInventory.setTitle("WAND HOLDSTER");
    }
    this._PDInventoryList.deactivate();
    this._PDInventoryList.close();
    this._PDInventoryList.setMode(newType);
    //console.log("Changed tab!! oldTabId: "+oldTabId+"  oldType: "+oldType+"  newTabId: "+newTabId+"  newType: "+newType);
    this._PDInventoryList.open();
    this._PDInventoryList.selectFirstItem();
    this._PDInventoryList.activate();
    this._PDInventoryList.refresh();
}


//=============================================================================
// Window_PDInventory.js
//=============================================================================
/*:
 * @plugindesc The panels that are shown over the game map while playing.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

function Window_PDInventory() {
    this.initialize.apply(this, arguments);
}

Window_PDInventory.prototype = Object.create(Window_Base.prototype);
Window_PDInventory.prototype.constructor = Window_PDInventory;




Window_PDInventory.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.preloadImages();
    this.createTabs();
    this.createBgTop();
    this.createTitle("BACKPACK");
    this.setBackgroundType(2);
    this.updatePositions();
    this._currentTab=0;
    this._lastTab=-1;
    this._lastHasKeyRing=null;
    this._lastHasSeedPouch=null;
    this._lastHasScrollHolder=null;
    this._lastHasWandHolster=null;
    this._hasKeyRing=false;
    this._hasSeedPouch=false;
    this._hasScrollHolder=false;
    this._hasWandHolster=false;
    this._tabCount=0;
    this._onTabChanged=null;
};
Window_PDInventory.prototype.tabClickHandler=function(tabId){
    return function(){
        this.setTab(tabId);
        SoundManager.playCursor();
    }
}
Window_PDInventory.prototype.setOnTabChanged=function(newFunc){
    this._onTabChanged=newFunc;
}
Window_PDInventory.prototype.tab2Type=function(tabId){
    var tabsInUse=[null];
    if(this._hasKeyRing){
        tabsInUse.push(PD.Item.BagType.KEYRING);
    }
    if(this._hasSeedPouch){
        tabsInUse.push(PD.Item.BagType.SEEDPOUCH);
    }
    if(this._hasScrollHolder){
        tabsInUse.push(PD.Item.BagType.SCROLLHOLDER);
    }
    if(this._hasWandHolster){
        tabsInUse.push(PD.Item.BagType.WANDHOLSTER);
    }
    if(tabId==0){
        return PD.Item.BagType.BACKPACK;
    }else if(tabId<=4){
        if(tabId<tabsInUse.length){
            return tabsInUse[tabId];
        }
    }
    return null;
}

Window_PDInventory.InventoryBagType2Icon=function(bt){
    if(bt==0) return "PD_InventoryTab0_icon";
    if(bt==1) return "PD_InventoryTab1_icon";
    if(bt==2) return "PD_InventoryTab2_icon";
    if(bt==3) return "PD_InventoryTab3_icon";
    if(bt==4) return "PD_InventoryTab4_icon";
    return null;
}
Window_PDInventory.prototype.InventoryBagType2IconBitmap=function(bt){
    if(bt==0) return this["_BACKPACK_icon_bitmap"];
    if(bt==1) return this["_KEYRING_icon_bitmap"];
    if(bt==2) return this["_SEEDPOUCH_icon_bitmap"];
    if(bt==3) return this["_SCROLLHOLDER_icon_bitmap"];
    if(bt==4) return this["_WANDHOLSTER_icon_bitmap"];
    return null;
}

Window_PDInventory.prototype.updateTab2BagMappings=function(){
    var isInit=(this._lastHasKeyRing==null);
    this._lastHasKeyRing=this._hasKeyRing;
    this._lastHasSeedPouch=this._hasSeedPouch;
    this._lastHasScrollHolder=this._hasScrollHolder;
    this._lastHasWandHolster=this._hasWandHolster;

    this._hasKeyRing=PD.Hero.isBagAvailable(PD.Item.BagType.KEYRING);
    this._hasSeedPouch=PD.Hero.isBagAvailable(PD.Item.BagType.SEEDPOUCH);
    this._hasScrollHolder=PD.Hero.isBagAvailable(PD.Item.BagType.SCROLLHOLDER);
    this._hasWandHolster=PD.Hero.isBagAvailable(PD.Item.BagType.WANDHOLSTER);

    if(isInit || this._lastHasKeyRing!=this._hasKeyRing || this._lastHasSeedPouch!=this._hasSeedPouch || this._lastHasScrollHolder!=this._hasScrollHolder || this._hasWandHolster!=this._lastHasWandHolster){
        for (var index = 0; index < 5; index++) {
            var ss=this.shouldShowTab(index);
            if(ss){
                this["_tab"+index].visible=true;
                this["_tab"+index+"_icon"].visisble=true;
                this["_tab"+index+"_icon"].bitmap=this.InventoryBagType2IconBitmap(this.tab2Type(index));
            }else{
                this["_tab"+index].visible=false;
                this["_tab"+index+"_icon"].visisble=false;
            }
        }
        this.updatePositions();
    }
}

Window_PDInventory.prototype.updateTabs=function(){
    if(this._lastTab!=this._currentTab){
        this.removeChild(this["_tab"+this._currentTab]);
        this.removeChild(this["_tab"+this._currentTab+"_icon"]);
        this.addChild(this["_tab"+this._currentTab]);
        this.addChild(this["_tab"+this._currentTab+"_icon"]);
        if(this._onTabChanged!=undefined && this._onTabChanged!=null){
            this._onTabChanged(this._lastTab, this.tab2Type(this._lastTab), this._currentTab, this.tab2Type(this._currentTab));
        }
        this._lastTab=this._currentTab;
    }
}
Window_PDInventory.prototype.setTab=function(tabId){
    this._currentTab=tabId;
    
}
Window_PDInventory.prototype.preloadImages=function(){
    this._bgTop_bitmap=ImageManager.loadSystem("PD_InventoryTop");
    this._tab0_bitmap=ImageManager.loadSystem("PD_InventoryTab0");
    this._BACKPACK_icon_bitmap=ImageManager.loadSystem(Window_PDInventory.InventoryBagType2Icon(PD.Item.BagType.BACKPACK));
    this._tab1_bitmap=ImageManager.loadSystem("PD_InventoryTab1");
    this._KEYRING_icon_bitmap=ImageManager.loadSystem(Window_PDInventory.InventoryBagType2Icon(PD.Item.BagType.KEYRING));
    this._tab2_bitmap=ImageManager.loadSystem("PD_InventoryTab2");
    this._SEEDPOUCH_icon_bitmap=ImageManager.loadSystem(Window_PDInventory.InventoryBagType2Icon(PD.Item.BagType.SEEDPOUCH));
    this._tab3_bitmap=ImageManager.loadSystem("PD_InventoryTab3");
    this._SCROLLHOLDER_icon_bitmap=ImageManager.loadSystem(Window_PDInventory.InventoryBagType2Icon(PD.Item.BagType.SCROLLHOLDER));
    this._tab4_bitmap=ImageManager.loadSystem("PD_InventoryTab4");
    this._WANDHOLSTER_icon_bitmap=ImageManager.loadSystem(Window_PDInventory.InventoryBagType2Icon(PD.Item.BagType.WANDHOLSTER));
}

Window_PDInventory.prototype.shouldShowTab=function(tabId){
    if(tabId>0){
        if(!this.shouldShowTab(tabId-1)){
            return false;
        }
    }
    if(tabId==0){
        return true;
    }else{
        return this.tab2Type(tabId)!=null;
    }
}

Window_PDInventory.prototype.createTabs = function() {
    for (var index = 0; index < 5; index++) {
        this["_tab"+index]=new Sprite();
        this["_tab"+index].bitmap=this["_tab"+index+"_bitmap"];
        this.addChild(this["_tab"+index]);
        this["_tab"+index+"_icon"]=new Sprite_Button();
        this["_tab"+index+"_icon"].bitmap=this["_tab"+index+"_icon_bitmap"];
        this.addChild(this["_tab"+index+"_icon"]);
        this["_tab"+index+"_icon"].setClickHandler(this.tabClickHandler(index).bind(this));
    }
};
Window_PDInventory.prototype.createBgTop = function() {
    this._bgTop=new Sprite();
    this._bgTop.bitmap=this._bgTop_bitmap;
    this.addChild(this._bgTop);
    
};
Window_PDInventory.prototype.createTitle=function(text){
    this._textSprite=new Sprite(new Bitmap(this.width, this.height));
    
    this._textSprite.bitmap.clear();
    this._textSprite.bitmap.textColor = this.textColor(6);
    this._textSprite.bitmap.fontSize = 25;
    this._textSprite.bitmap.drawText(text, 0, 16, this.width, 25, 'center');
    this.addChild(this._textSprite);
    
}


Window_PDInventory.prototype.setTitle=function(text){
    this.removeChild(this._textSprite);
    this.createTitle(text);
}

Window_PDInventory.prototype.start = function() {
    this.updatePositions();
};
Window_PDInventory.prototype.tabY=function(){
    return this._bgTop.height;
}
Window_PDInventory.prototype.updatePositions=function(){
    this.x=110;
    this.y=40;
    for (var index = 0; index < 5; index++) {
        this["_tab"+index].x=3;
        this["_tab"+index].y=this.tabY();
        this["_tab"+index+"_icon"].x=16 + (55 * index);
        this["_tab"+index+"_icon"].y=this["_tab"+index].y+3
    }
}

Window_PDInventory.prototype.windowWidth = function() {
    return 308;
};

Window_PDInventory.prototype.windowHeight = function() {
    return 503;
};

Window_PDInventory.prototype.refresh = function() {
    this.contents.clear();
    this.updatePositions();
};

Window_PDInventory.prototype.getRect = function() {
    return {x:this.x, y:this.y, width:this.width, height:this.height};
}

Window_PDInventory.prototype.open = function() {
   // PD.UI.addInactiveRect(this.getRect());
    this.refresh();
    Window_Base.prototype.open.call(this);
};
Window_PDInventory.prototype.close = function() {
    //PD.UI.removeInactiveRect(this.getRect());
    Window_Base.prototype.close.call(this);
};

Window_PDInventory.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    // if(!this.isOpening() && !this.isOpen()){
    //      this.open();
    //      this.refresh();
    // }
    if(!this.isOpening() && this.isOpen()){
        this.updateTab2BagMappings();
        this.updateTabs();
    }
};

//=============================================================================
// Window_PDInventoryList.js
//=============================================================================
/*:
 * @plugindesc The panels that are shown over the game map while playing.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */


function Window_PDInventoryList() {
    this.initialize.apply(this, arguments);
}

Window_PDInventoryList.prototype = Object.create(Window_Selectable.prototype);
Window_PDInventoryList.prototype.constructor = Window_PDInventoryList;

Window_PDInventoryList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._itemBG_bitmap=ImageManager.loadSystem("PD_InventoryItem");
    this._itemEquipBG_bitmap=ImageManager.loadSystem("PD_InventoryItem_Equipment");
    this._itemBG_act_bitmap=ImageManager.loadSystem("PD_InventoryItem_act");
    this._itemEquipBG_act_bitmap=ImageManager.loadSystem("PD_InventoryItem_Equipment_act");
    this._category = 'item';
    this._mode = PD.Item.BagType.BACKPACK;
    this._data = [];
    this.padding=20;
    this.setBackgroundType(2);
    this.refresh();
    this.resetScroll();
    
};

Window_PDInventoryList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.resetScroll();
    }
};

Window_PDInventoryList.prototype.setMode = function(newMode) {
    if (this._mode !== newMode) {
        this._mode = newMode;
        this.refresh();
        this.resetScroll();
    }
};

Window_PDInventoryList.prototype.selectFirstItem = function(category) {
    if(this._data.length>4){
        this.select(4);
    }else{
        this.select(0);
    }
};

Window_PDInventoryList.prototype.updateCursor = function() {
    if(this._data!=undefined){
        this.contents.clear();
        this.drawAllItems();
        this.setCursorRect(0, 0, 0, 0);
    }
    
    
};

Window_PDInventoryList.prototype.maxCols = function() {
    return 4;
};

Window_PDInventoryList.prototype.spacing = function() {
    return 1;
};
Window_PDInventoryList.prototype.itemWidth = function() {
    return Math.floor((this.width - this.padding * 2 +
                       this.spacing()) / this.maxCols() - this.spacing());
};
Window_PDInventoryList.prototype.itemHeight = function() {
    return Math.floor((this.width - this.padding * 2 +
                       this.spacing()) / this.maxCols() - this.spacing());
};

Window_PDInventoryList.prototype.maxItems = function() {
    return 4+PD.Item.bagSize(this._mode);
    //return 24;//this._data ? this._data.length : 1;
};

Window_PDInventoryList.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_PDInventoryList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};

// Window_PDInventoryList.prototype.includes = function(item) {
//     switch (this._category) {
//     case 'item':
//         return DataManager.isItem(item) && item.itypeId === 1;
//     case 'weapon':
//         return DataManager.isWeapon(item);
//     case 'armor':
//         return DataManager.isArmor(item);
//     case 'keyItem':
//         return DataManager.isItem(item) && item.itypeId === 2;
//     default:
//         return false;
//     }
// };
Window_PDInventoryList.prototype.includes = function(item) {
    return true;
    // switch (this._mode) {
    // case PD.Item.BagType.BACKPACK:
    //     return true;
    // case PD.Item.BagType.KEYRING:
    //     return item.typeId == 1;
    // case PD.Item.BagType.SEEDPOUCH:
    //     return PD.Item.isSeed(item);
    // case PD.Item.BagType.SCROLLHOLDER:
    //     return PD.Item.isScroll(item);
    // case PD.Item.BagType.WANDHOLSTER:
    //     return PD.Item.isFood(item);
    // default:
    //     return false;
    // }
};

Window_PDInventoryList.prototype.needsNumber = function() {
    return true;
};

Window_PDInventoryList.prototype.isEnabled = function(item) {
    return $gameParty.canUse(item);
};

Window_PDInventoryList.prototype.makeItemList = function() {
    
    this._data=[];
    var equipped=$gameParty.leader().equips();
    for (var index = 0; index < equipped.length; index++) {
        var element = equipped[index];
        if(element!=null && element!=undefined){
            this._data.push(element);
        }else{
            this._data.push(null);
        }
    }
    var allItems=$gameParty.allItems(this._mode);
    for (var index = 0; index < allItems.length; index++) {
        var element = allItems[index];
        if(this.includes(element)){
            this._data.push(element);
        }
    }
};

Window_PDInventoryList.prototype.selectLast = function() {
    var index = this._data.indexOf($gameParty.lastItem());
    this.select(index >= 0 ? index : 0);
};

Window_PDInventoryList.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    return rect;
};

Window_PDInventoryList.prototype.drawItem = function(index) {
    var item = this._data[index];
    var rect = this.itemRect(index);
    this.drawPDItemBG(index, rect.x, rect.y, rect.width);
    if (item) {
        var numberWidth = this.numberWidth();
        //this.changePaintOpacity(this.isEnabled(item));
        this.drawPDItem(item, rect.x, rect.y, rect.width);
        //this.drawItemNumber(item, rect.x, rect.y, rect.width);
        //this.changePaintOpacity(1);
    }
};
Window_PDInventoryList.prototype.drawPDItemBG = function(index, x, y, width) {
    var isEquipment=index<4;
    var isCurrentIndex=(index==this.index());
    var bm=isCurrentIndex?this._itemBG_act_bitmap:this._itemBG_bitmap;
    if(isEquipment){
        bm=isCurrentIndex?this._itemEquipBG_act_bitmap:this._itemEquipBG_bitmap;
    }
    this.contents.blt(bm, 0, 0, bm.width, bm.height, x, y, width, width-2);
}
Window_PDInventoryList.prototype.drawPDItem = function(item, x, y, width) {
    width = width || this.itemWidth();
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth;
        this.resetTextColor();
        //this.
        var idisplaydata=PD.Item.itemDisplayData(item);
        this.drawIcon(idisplaydata.icon, x + iconBoxWidth/2 , y + iconBoxWidth/2 );
        this.contents.fontSize=16;
        this.contents.outlineWidth=5;
        if(DataManager.isWeapon(item) || DataManager.isArmor(item)){
            //console.log(item);
            this.drawText(":"+item.params[4], x+width-25, y-5, 20, 'right');
        }else{
            
            var numOf=$gameParty.numItems(item);
            if(numOf>1){
                this.drawText(numOf, x+3, y-5, 20, 'left');
            }
        }
        //this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    }
};

Window_PDInventoryList.prototype.numberWidth = function() {
    return this.textWidth('000');
};

Window_PDInventoryList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

Window_PDInventoryList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_PDInventoryList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};
