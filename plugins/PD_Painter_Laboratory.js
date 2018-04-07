if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.Laboratory=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painters.Laboratory.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.Laboratory.prototype.constructor=PD.Generator.Dungeon.Painters.Laboratory;

    PD.Generator.Dungeon.Painters.Laboratory.prototype.paint=function(dungeonGenerator, room){
        var floorTile=PD.Tiles.name2id("FLOORSP");
        var wallTile=PD.Tiles.name2id("WALL");
        var potTile=PD.Tiles.name2id("ALCHEMYPOT");
        this.fillByRect( dungeonGenerator, room, wallTile );
        this.fillByRectWithOffset( dungeonGenerator, room, 1, floorTile );
        var door=room.connected.map(function(ea){
            return ea.door;
        })[0];
        var potPos=null;
        if(door.x==room.left){
            potPos=new PD.Generator.Dungeon.Point(room.right-1, PD.Helpers.randomInteger(1)==0?room.top+1:room.bottom-1);
        }else if(door.x==room.right){
            potPos=new PD.Generator.Dungeon.Point(room.left+1, PD.Helpers.randomInteger(1)==0?room.top+1:room.bottom-1);
        }else if(door.y==room.top){
            potPos=new PD.Generator.Dungeon.Point(PD.Helpers.randomInteger(1)==0?room.left+1:room.right-1, room.bottom-1);
        }else if(door.y==room.bottom){
            potPos=new PD.Generator.Dungeon.Point(PD.Helpers.randomInteger(1)==0?room.left+1:room.right-1, room.top+1);
        }
        this.setByPoint(dungeonGenerator, potPos, potTile); 
        var n=PD.Helpers.randomInteger(1,3);
        var tryes=0;
        for (var i = 0; i < n; i++) {
            var prize=this.prize(dungeonGenerator, room);
            var pos=null;
            do{
                pos=room.random();
            }while(dungeonGenerator.getTileId(pos.x,pos.y)!=floorTile);
            dungeonGenerator.addItemToSpawnAt(prize.itemId, pos);
        }
        var connectedDoors=room.connected.map(function(ea){
            return ea.door;
        });
        for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
            var door = connectedDoors[doorIndex];
            door.type(PD.Generator.Dungeon.Door.Type.LOCKED);
        }
    }
    PD.Generator.Dungeon.Painters.Laboratory.prototype.prize=function(dungeonGenerator, room){
        return PD.Item.randomItem("POTIONS");
    }
}


