if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.STunnel=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painters.STunnel.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.STunnel.prototype.constructor=PD.Generator.Dungeon.Painters.STunnel;
    PD.Generator.Dungeon.Painters.STunnel.prototype.paint=function(dungeonGenerator, room){
        var floor=PD.Tiles.name2id("ROOMFLOOR");
        var floorcenter=PD.Tiles.name2id("DECOFLOOR");
        var voidcenter=PD.Tiles.name2id("DECOWALL");
        var centerPoint=room.center();
        this.setByCoord(dungeonGenerator, centerPoint.x, centerPoint.y, voidcenter);
        //var pathFindingFinder=new PF.AStarFinder();
        var connectedDoors=room.connected.map(function(ea){
            return ea.door;
        });
        for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
            var door = connectedDoors[doorIndex];
            var isDoorNorthCenter=centerPoint.y<door.y;
            var isDoorSouthCenter=centerPoint.y>door.y;
            var isDoorLeftCenter=centerPoint.x<door.x;
            var isDoorRightCenter=centerPoint.x>door.x;
            var originY=centerPoint.y;
            var originX=centerPoint.x;
            var destY=door.y;
            var destX=door.x;
            if(centerPoint.x==originX && centerPoint.y==originY){
                this.setByCoord(dungeonGenerator, originX, originY, floorcenter);
            }else{
                this.setByCoord(dungeonGenerator, originX, originY, floor);
            }
            do{
                var diffY=originY-destY;
                var diffX=originX-destX;
                var incrY=0;
                var incrX=0;
                if(PD.Helpers.randomInteger(1)==0){
                    if(diffY<0){
                        incrY=1;
                    }else if(diffY>0){
                        incrY=-1;
                    }
                }else{
                    if(diffX<0){
                        incrX=1;
                    }else if(diffX>0){
                        incrX=-1;
                    }
                }
                originX=originX+incrX;
                originY=originY+incrY;
                if(centerPoint.x==originX && centerPoint.y==originY){
                    this.setByCoord(dungeonGenerator, originX, originY, floorcenter);
                }else{
                    this.setByCoord(dungeonGenerator, originX, originY, floor);
                }
            }while(originX!=destX || originY!=destY);
            this.setByCoord(dungeonGenerator, originX, originY, floorcenter);
        }
        
        //if (room.width() > room.height() || (room.width() === room.height() && PD.Helpers.randomInteger(1) === 0)) {
           // var connectedDoors=room.connected.map(function(ea){
                //return ea.door;
            //});
            //for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
                // var walkableMatrix=[];
                // for (var y = 0; y < dungeonGenerator._height; y++) {
                //     walkableMatrix[y]=[];
                //     for (var x = 0; x < dungeonGenerator._width; x++) {
                //         walkableMatrix[y][x]=1;
                //     }
                // }
                // for (var y2 =room.top; y2 < room.top+room.height();y2++) {
                //     for (var x2 =room.left;x2 < room.left+room.width(); x2++) {
                //         walkableMatrix[y2][x2]=0;
                //     }
                // }
                // var pathFindingGrid=new PF.Grid(walkableMatrix);

                // var door = connectedDoors[doorIndex];
                // var path = pathFindingFinder.findPath(door.x, door.y, centerPoint.x, centerPoint.y, pathFindingGrid.clone());
                // for (var index = 0; index < path.length; index++) {
                //     var pathEl = path[index];
                //     this.setByCoord(dungeonGenerator, pathEl[0], pathEl[1], floor);
                // }
           // }
        //}
    }
}