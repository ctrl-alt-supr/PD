if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.SimplePassage=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painters.SimplePassage.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.SimplePassage.prototype.constructor=PD.Generator.Dungeon.Painters.SimplePassage;

    PD.Generator.Dungeon.Painters.SimplePassage.pasW=0;
    PD.Generator.Dungeon.Painters.SimplePassage.pasH=0;
    PD.Generator.Dungeon.Painters.SimplePassage.prototype.paint=function(dungeonGenerator, room){
        console.log("Using simple!!");
        PD.Generator.Dungeon.Painters.SimplePassage.pasW=room.width()-2;
        PD.Generator.Dungeon.Painters.SimplePassage.pasH=room.height()-2;
        var floor=PD.Tiles.name2id("ROOMFLOOR");
        var joints=[];
        var connectedDoors=room.connected.map(function(ea){
            return ea.door;
        });
        for (var doorIndex = 0; doorIndex < connectedDoors.length; doorIndex++) {
            var cdoor = connectedDoors[doorIndex];
            joints.push(this._xy2p(room, cdoor));
        }
        var nJoints=joints.length;
        var perimeter=PD.Generator.Dungeon.Painters.SimplePassage.pasW*2+PD.Generator.Dungeon.Painters.SimplePassage.pasH*2;
        var start = 0;
		var maxD = joints[0] + perimeter - joints[nJoints - 1];
		for (var i=1; i < nJoints; i++) {
			var d = joints[i] - joints[i-1];
			if (d > maxD) {
				maxD = d;
				start = i;
			}
        }
        var end = ((start+nJoints-1) % nJoints);
        var p=joints[start];
        do{
            this.setByPoint(dungeonGenerator, this._p2xy(room, p), floor);
            p=((p+1)%perimeter);
        }while(p!=joints[end]);

        this.setByPoint(dungeonGenerator, this._p2xy(room, p), floor);

        //this.fillByRect( dungeonGenerator, room, PD.Tiles.name2id("WALL") );
		//this.fillByRectOff( dungeonGenerator, room, 1, PD.Tiles.name2id("ROOMFLOOR") );
    }
    PD.Generator.Dungeon.Painters.SimplePassage._xy2p=function(room, xyPoint ) {
		if (xyPoint.y == room.top) {
			
			return (xyPoint.x - room.left - 1);
			
		} else if (xyPoint.x == room.right) {
			
			return (xyPoint.y - room.top - 1) + PD.Generator.Dungeon.Painters.SimplePassage.pasW;
			
		} else if (xyPoint.y == room.bottom) {
			
			return (room.right - xyPoint.x - 1) + PD.Generator.Dungeon.Painters.SimplePassage.pasW + PD.Generator.Dungeon.Painters.SimplePassage.pasH;
			
		} else /*if (xyPoint.x == room.left)*/ {
			
			if (xyPoint.y == room.top + 1) {
				return 0;
			} else {
				return (room.bottom - xyPoint.y - 1) + PD.Generator.Dungeon.Painters.SimplePassage.pasW * 2 + PD.Generator.Dungeon.Painters.SimplePassage.pasH;
			}
			
		}
	}
	
	PD.Generator.Dungeon.Painters.SimplePassage._p2xy=function( room, p ) {
		if (p < PD.Generator.Dungeon.Painters.SimplePassage.pasW) {
			
			return new PD.Generator.Dungeon.Point( room.left + 1 + p, room.top + 1);
			
		} else if (p < PD.Generator.Dungeon.Painters.SimplePassage.pasW + PD.Generator.Dungeon.Painters.SimplePassage.pasH) {
			
			return new PD.Generator.Dungeon.Point( room.right - 1, room.top + 1 + (p - PD.Generator.Dungeon.Painters.SimplePassage.pasW) );
			
		} else if (p < PD.Generator.Dungeon.Painters.SimplePassage.pasW * 2 + PD.Generator.Dungeon.Painters.SimplePassage.pasH) {
			
			return new PD.Generator.Dungeon.Point( room.right - 1 - (p - (PD.Generator.Dungeon.Painters.SimplePassage.pasW + PD.Generator.Dungeon.Painters.SimplePassage.pasH)), room.bottom - 1 );
			
		} else {

			return new PD.Generator.Dungeon.Point( room.left + 1, room.bottom - 1 - (p - (PD.Generator.Dungeon.Painters.SimplePassage.pasW * 2 + PD.Generator.Dungeon.Painters.SimplePassage.pasH)) );
			
		}
	}
}