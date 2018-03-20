
if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters=[];
    PD.Generator.Dungeon.Painter=function(){
        throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painter.setByLinearPosition=function(dungeonGenerator, cell, val){
        
    }

    PD.Generator.Dungeon.Painter.setByCoord=function(dungeonGenerator, x, y, val){
        dungeonGenerator.setTileId(x, y, val);
    }

    PD.Generator.Dungeon.Painter.setByPoint=function(dungeonGenerator, point, val){
        this.setByCoord(dungeonGenerator, point.x, point.y,val);
    }

    PD.Generator.Dungeon.Painter.fill=function(dungeonGenerator, x, y, width, height, val){
        for (var ty = y; ty < y+height; ty++) {
            for (var tx = x; tx < x+width; tx++) {
                dungeonGenerator.setTileId(tx, ty, val);
            }
        }
    }
    PD.Generator.Dungeon.Painter.fillByRect=function(dungeonGenerator, rect, val){
        this.fill(dungeonGenerator, rect.left, rect.top, rect.width() + 1, rect.height() + 1, val);
    }
    PD.Generator.Dungeon.Painter.fillByRectOff=function(dungeonGenerator, rect, m, val){
        this.fill(dungeonGenerator, rect.left+m, rect.top+m, rect.width() + 1 -m*2, rect.height() + 1-m*2, val);
    }

}