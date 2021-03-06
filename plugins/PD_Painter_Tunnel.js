if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.Tunnel=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painters.Tunnel.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.Tunnel.prototype.constructor=PD.Generator.Dungeon.Painters.Tunnel;
    PD.Generator.Dungeon.Painters.Tunnel.prototype.paint=function(dungeonGenerator, room){
        var floor=PD.Tiles.name2id("ROOMFLOOR");
        var centerPoint=room.center();
        if(room.width()>room.height()  ||  (room.width()==room.height() && PD.Helpers.randomInteger(1)==0)){
            var from = room.right -1;
            var to=room.left+1;
            var connectedDoors=room.connected.map(function(ea){
                return ea.door;
            });
            for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
                var door = connectedDoors[doorIndex];
                var step=door.y<centerPoint.y?+1:-1;
                if(door.x==room.left){
                    from=room.left+1;
                    for (var i = door.y; i !=centerPoint.y; i+=step) {
                        this.setByCoord(dungeonGenerator, from, i, floor);
                    }
                }else if(door.x==room.right){
                    to=room.right-1;
                    for (var i = door.y; i !=centerPoint.y; i+=step) {
                        this.setByCoord(dungeonGenerator, to, i, floor);
                    }
                }else{
                    if(door.x<from){
                        from=door.x;
                    }
                    if(door.x>to){
                        to=door.x;
                    }
                    if(door.y!=centerPoint.y){
                        for (var i = door.y+step; i !=centerPoint.y; i+=step) {
                            this.setByCoord(dungeonGenerator, door.x, i, floor);
                            if(Math.abs(i-centerPoint.y)>=50){
                                debugger;
                            }
                        }
                    }else{
                        this.setByCoord(dungeonGenerator, door.x, door.y+step, floor);
                    }
                }
            }
            for (var i=from; i <= to; i++) {
				this.setByCoord( dungeonGenerator, i, centerPoint.y, floor );
			}
        }else{
            var from = room.bottom -1;
            var to=room.top+1;
            var connectedDoors=room.connected.map(function(ea){
                return ea.door;
            });
            for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
                var door = connectedDoors[doorIndex];
                var step=door.x<centerPoint.x?+1:-1;
                if(door.y==room.top){
                    from=room.top+1;
                    for (var i = door.x; i !=centerPoint.x; i+=step) {
                        this.setByCoord(dungeonGenerator, i, from, floor);
                    }
                }else if(door.y==room.bottom){
                    to=room.bottom-1;
                    for (var i = door.x; i !=centerPoint.x; i+=step) {
                        this.setByCoord(dungeonGenerator, i, to, floor);
                    }
                }else{
                    if(door.y<from){
                        from=door.y;
                    }
                    if(door.y>to){
                        to=door.y;
                    }
                    if(door.x!=centerPoint.x){
                        for (var i = door.x+step; i !=centerPoint.x; i+=step) {
                            this.setByCoord(dungeonGenerator, i, door.y, floor);
                            if(Math.abs(i-centerPoint.x)>=50){
                                debugger;
                            }
                        }
                    }else{
                        this.setByCoord(dungeonGenerator, door.x+step, door.y, floor);
                    }   
                }
            }
            for (var i=from; i <= to; i++) {
				this.setByCoord( dungeonGenerator, centerPoint.x, i, floor );
			}
        }
        // var connectedDoors=room.connected.map(function(ea){
        //     return ea.door;
        // });
        // for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
        //     var door = connectedDoors[doorIndex];
        //     door.type(PD.Generator.Dungeon.Door.Type.TUNNEL);
        // }
    }
}