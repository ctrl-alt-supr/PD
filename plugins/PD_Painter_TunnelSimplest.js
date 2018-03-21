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
        this.setByCoord( dungeonGenerator, centerPoint.x, centerPoint.y, "z" );
    }
}