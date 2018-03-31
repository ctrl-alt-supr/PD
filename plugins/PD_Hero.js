
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



PD.Hero.canCarry=function(item){

}
PD.Hero.turnBagOwnershipSwitches=function(bagType){
    //In order to automatically turn on the owning a bag switch whenever the bag is found in the backpack even if user doesn't explicitilly turn it on, we do this.
    var isBagItemInBackpack=$gameParty.items().filter(function(i){
        return i.id==PD.Item.Bags[bagType-1];
    }).length>0;
    if(isBagItemInBackpack && !$gameSwitches.value(PD.Item.BagSwitches[bagType])){
        $gameSwitches.setValue(PD.Item.BagSwitches[bagType], true)
    }
}
PD.Hero.hasBag=function(bagType){
    if(bagType==0){
        return true;
    }
    this.turnBagOwnershipSwitches(bagType);
    return $gameSwitches.value(PD.Item.BagSwitches[bagType]);
}
PD.Hero.isBagAvailable=function(bagType){
    if(bagType==0){
        return true;
    }
    this.turnBagOwnershipSwitches(bagType);
    var isBagItemInBackpack=$gameParty.items().filter(function(i){
        return i.id==PD.Item.Bags[bagType-1];
    }).length>0;
    return $gameSwitches.value(PD.Item.BagSwitches[bagType]) && isBagItemInBackpack;
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


