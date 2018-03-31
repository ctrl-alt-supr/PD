PD=PD||{};
PD.Item=PD.Item||{};
PD.Item.Type={
    WEAPON:0,
    ARMOR:1,
    POTION:2,
    SCROLL:3,
    WAND:4,
    RING:5,
    SEED:6,
    FOOD:7,
    KEY:8,
    BAG:9,
    OTHER:10
}
PD.Item.BagType={
    BACKPACK:0,
    KEYRING:1,
    SEEDPOUCH:2,
    SCROLLHOLDER:3,
    WANDHOLSTER:4,
}
PD.Item.BagSwitches={
    1:11,
    2:12,
    3:13,
    4:14
}
PD.Item.bagSize=function(bagType){
    if(bagType==PD.Item.BagType.BACKPACK){
        return 19;
    }else if(bagType==PD.Item.BagType.KEYRING){
        return 12;
    }else if(bagType==PD.Item.BagType.SEEDPOUCH){
        return 8;
    }else if(bagType==PD.Item.BagType.SCROLLHOLDER){
        return 12;
    }else if(bagType==PD.Item.BagType.WANDHOLSTER){
        return 12;
    }
}
PD.Item.isPotion=function(item){
    return PD.Item.Potions.indexOf(item.id)>-1;
}
PD.Item.isScroll=function(item){
    return PD.Item.Scrolls.indexOf(item.id)>-1 || item.id==PD.Item.ScrollOfWipeout;
}
PD.Item.isFood=function(item){
    return PD.Item.Foods.indexOf(item.id)>-1;
}
PD.Item.isBag=function(item){
    return PD.Item.Bags.indexOf(item.id)>-1;
}
PD.Item.isSeed=function(item){
    return PD.Item.Seeds.indexOf(item.id)>-1;
}
PD.Item.isItem = function(item) {
    return DataManager.isItem(item);
};
PD.Item.isWeapon = function(item) {
    return DataManager.isWeapon(item);
};
PD.Item.isArmor = function(item) {
    return DataManager.isArmor(item);
};

PD.Item.UnidentifiedPotions=[
    2,  //Turquoise potion
    3,  //Crimson potion
    4,  //Azure potion
    5,  //Jade potion
    6,  //Golden potion
    7,  //Magenta potion
    8,  //Charcoal potion
    9,  //Bistre potion
    10, //Amber potion
    11, //Ivory potion
    12, //Silver potion
    13  //Indigo potion
];
PD.Item.Potions=[
    15,  //Toxic gas
    16,  //Experience
    17,  //Strength
    18,  //Liquid flame
    19,  //Frost
    20,  //Healing
    21,  //Invisibility
    22,  //Levitation
    23,  //Mind vision
    24,  //Paralytic gas
    25,  //Purification
    26   //Might
];
PD.Item.UnidentifiedScrolls=[
    28,  //YNGVI
    29,  //RAIDO
    30,  //LAGUZ
    31,  //NAUDIZ
    32,  //GYFU
    33,  //SOWILO
    34,  //MANNAZ
    35,  //KAUNAN
    36,  //ISAZ
    37,  //BERKANAN
    38,  //ODAL
    39   //TIMAZ
];

PD.Item.Scrolls=[
    41,  //Identify
    42,  //Upgrade
    43,  //Terror
    44,  //Magic mapping
    45,  //Remove curse
    46,  //Recharging
    47,  //Challenge
    48,  //Teleportation
    49,  //Psionic blast
    50,  //Lullaby
    51,  //Mirror image
    52   //Enchantment
];

PD.Item.ScrollOfWipeout=53;

PD.Item.Rings=[

];
PD.Item.Wands=[
    
];
PD.Item.Bags=[
    62, //Key ring
    63, //Seed pouch
    64, //Scroll holder
    65  //Wand holster
];
PD.Item.Foods=[
    55, //Ration of food
    56, //Pasty
    57, //Overpriced food ration
    58, //Mystery meat
    59, //Chargrilled meat
    60  //Frozen carpaccio
];
PD.Item.Seeds=[
    67, //Firebloom
    68, //Icecap
    69, //Sorrows
    70, //Dreamweed
    71, //Sungrass
    72, //Earthroot
    73, //Fadeleaf
    74  //Rotberry
];

