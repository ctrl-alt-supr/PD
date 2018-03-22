if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.Entrance=function(){};
    PD.Generator.Dungeon.Painters.Entrance.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.Entrance.prototype.constructor=PD.Generator.Dungeon.Painters.Entrance;

    PD.Generator.Dungeon.Painters.Entrance.prototype.paint=function(dungeonGenerator, room){
        var floorTile=PD.Tiles.name2id("ROOMFLOOR");
        var wallTile=PD.Tiles.name2id("WALL");
        this.fillByRect( dungeonGenerator, room, wallTile );
        this.fillByRectWithOffset( dungeonGenerator, room, 1, floorTile );
        var stairsTile=PD.Tiles.name2id("UPSTAIRS");
        var stairsPos=room.random(1);
        this.setByPoint(dungeonGenerator, stairsPos, stairsTile);
    }
}