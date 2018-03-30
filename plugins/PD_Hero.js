
PD=PD||{};
PD.Hero={
    class:null,
    level:1,
    hp:20,
    ht:20,
    exp:0,
    str:10,
    atk:10,
    def:5
}
PD.Hero.reset=function(){
    PD.Hero.class=null;
    PD.Hero.level=1;
    PD.Hero.hp=20;
    PD.Hero.ht=20;
    PD.Hero.exp=0;
    PD.Hero.str=10;
    PD.Hero.atk=10;
    PD.Hero.def=5;
    $gameParty.setupStartingMembers();
}
PD.Hero.InventoryBagType={
    BACKPACK:0,
    KEYRING:1,
    SEEDPOUCH:2,
    SCROLLHOLDER:3,
    WANDHOLSTER:4,
}


PD.Hero.hasBag=function(bagType){
    return true;
}

PD.Hero.bagSize=function(bagType){
    if(bagType==PD.Hero.InventoryBagType.BACKPACK){
        return 19;
    }else if(bagType==PD.Hero.InventoryBagType.KEYRING){
        return 12;
    }else if(bagType==PD.Hero.InventoryBagType.SEEDPOUCH){
        return 8;
    }else if(bagType==PD.Hero.InventoryBagType.SCROLLHOLDER){
        return 12;
    }else if(bagType==PD.Hero.InventoryBagType.WANDHOLSTER){
        return 12;
    }
}

Game_Actor.prototype.expForLevel = function(level) {
    if($gameMap!=undefined && $gameMap!=null && $gameMap.hasGeneratedDungeon()){
        return 5+PD.Hero.level*5;
    }
};
Game_Party.prototype.setupStartingMembers = function() {
    this._actors = [];
    if(PD.Hero.class==null){
        $dataSystem.partyMembers.forEach(function(actorId) {
            if ($gameActors.actor(actorId)) {
                this._actors.push(actorId);
            }
        }, this);
    }else{
        this._actors.push(PD.Hero.class+1);
    }
};