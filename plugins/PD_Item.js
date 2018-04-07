//=============================================================================
// PD_Item.js
//=============================================================================
/*:
 * @plugindesc 
 * @author Alex
 *
 * @help This plugin doesn't provide any plugin command.
 * 
 * @param defaultsHeader
 * @text Default mappings
 * 
 * 
 * 
 * 
 * 
*/

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
    return PD.Item.Categories["POTIONS"].filter(function(e){
        return e.itemId==item.id;
    }).length>0;
}
PD.Item.isScroll=function(item){
    return PD.Item.Categories["SCROLLS"].filter(function(e){
        return e.itemId==item.id;
    }).length>0;
}

PD.Item.isFood=function(item){
    return PD.Item.Categories["FOODS"].filter(function(e){
        return e.itemId==item.id;
    }).length>0;
}
PD.Item.isBag=function(item){
    return PD.Item.Categories["BAGS"].filter(function(e){
        return e.itemId==item.id;
    }).length>0;
}
PD.Item.isSeed=function(item){
    return PD.Item.Categories["SEEDS"].filter(function(e){
        return e.itemId==item.id;
    }).length>0;
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

PD.Item.itemDisplayData=function(item){
    if(!PD.Item.isWeapon(item) && !PD.Item.isArmor(item)){
        var itemIdToDisplay=item.id;
        var itemCatInfo=PD.Item.parseItemCategoryNotetag($dataItems[item.id].note);
        if(itemCatInfo!=null && itemCatInfo.name!=null){
            if(PD.Item.CategoryNamesRequiringKnowledge().indexOf(itemCatInfo.name)>-1){
                if(!(PD.Dungeon.Known[itemCatInfo.name]!=undefined && PD.Dungeon.Known[itemCatInfo.name][item.id]!=undefined && PD.Dungeon.Known[itemCatInfo.name][item.id]==true)){
                    itemIdToDisplay=PD.Item.knownItemToUnknown(item.id);
                }
            }
        }
        return {
            name:$dataItems[itemIdToDisplay].name,
            description:$dataItems[itemIdToDisplay].description,
            icon:$dataItems[itemIdToDisplay].iconIndex,
            itemid:itemIdToDisplay
        }
        // if(PD.Item.isScroll(item)){
        //     var itemIdToDisplay=item.id;
        //     if(PD.Dungeon._knownScrolls.indexOf(item.id)==-1) itemIdToDisplay=PD.Dungeon.ScrollKnowledge[item.id];
        //     return {
        //         name:$dataItems[itemIdToDisplay].name,
        //         description:$dataItems[itemIdToDisplay].description,
        //         icon:$dataItems[itemIdToDisplay],
        //         itemid:itemIdToDisplay
        //     }
        // }else if(PD.Item.isPotion(item)){
        //     var itemIdToDisplay=item.id;
        //     if(PD.Dungeon._knownPotions.indexOf(item.id)==-1) itemIdToDisplay=PD.Dungeon.PotionKnowledge[item.id];
        //     return {
        //         name:$dataItems[itemIdToDisplay].name,
        //         description:$dataItems[itemIdToDisplay].description,
        //         icon:$dataItems[itemIdToDisplay].iconIndex,
        //         itemid:itemIdToDisplay
        //     }
        // }
    }
    return {
        name:item.name,
        description:item.description,
        icon:item.iconIndex,
        itemid:item.id
    }
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
PD.Item.parseItemEventIdNotetag=function(eNote){
    var toReturn=null;
    var rgx=new RegExp("<\\s*event\\s+([\\w\\s\\d='\":_\\.\\*\\+-\\{\\}]*)\\s*\\/?\\s*>", "ig");
    var regexMatch = rgx.exec(eNote);
    if(regexMatch){
        var dp=new window.DOMParser().parseFromString(regexMatch[0], "text/xml");
        var evOptions={};
        var defOpts={
            id:null
        };
        for(var propertyName in defOpts) {
            if(dp.documentElement.attributes[propertyName]!=null){
                evOptions[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
            }else{
                evOptions[propertyName]=defOpts[propertyName];
            }
        }
        toReturn= evOptions;//Object.assign(defOpts, temporalAttrs);
    }
    return toReturn;
}

PD.Item.getItemDBEventId=function(item){
    return PD.Item.parseItemEventIdNotetag($dataItems[item.id].note);
}
PD.Item.getItemEventDBData=function(itemID){
    var catInfo=PD.Item.parseItemCategoryNotetag($dataItems[itemID].note);
    if(catInfo!=null && catInfo.name!=null && catInfo.requiresKnowledge){
        itemID=PD.Item.knownItemToUnknown(itemID);
    }
    // var uidentifiedPId=PD.Dungeon.unidentifiedPotionId({id:itemID});
    // var uidentifiedSId=PD.Dungeon.unidentifiedScrollId({id:itemID});
    // if(uidentifiedPId!=null){
    //     itemID=uidentifiedPId;
    // }else if(uidentifiedSId!=null){
    //     itemID=uidentifiedSId;
    // }
    var dbEventId=PD.Item.parseItemEventIdNotetag($dataItems[itemID].note);
    if(dbEventId==null || dbEventId<=0) return null;
    dbEventId=dbEventId.id;
    if(window["$dataMap_"+PD.Generator.Parameters.ItemEventMapId]==undefined || window["$dataMap_"+PD.Generator.Parameters.ItemEventMapId]==null){
        return null;
    }
    var db=window["$dataMap_"+PD.Generator.Parameters.ItemEventMapId];
    return db.events.length>dbEventId?db.events[dbEventId]:null;
}


PD.Item.Categories={};
PD.Item.CategoryNames=function(){
    var catNames=[];
    for(var propertyName in PD.Item.Categories) {
        catNames.push(propertyName);
    }
    return catNames;
}

PD.Item.CategoryNamesRequiringKnowledge=function(){
    var catNames=[];
    for(var propertyName in PD.Item.Categories) {
        if(PD.Item.Categories[propertyName].filter(function(ec){
            return ec.requiresKnowledge;
        }).length>0){
            for(var propertyName2 in PD.Item.Categories) {
                if(propertyName2!=propertyName && PD.Item.Categories[propertyName2].filter(function(ec2){
                    return ec2.unknownOf==propertyName;
                }).length>0){
                    catNames.push(propertyName)
                }
            }
        }
    }
    return catNames;
}
PD.Item.CategoryNamesUnknownOf=function(){
    var catNames=[];
    for(var propertyName in PD.Item.Categories) {
        if(PD.Item.Categories[propertyName].filter(function(ec){
            return ec.unknownOf!=null;
        }).length>0){
            catNames.push(propertyName);
        }
    }
    return catNames;
}
PD.Item.knownCategoryToUnknown=function(knownCat){
    if(knownCat==null){
        return null;
    }
    if(PD.Item.CategoryNamesRequiringKnowledge().indexOf(knownCat)>-1){
        for(var propertyName in PD.Item.Categories) {
            if(PD.Item.Categories[propertyName].filter(function(ec2){
                return ec2.unknownOf==knownCat;
            }).length>0){
                return propertyName
            }
        }
    }
    return null;
}
PD.Item.unknownCategoryToKnown=function(unknownCat){
    if(unknownCat==null){
        return null;
    }
    for (var index = 0; index < PD.Item.Categories[unknownCat].length; index++) {
        var element = PD.Item.Categories[unknownCat][index];
        if(element.unknownOf!=null){
            return element.unknownOf;
        }
    }
    return null;
}
PD.Item.knownItemToUnknown=function(knownItem){
    var itemData=$dataItems[knownItem];
    var itemCatInfo=PD.Item.parseItemCategoryNotetag(itemData.note);
    if(itemCatInfo!=null && itemCatInfo.name!=null && itemCatInfo.requiresKnowledge){
        if(PD.Dungeon.Knowledge[itemCatInfo.name]!=undefined && PD.Dungeon.Knowledge[itemCatInfo.name][knownItem]!=undefined){
            return PD.Dungeon.Knowledge[itemCatInfo.name][knownItem];
        }
    }
    return null;
}
PD.Item.unknownItemToKnown=function(unknownItem){
    var itemData=$dataItems[unknownItem];
    var itemCatInfo=PD.Item.parseItemCategoryNotetag(itemData.note);
    if(itemCatInfo!=null && itemCatInfo.name!=null && itemCatInfo.unknownOf!=null){
        if(PD.Dungeon.Knowledge[itemCatInfo.unknownOf]!=undefined){
            for(var propertyName in PD.Dungeon.Knowledge[itemCatInfo.unknownOf]) {
                var unkId = PD.Dungeon.Knowledge[itemCatInfo.unknownOf][propertyName];
                if(unkId==unknownItem){
                    return propertyName;
                }
            }
        }
    }
    return null;
}

PD.Item.CategoryItems=function(category){
    return PD.Item.Categories[category];
}
PD.Item.setupCategories=function(){
    PD.Item.Categories={};
    //Setup MV database item categories. This includes scrolls, potions, food and other random items... and also RANGED weapons
    for (var index = 0; index < $dataItems.length; index++) {
        var element = $dataItems[index];
        if(element!=undefined && element!=null){
            var catOpts=PD.Item.parseItemCategoryNotetag(element.note);
            if(catOpts!=null && catOpts.name!=null){
                PD.Item.Categories[catOpts.name]=PD.Item.Categories[catOpts.name] || [];
                var catElement={
                    itemId:element.id,
                    itemName:element.name,
                    requiresKnowledge:catOpts.requiresKnowledge,
                    unknownOf:catOpts.unknownOf,
                    chance:catOpts.chance
                }
                PD.Item.Categories[catOpts.name].push(catElement);
            }
        }
    }
    //Setup MV database weapon categories. The name is ignored and only the chances are taken in account. "WEAPONS" category
    for (var index = 0; index < $dataWeapons.length; index++) {
        var element = $dataWeapons[index];
        if(element!=undefined && element!=null){
            var catOpts=PD.Item.parseItemCategoryNotetag(element.note);
            if(catOpts!=null){
                PD.Item.Categories["WEAPONS"]=PD.Item.Categories["WEAPONS"] || [];
                var catElement={
                    itemId:element.id,
                    itemName:element.name,
                    requiresKnowledge:catOpts.requiresKnowledge,
                    unknownOf:catOpts.unknownOf,
                    chance:catOpts.chance
                }
                PD.Item.Categories["WEAPONS"].push(catElement);
            }
        }
    }
}
PD.Item.randomItem=function(category){
    var availableItems=[];
    if(category==null){
        for(var propertyName in PD.Item.Categories) {
            availableItems=availableItems.concat(PD.Item.Categories[propertyName]);
        }
    }else if(category.constructor === Array){
        for (var index = 0; index < category.length; index++) {
            availableItems=availableItems.concat(PD.Item.Categories[category[index]]);
        }
    }else{
        availableItems=PD.Item.CategoryItems(category);
    }
    return PD.Helpers.randomFromWithWeight(availableItems, "chance");
}


PD.Item.parseItemCategoryNotetag=function(eNote){
    var toReturn=null;
    var rgx=new RegExp("<\\s*category\\s+([\\w\\s\\d='\":_\\.\\*\\+-\\{\\}]*)\\s*\\/?\\s*>", "ig");
    var regexMatch = rgx.exec(eNote);
    if(regexMatch){
        var dp=new window.DOMParser().parseFromString(regexMatch[0], "text/xml");
        var evOptions={};
        var defOpts={
            unknownOf:null,
            requiresKnowledge:false,
            name:null,
            chance:0
        };
        for(var propertyName in defOpts) {
            if(dp.documentElement.attributes[propertyName]!=null){
                if(propertyName=="chance"){
                    evOptions[propertyName]=Number(dp.documentElement.attributes[propertyName].value);
                }else if(propertyName=="requiresKnowledge"){
                    evOptions[propertyName]=Boolean(dp.documentElement.attributes[propertyName].value.toLowerCase()=="true");
                }else{
                    evOptions[propertyName]=String(dp.documentElement.attributes[propertyName].value);
                }
            }else{
                evOptions[propertyName]=defOpts[propertyName];
            }
        }
        toReturn= evOptions;//Object.assign(defOpts, temporalAttrs);
    }
    return toReturn;
}

PD.Item.generateCategoryKnowledge=function(knownCategory){
    var toRet={};
    var usedUnidentified=[];
    var knownIds=[];
    var unknownIds=[];
    if(PD.Item.CategoryNamesRequiringKnowledge().indexOf(knownCategory)>-1){
        var unknownCategoryName=PD.Item.knownCategoryToUnknown(knownCategory);
        knownIds=PD.Item.Categories[knownCategory].filter(function(i){
            return i.requiresKnowledge;
        }).map(function(i){
            return i.itemId;
        });
        unknownIds=PD.Item.Categories[unknownCategoryName].filter(function(i){
            return i.unknownOf==knownCategory;
        }).map(function(i){
            return i.itemId;
        });
        if(knownIds.length>unknownIds.length){
            console.warn("There are less defined unidentified entries in "+unknownCategoryName+" than identified in "+knownCategory+". The system is intended to use only one type of unidentified item for identified one.");
        }else{
            for (var index = 0; index < knownIds.length; index++) {
                var identified = knownIds[index];
                var newUnidentified=null;
                do{
                    newUnidentified=PD.Helpers.randomFrom(unknownIds);
                }while(usedUnidentified.indexOf(newUnidentified)!=-1);
                usedUnidentified.push(newUnidentified);
                toRet[identified]=newUnidentified;
            }
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
    // var identifiedPot=PD.Dungeon.identifiedPotionId(item);
    var catInfo=PD.Item.parseItemCategoryNotetag($dataItems[item.id].note);
    if(catInfo!=null && catInfo.name!=null && catInfo.unknownOf!=null){
        item.id=PD.Item.unknownItemToKnown(item.id);
    }
    // if(identifiedPot!=null){
    //     item.id=identifiedPot;
    // }else{
    //     identifiedPot=PD.Dungeon.identifiedScrollId(item); 
    //     if(identifiedPot!=null){
    //         item.id=identifiedPot;
    //     }
    // }
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

Game_Character.prototype.dropItem=function(item){
    PD.Item.spawnItem(item.id, this.x, this.y);
}
PD.Item.spawnItem=function(itemId, x, y){
    var tmplData=PD.Item.getItemEventDBData(itemId);
    if(tmplData!=null){
        var dbEventId=tmplData.id;
        var evn=new Game_ItemEvent($gameMap._mapId, x, y, dbEventId, tmplData, $gameMap._events.length);
        $gameMap._events.push(evn);
        if(SceneManager._scene._spriteset!=undefined && SceneManager._scene._spriteset!=null && SceneManager._scene._characterSprites!=undefined && SceneManager._scene._characterSprites!=null){
            var cspr=new Sprite_Character(evn);
            SceneManager._scene._spriteset._characterSprites.push(cspr);
            SceneManager._scene._spriteset._tilemap.addChild(cspr);
        }
    }
}

//-----------------------------------------------------------------------------
// Game_ItemEvent
//
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.




function Game_ItemEvent() {
    this.initialize.apply(this, arguments);
}



Game_ItemEvent.prototype = Object.create(Game_Event.prototype);
Game_ItemEvent.prototype.constructor = Game_ItemEvent;

Game_ItemEvent.prototype.initialize = function(mapId, xPos, yPos, dbEventId, dbEventData, eventId) {
    Game_Character.prototype.initialize.call(this);
    this._dbEventId = dbEventId;
    this._dbEventData=dbEventData;
    this._mapId = mapId;
    this._eventId = eventId;
    this.locate(xPos, yPos);
    this.refresh();
    
};

Game_ItemEvent.prototype.setupPage=function(){
    Game_Event.prototype.setupPage.call(this);
}
Game_ItemEvent.prototype.hasOtherEventOver=function(){
    var eventsHere=$gameMap.eventsXy(this.x, this.y);
    var slf=this;
    return eventsHere.filter(function(eE){
        return eE.eventId!=slf.eventId;
    }).length>0;
}
Game_ItemEvent.prototype.hasPlayerOver=function(){
    return $gamePlayer.x==this.x && $gamePlayer.y==this.y;
}
Game_ItemEvent.prototype.hasSomethingOver=function(){
    return this.hasPlayerOver()||this.hasOtherEventOver();
}
Game_ItemEvent.prototype.event = function() {
    return window["$dataMap_"+PD.Generator.Parameters.ItemEventMapId].events[this._dbEventId];
};
Game_ItemEvent.prototype.initMembers = function() {
    Game_Event.prototype.initMembers.call(this);
};

Game_ItemEvent.prototype.dbEventId = function() {
    return this._dbEventId;
};
Game_ItemEvent.prototype.dbEventData = function() {
    return this._dbEventData;
};