if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.Exit=function(){};
    PD.Generator.Dungeon.Painters.Exit.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.Exit.prototype.constructor=PD.Generator.Dungeon.Painters.Exit;

    PD.Generator.Dungeon.Painters.Exit.prototype.paint=function(dungeonGenerator, room){
        var floorTile=PD.Tiles.name2id("ROOMFLOOR");
        var wallTile=PD.Tiles.name2id("WALL");
        this.fillByRect( dungeonGenerator, room, wallTile );
        this.fillByRectWithOffset( dungeonGenerator, room, 1, floorTile );
        var stairsTile=PD.Tiles.name2id("DOWNSTAIRS");
        var stairsPos=room.random(1);
        this.setByPoint(dungeonGenerator, stairsPos, stairsTile);
        dungeonGenerator._exitPoint=stairsPos;
        var connectedDoors=room.connected.map(function(ea){
            return ea.door;
        });
        for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
            var door = connectedDoors[doorIndex];
            door.type(PD.Generator.Dungeon.Door.Type.REGULAR);
        }
    }
}