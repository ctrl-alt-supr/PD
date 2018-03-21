if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters.Simple=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painters.Simple.prototype=Object.create(PD.Generator.Dungeon.Painter.prototype);
    PD.Generator.Dungeon.Painters.Simple.prototype.constructor=PD.Generator.Dungeon.Painters.Simple;

    PD.Generator.Dungeon.Painters.Simple.prototype.paint=function(dungeonGenerator, room){
        this.fillByRect( dungeonGenerator, room, PD.Tiles.name2id("WALL") );
		this.fillByRectOff( dungeonGenerator, room, 1, PD.Tiles.name2id("ROOMFLOOR") );
    }
}