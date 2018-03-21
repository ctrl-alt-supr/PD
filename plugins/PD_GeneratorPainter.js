
/*:
 * @plugindesc G4 - Base class for other painters. It takes care of painting each room depending on the room type.
 * @author Alex
 *
 * @help Place AFTER PD_GeneratorRect!!!
 * */
if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorPainter is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.Painters=[];
    PD.Generator.Dungeon.Painter=function(){
        //throw new Error('This is a static class');
    }
    PD.Generator.Dungeon.Painter.prototype.constructor=PD.Generator.Dungeon.Painter;
    PD.Generator.Dungeon.Painter.prototype.setByLinearPosition=function(dungeonGenerator, cell, val){
        
    }

    PD.Generator.Dungeon.Painter.prototype.setByCoord=function(dungeonGenerator, x, y, val){
        dungeonGenerator.setTileId(x, y, val);
    }

    PD.Generator.Dungeon.Painter.prototype.setByPoint=function(dungeonGenerator, point, val){
        this.setByCoord(dungeonGenerator, point.x, point.y,val);
    }

    PD.Generator.Dungeon.Painter.prototype.fill=function(dungeonGenerator, x, y, width, height, val){
        for (var ty = y; ty < y+height; ty++) {
            for (var tx = x; tx < x+width; tx++) {
                dungeonGenerator.setTileId(tx, ty, val);
            }
        }
    }
    PD.Generator.Dungeon.Painter.prototype.fillByRect=function(dungeonGenerator, rect, val){
        this.fill(dungeonGenerator, rect.left, rect.top, rect.width() + 1, rect.height() + 1, val);
    }
    PD.Generator.Dungeon.Painter.prototype.fillByRectOff=function(dungeonGenerator, rect, m, val){
        this.fill(dungeonGenerator, rect.left+m, rect.top+m, rect.width() + 1 -m*2, rect.height() + 1-m*2, val);
    }
    PD.Generator.Dungeon.Painter.prototype.drawInside=function(dungeonGenerator, room, pointFrom, n, val){
        var stepPoint=new PD.Generator.Dungeon.Point();
        if(pointFrom.x==room.left){
            stepPoint.setByCoord(+1,0);
        }else if(pointFrom.x==room.right){
            stepPoint.setByCoord(-1,0);
        }else if(pointFrom.y==room.top){
            stepPoint.setByCoord(0,+1);
        }else if(pointFrom.y==room.bottom){
            stepPoint.setByCoord(0,-1);
        }

        var p=new PD.Generator.Dungeon.Point();
        p.setByPoint(pointFrom);
        p.offsetByPoint(stepPoint);
        for (var i = 0; i < n; i++) {
            if(val!=-1){
                dungeonGenerator.setTileId(p.x, p.y, val);
            }
            p.offsetByPoint(stepPoint);       
        }
        return p;
    }
    PD.Generator.Dungeon.Painter.prototype.paint=function(dungeonGenerator, room){
        console.log("You should override the paint method of this painter for it to function correctly!!");
    }
}