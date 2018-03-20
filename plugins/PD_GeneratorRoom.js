if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorRoom is meant to be imported AFTER PD_Generator!");
} else{
    /**
     * @class A room
     * @extends PD.Generator.Dungeon.ARect
     * 
     * @property {PD.Generator.Dungeon.Room[]} neigbours
     * @property {Object[]} connected
     * @property {PD.Generator.Dungeon.Room} connected.room
     * @property {PD.Generator.Dungeon.Door} connected.door
     */
    PD.Generator.Dungeon.Room=function(x, y){
        PD.Generator.Dungeon.ARect.prototype.create.call(this, x, y);
        this.neigbours=[];
        this.connected=[];
    }
    PD.Generator.Dungeon.Door.prototype = Object.create(PD.Generator.Dungeon.ARect.prototype);
    PD.Generator.Dungeon.Door.prototype.constructor = PD.Generator.Dungeon.Room;

    /**
     * @class A door
     * @extends PD.Generator.Dungeon.Point
     */
    PD.Generator.Dungeon.Door=function(x, y){
        PD.Generator.Dungeon.Point.prototype.create.call(this, x, y);
        this.type=null;
    }
    PD.Generator.Dungeon.Door.prototype = Object.create(PD.Generator.Dungeon.Point.prototype);
    PD.Generator.Dungeon.Door.prototype.constructor = PD.Generator.Dungeon.Door;
    PD.Generator.Dungeon.Door.prototype.set=function(type){
        this.type=type;
    }
}