PD.Item.generatePotionKnowledge=function(){
    var toRet={};
    var usedUnidentified=[];
    if(PD.Item.Potions.length>PD.Item.UnidentifiedPotions.length){
        console.warn("There are less defined unidentified potion entries than identified. The system is intended to use only one type of unidentified potion for identified one.");
    }else{
        for (var index = 0; index < PD.Item.Potions.length; index++) {
            var identified = PD.Item.Potions[index];
            var newUnidentified=null;
            do{
                newUnidentified=PD.Helpers.randomFrom(PD.Item.UnidentifiedPotions);
            }while(usedUnidentified.indexOf(newUnidentified)!=-1);
            usedUnidentified.push(newUnidentified);
            toRet[identified]=newUnidentified;
        }
    }
    return toRet;
}

PD.Item.generateScrollKnowledge=function(){
    var toRet={};
    var usedUnidentified=[];
    if(PD.Item.Scrolls.length>PD.Item.UnidentifiedScrolls.length){
        console.warn("There are less defined unidentified scroll entries than identified. The system is intended to use only one type of unidentified scroll for identified one.");
    }else{
        for (var index = 0; index < PD.Item.Scrolls.length; index++) {
            var identified = PD.Item.Scrolls[index];
            var newUnidentified=null;
            do{
                newUnidentified=PD.Helpers.randomFrom(PD.Item.UnidentifiedScrolls);
            }while(usedUnidentified.indexOf(newUnidentified)!=-1);
            usedUnidentified.push(newUnidentified);
            toRet[identified]=newUnidentified;
        }
    }
    return toRet;
}





















////////////////////////////////////////////////////////////////
//Game_Party
///////////////////////////////////////////////////////////////
Game_Party.prototype.itemContainer = function(item) {
    if (!item) {
        return null;
    } else  if (PD.Item.isSeed(item)) {
        if(PD.Hero.isBagAvailable(PD.Item.BagType.SEEDPOUCH)){
            return this._seedpouch;
        }
    }else if (PD.Item.isScroll(item)) {
        if(PD.Hero.isBagAvailable(PD.Item.BagType.SCROLLHOLDER)){
            return this._scrollholder;
        }
    }
    return this._backpack;
    
};
Game_Party.prototype.refreshContainers = function() {
    for (var id in this._backpack) {
        if(this._backpack[id].length>0){
            var designatedContainer=this.itemContainer({id:Number(id)});
            if(designatedContainer!=this._backpack){
                if(designatedContainer[id]==undefined){
                    designatedContainer[id]=[];
                }
                for (var index = 0; index < this._backpack[id].length; index++) {
                    var element = this._backpack[id][index];
                    designatedContainer[id].push(element);
                }
                delete this._backpack[id];
            }
        }
    }
}

Game_Party.prototype.initAllItems = function() {
    this._backpack = {};
    this._keyring = {};
    this._seedpouch = {};
    this._scrollholder = {};
    this._wandholster = {};
};


