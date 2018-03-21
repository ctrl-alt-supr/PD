if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.SimpleTunnel;
    PD.Generator.Dungeon.Painters.SimpleTunnel=function(){
        throw new Error('This is a static class');
    }
    Object.assign(PD.Generator.Dungeon.Painters.SimpleTunnel, PD.Generator.Dungeon.Painter);
    PD.Generator.Dungeon.Painters.SimpleTunnel.prototype.paint=function(dungeonGenerator, room){
        var floor=PD.Tiles.name2id("ROOMFLOOR");
        var centerPoint=room.center();
        if(room.width()>room.height()  ||  (room.width()==room.height() && PD.Helpers.randomInteger(2)==0)){
            var from = room.rigth -1;
            var to=room.left+1;
            var connectedDoors=room.connected.map(function(ea){
                return ea.door;
            });
            for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
                var door = connectedDoors[doorIndex];
                var step=door.y<centerPoint.y?+1:-1;
                if(door.x==room.left){
                    from=room.left+1;
                    for (var i = door.y; i !=centerPoint.y; i++) {
                        this.set(dungeonGenerator, from, i, floor);
                    }
                }else if(door.x==room.rigth){
                    to=room.rigth-1;
                    for (var i = door.y; i !=centerPoint.y; i++) {
                        this.set(dungeonGenerator, to, i, floor);
                    }
                }else{
                    if(door.x<from){
                        from=door.x;
                    }
                    if(door.x>to){
                        to=door.x;
                    }
                    for (var i = door.y+step; i !=centerPoint.y; i+=step) {
                        this.set(dungeonGenerator, door.x, i, floor);
                    }
                }
            }
            for (var i=from; i <= to; i++) {
				this.set( dungeonGenerator, i, centerPoint.y, floor );
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
                    for (var i = door.x; i !=centerPoint.x; i++) {
                        this.set(dungeonGenerator, i, from, floor);
                    }
                }else if(door.y==room.bottom){
                    to=room.bottom-1;
                    for (var i = door.x; i !=centerPoint.x; i++) {
                        this.set(dungeonGenerator, i, to, floor);
                    }
                }else{
                    if(door.y<from){
                        from=door.y;
                    }
                    if(door.y>to){
                        to=door.y;
                    }
                    for (var i = door.x+step; i !=centerPoint.x; i+=step) {
                        this.set(dungeonGenerator, i, door.y, floor);
                    }
                }
            }
            for (var i=from; i <= to; i++) {
				this.set( dungeonGenerator, centerPoint.x, i, floor );
			}
        }
        
    }
}