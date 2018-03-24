if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.WeakFloor=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painters.WeakFloor.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.WeakFloor.prototype.constructor=PD.Generator.Dungeon.Painters.WeakFloor;

    PD.Generator.Dungeon.Painters.WeakFloor.prototype.paint=function(dungeonGenerator, room){
        var door=room.connected.map(function(ea){
            return ea.door;
        })[0];
        var wallTile=PD.Tiles.name2id("WALL");
        var voidTile=PD.Tiles.name2id("VOID");
        var floorSpTile=PD.Tiles.name2id("FLOORSP");
        this.fillByRect(dungeonGenerator,  room, wallTile)
        this.fillByRectWithOffset(dungeonGenerator,  room, 1, voidTile)
        if (door.x == room.left) {
			for (var i=room.top + 1; i < room.bottom; i++) {
				this.drawInside( dungeonGenerator, room, new PD.Generator.Dungeon.Point( room.left, i ), PD.Helpers.randomInteger( 1, room.width() - 2 ), floorSpTile );
			}
		} else if (door.x == room.right) {
			for (var i=room.top + 1; i < room.bottom; i++) {
				this.drawInside( dungeonGenerator, room, new PD.Generator.Dungeon.Point( room.right, i ), PD.Helpers.randomInteger( 1, room.width() - 2 ), floorSpTile );
			}
		} else if (door.y == room.top) {
			for (var i=room.left + 1; i < room.right; i++) {
				this.drawInside( dungeonGenerator, room, new PD.Generator.Dungeon.Point( i, room.top ), PD.Helpers.randomInteger( 1, room.height() - 2 ), floorSpTile );
			}
		} else if (door.y == room.bottom) {
			for (var i=room.left + 1; i < room.right; i++) {
				this.drawInside( dungeonGenerator, room, new PD.Generator.Dungeon.Point( i, room.bottom ), PD.Helpers.randomInteger( 1, room.height() - 2 ), floorSpTile );
			}
		}
    }
}