Game_Party.prototype.allItems = function(bagType) {
    var toRet=[];
    if(bagType==undefined || bagType==PD.Item.BagType.BACKPACK){
        for (var id in this._backpack) {
            if(PD.Item.isWeapon({id:id})){
                toRet.push($dataWeapons[id]);
            }else if(PD.Item.isArmor({id:id})){
                toRet.push($dataArmors[id]);
            }else{
                toRet.push($dataItems[id]);
            }
        }
    }
    if(bagType==undefined || bagType==PD.Item.BagType.KEYRING){
        if(PD.Hero.isBagAvailable(PD.Item.BagType.KEYRING)){
            for (var id in this._keyring) {
                toRet.push($dataItems[id]);
            }
        }
    }
    if(bagType==undefined || bagType==PD.Item.BagType.SEEDPOUCH){
        if(PD.Hero.isBagAvailable(PD.Item.BagType.SEEDPOUCH)){
            for (var id in this._seedpouch) {
                toRet.push($dataItems[id]);
            }
        }
    }
    if(bagType==undefined || bagType==PD.Item.BagType.SCROLLHOLDER){
        if(PD.Hero.isBagAvailable(PD.Item.BagType.SCROLLHOLDER)){
            for (var id in this._scrollholder) {
                toRet.push($dataItems[id]);
            }
        }
    }
    if(bagType==undefined || bagType==PD.Item.BagType.WANDHOLSTER){
        if(PD.Hero.isBagAvailable(PD.Item.BagType.WANDHOLSTER)){
            for (var id in this._wandholster) {
                toRet.push($dataItems[id]);
            }
        }
    }
    return toRet;
};

Game_Party.prototype.items = function() {
    var toRet=[];
    for (var id in this._backpack) {
        if(PD.Item.isWeapon({id:id})){
            toRet.push($dataWeapons[id]);
        }else if(PD.Item.isArmor({id:id})){
            toRet.push($dataArmors[id]);
        }else{
            toRet.push($dataItems[id]);
        }
    }
    return toRet;
};

Game_Party.prototype.weapons = function() {
    var toRet=[];
    for (var id in this._backpack) {
        if(PD.Item.isWeapon({id:id})){
            toRet.push($dataWeapons[id]);
        }
    }
    return toRet;
};

Game_Party.prototype.armors = function() {
    var toRet=[];
    for (var id in this._backpack) {
        if(PD.Item.isArmor({id:id})){
            toRet.push($dataArmors[id]);
        }
    }
    return toRet;
};
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    var container = this.itemContainer(item);
    if (container) {
        var lastNumber = this.numItems(item);
        var newNumber = lastNumber + amount;
        var maxItems=this.maxItems(item);
        if(container[item.id]==undefined){
            container[item.id]=[]; 
        }
        if(newNumber>=0 && newNumber<=maxItems){
            if(amount>0){
                for (var index = 0; index < amount; index++) {
                    container[item.id].push({
                        cursed:false,
                        cursedKnown:false,
                        level:0,
                        levelKnown:false,
                        durability:-1
                    }); 
                }
            }else if(amount<0){
                for (var index = 0; index >= amount; index--) {
                    container[item.id].splice(container[item.id].length-1, 1);
                }
            }
        }
        if(container[item.id].length==0){
            delete container[item.id];
        }
        if (includeEquip && newNumber < 0) {
            this.discardMembersEquip(item, -newNumber);
        }
        if(PD.Item.isBag(item)){
            this.refreshContainers();
        }
        $gameMap.requestRefresh();
    }
};

Game_Party.prototype.discardMembersEquip = function(item, amount) {
    var n = amount;
    this.members().forEach(function(actor) {
        while (n > 0 && actor.isEquipped(item)) {
            actor.discardEquip(item);
            n--;
        }
    });
};

Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
    this.gainItem(item, -amount, includeEquip);
};

Game_Party.prototype.consumeItem = function(item) {
    if (DataManager.isItem(item) && item.consumable) {
        this.loseItem(item, 1);
    }
};
Game_Party.prototype.numItems = function(item) {
    var container = this.itemContainer(item);
    if(container!=undefined && container!=null && container[item.id]!=undefined){
        return container[item.id].length;
    }
    return 0;
};

Game_Party.prototype.maxItems = function(item) {
    return 99;
};

Game_Party.prototype.hasMaxItems = function(item) {
    return this.numItems(item) >= this.maxItems(item);
};

Game_Party.prototype.hasItem = function(item, includeEquip) {
    if (includeEquip === undefined) {
        includeEquip = false;
    }
    if (this.numItems(item) > 0) {
        return true;
    } else if (includeEquip && this.isAnyMemberEquipped(item)) {
        return true;
    } else {
        return false;
    }
};