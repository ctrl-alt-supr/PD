if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.SimplestTunnel=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painters.SimplestTunnel.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.SimplestTunnel.prototype.constructor=PD.Generator.Dungeon.Painters.SimplestTunnel;
    PD.Generator.Dungeon.Painters.SimplestTunnel.prototype.paint=function(dungeonGenerator, room){
        var floor=PD.Tiles.name2id("ROOMFLOOR");
        var centerPoint=room.center();
        //this.fillByRect( dungeonGenerator, room, 0 );
        this.setByCoord( dungeonGenerator, centerPoint.x, centerPoint.y, "X" );
        if(room.width()>room.height()   ||  (room.width()==room.height() && PD.Helpers.randomInteger(1)==0)){       //Si la sala es más ancha que alta
            var connectedDoors=room.connected.map(function(ea){
                return ea.door;
            });
            var from=room.right-1;
            var to=room.left+1;
            for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {                               //Por cada puerta
                var door = connectedDoors[doorIndex];
                var stepY = door.y<centerPoint.y?+1:-1;
                var stepX = door.x<centerPoint.x?+1:-1;
                if (door.x == room.left || door.x==room.right) {                                                                          //Si la puerta está al lado izquierdo de la habitacion
                    for (var i = door.y; (i!=centerPoint.y); i+=stepY) {
                        this.setByCoord( dungeonGenerator, door.x, i, "z" );
                    }
                    for (var i = door.x; (i!=centerPoint.x); i+=stepX) {
                        this.setByCoord( dungeonGenerator, i, door.y, "Z" );
                    }
                
                }else{                                                                                              //Si la puerta está al lado norte o sur de la habitación
                    
                }
            }
        }
    }
}