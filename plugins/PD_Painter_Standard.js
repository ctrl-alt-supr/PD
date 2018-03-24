if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.Standard=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painters.Standard.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.Standard.prototype.constructor=PD.Generator.Dungeon.Painters.Standard;

    PD.Generator.Dungeon.Painters.Standard.prototype.paint=function(dungeonGenerator, room){
        
        if (PD.Helpers.randomInteger( 1 ) == 0) {
            switch (PD.Helpers.randomInteger( 2 )) {
                case 0:
                    this.paintBurned(dungeonGenerator, room);
                    return;
                    break;
                case 1:
                    if (Math.max( room.width(), room.height() ) >= 4) {
                        this.paintStriped(dungeonGenerator, room);
                        return;
                    }
                    break;
                case 2:
                    if ( room.width()>= 6 && room.height()>= 6 ) {
                        this.paintStudy(dungeonGenerator, room);
                        return;
                    }
                    break;
                default:
                    break;
            }
            if (PD.Helpers.randomInteger( 1 ) == 0) {
                this.paintBurned(dungeonGenerator, room);
                return;
            }else{
                this.paintStriped(dungeonGenerator, room);
                return;
            }
        }
        var floorTile=PD.Tiles.name2id("ROOMFLOOR");
        this.fillByRectWithOffset( dungeonGenerator, room, 1, floorTile );
    }
    PD.Generator.Dungeon.Painters.Standard.prototype.paintBurned=function(dungeonGenerator, room) {
        var wallTile=PD.Tiles.name2id("WALL");
        this.fillByRect( dungeonGenerator, room, wallTile );
        var floorTile=PD.Tiles.name2id("ROOMFLOOR");
        var trapTile=PD.Tiles.name2id("TRAPFIRE");
        var ttrapTile=PD.Tiles.name2id("TRAPTRIGGERED");
        var emberTile=PD.Tiles.name2id("EMBERS");
        for (var i= room.top + 1; i < room.bottom; i++) {
			for (var j=room.left + 1; j < room.right; j++) {
				var t = emberTile;
				switch (PD.Helpers.randomInteger( 4 )) {
                case 0:
                    t = floorTile;
                    this.setByCoord(dungeonGenerator, j, i, t);
                    break;
                case 1:
                    t = trapTile;
                    this.setByCoord(dungeonGenerator, j, i, t);
                    break;
                case 2:
                    t = ttrapTile;
                    this.setByCoord(dungeonGenerator, j, i, t);
                    break;
                default:
                    this.setByCoord(dungeonGenerator, j, i, t);
                    break;
                }
			}
		}
    }
    PD.Generator.Dungeon.Painters.Standard.prototype.paintStriped=function(dungeonGenerator, room) {
        var wallTile=PD.Tiles.name2id("WALL");
        var grassTile=PD.Tiles.name2id("GRASS");
        var trampledGrassTile=PD.Tiles.name2id("TRAMPLEDGRASS");
        var floorSpTile=PD.Tiles.name2id("FLOORSP");
        this.fillByRect( dungeonGenerator, room, wallTile );
        this.fillByRectWithOffset( dungeonGenerator, room, 1, floorSpTile);
        if (room.width() > room.height()) {
            for (var i=room.left + 2; i < room.right; i += 2) {
				this.fill( dungeonGenerator, i, room.top + 1, 1, room.height() - 1, grassTile );
			}
        }else{
            for (var i=room.top + 2; i < room.bottom; i += 2) {
				this.fill( dungeonGenerator, room.left + 1, i, room.width() - 1, 1, grassTile );
			}
        }
    }
    PD.Generator.Dungeon.Painters.Standard.prototype.paintStudy=function(dungeonGenerator, room) {
        var wallTile=PD.Tiles.name2id("WALL");
        var bookTile=PD.Tiles.name2id("BOOKSHELF");
        var floorSpTile=PD.Tiles.name2id("FLOORSP");
        var pedestalTile=PD.Tiles.name2id("PEDESTAL");
        var floorTile=PD.Tiles.name2id("ROOMFLOOR");
        this.fillByRect( dungeonGenerator, room, wallTile );
        this.fill( dungeonGenerator, room.left + 1, room.top + 1, room.width() - 1, room.height() - 1 , bookTile );
        this.fill( dungeonGenerator, room.left + 2, room.top + 2, room.width() - 3, room.height() - 3 , floorSpTile );
        var connectedDoors=room.connected.map(function(ea){
            return ea.door;
        });
        for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
            var door = connectedDoors[doorIndex];
            if (door.x == room.left) {
                this.setByCoord( dungeonGenerator, door.x + 1, door.y, floorTile );  //Clear the tile next to the door
                if(door.y<=room.top+1){ //If the door is placed on top left corner, we should also clear the tile down
                    this.setByCoord( dungeonGenerator, door.x + 1, door.y + 1, floorTile );
                }
                if(door.y>=room.bottom-1){ //If the door is placed on bottom left corner, we should also clear the tile up
                    this.setByCoord( dungeonGenerator, door.x + 1, door.y - 1, floorTile );
                }
			} else if (door.x == room.right) {
                this.setByCoord( dungeonGenerator, door.x - 1, door.y, floorTile );   //Clear the tile next to the door
                if(door.y<=room.top+1){ //If the door is placed on top right corner, we should also clear the tile down
                    this.setByCoord( dungeonGenerator, door.x - 1, door.y + 1, floorTile );
                }
                if(door.y>=room.bottom-1){ //If the door is placed on bottom right corner, we should also clear the tile up
                    this.setByCoord( dungeonGenerator, door.x - 1, door.y - 1, floorTile );
                }
			} else if (door.y == room.top) {
                this.setByCoord( dungeonGenerator, door.x, door.y + 1, floorTile );           //Clear the tile next to the door
                if(door.x<=room.left+1){ //If the door is placed on top left corner, we should also clear the tile on the right
                    this.setByCoord( dungeonGenerator, door.x+1 , door.y + 1, floorTile );
                }
                if(door.x>=room.right-1){ //If the door is placed on top right corner, we should also clear the tile on the left
                    this.setByCoord( dungeonGenerator, door.x-1 , door.y + 1, floorTile );
                }
			} else if (door.y == room.bottom) {
                this.setByCoord( dungeonGenerator, door.x , door.y - 1, floorTile );          //Clear the tile next to the door
                if(door.x<=room.left+1){ //If the door is placed on bottom left corner, we should also clear the tile on the right
                    this.setByCoord( dungeonGenerator, door.x+1 , door.y - 1, floorTile );
                }
                if(door.x>=room.right-1){ //If the door is placed on bottom right corner, we should also clear the tile on the left
                    this.setByCoord( dungeonGenerator, door.x-1 , door.y - 1, floorTile );
                }
			}	
        }
        var cPoint=room.center();
        this.setByCoord( dungeonGenerator, cPoint.x, cPoint.y, pedestalTile );
    }
}


