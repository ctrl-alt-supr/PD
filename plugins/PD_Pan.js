PD=PD||{};
PD.Pan={};
PD.Pan.lastInput=[null, null];
PD.Pan.Aliases={};
PD.Pan.donePan=false;
PD.Pan.isPanning=function(){
    return (PD.Pan.lastInput[0]!=null && PD.Pan.lastInput[1]!=null);
}
PD.Pan.centerInPlayer=function(){
    $gamePlayer.center($gamePlayer.x, $gamePlayer.y)
}

Scene_Map.prototype.updateDestination = function() {
    if (this.isMapTouchOk()) {
        this.processMapTouch();
    } else {
        $gameTemp.clearDestination();
        this._touchCount = 0;
    }
};

Scene_Map.prototype.isMapTouchOk = function() {
    return this.isActive() && $gamePlayer.canMove();
};
PD.Pan.Aliases.Scene_Map={};
PD.Pan.Aliases.Scene_Map.update=Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    PD.Pan.Aliases.Scene_Map.update.call(this);
    if(TouchInput.isReleased() || $gamePlayer.isMoving()){
        if(PD.Pan.isPanning()){
            if(PD.Pan.donePan){
                PD.Pan.donePan=false;
            }else{
                var x = $gameMap.canvasToMapX(PD.Pan.lastInput[0]);
                var y = $gameMap.canvasToMapY(PD.Pan.lastInput[1]);
                PD.Pan.centerInPlayer();
                $gameTemp.setDestination(x, y);
            }
            PD.Pan.lastInput=[null, null];
        }
    }
}

Scene_Map.prototype.processMapTouch = function() {
    if (TouchInput.isRepeated() || this._touchCount > 0) {
        if(!PD.Pan.isPanning()){
            PD.Pan.lastInput=[TouchInput.x, TouchInput.y];
        }else{
            if(PD.Pan.lastInput[0]<TouchInput.x){
                var dif=Math.max(0, TouchInput.x-PD.Pan.lastInput[0]);
                if(dif>0.1){
                    $gameMap.scrollLeft(0.02*dif);
                }
            }else if(PD.Pan.lastInput[0]>TouchInput.x){
                var dif=Math.max(0, PD.Pan.lastInput[0]-TouchInput.x);
                if(dif>0.1){
                    $gameMap.scrollRight(0.02*dif);
                }
            }
            if(PD.Pan.lastInput[1]<TouchInput.y){
                var dif=Math.max(0, TouchInput.y-PD.Pan.lastInput[1]);
                if(dif>0.1){
                    $gameMap.scrollUp(0.02*dif);
                }
            }else if(PD.Pan.lastInput[1]>TouchInput.y){
                var dif=Math.max(0, PD.Pan.lastInput[1]-TouchInput.y);
                if(dif>0.1){
                    $gameMap.scrollDown(0.02*dif);
                }
            }
            PD.Pan.lastInput=[TouchInput.x, TouchInput.y];
            PD.Pan.donePan=true;
        }
        // if (TouchInput.isPressed()) {
        //     if (this._touchCount === 0 || this._touchCount >= 15) {
        //         var x = $gameMap.canvasToMapX(TouchInput.x);
        //         var y = $gameMap.canvasToMapY(TouchInput.y);
        //         $gameTemp.setDestination(x, y);
        //     }
        //     this._touchCount++;
        // } else {
        //     this._touchCount = 0;
        // }
    }
};