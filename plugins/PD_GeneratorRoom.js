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


    PD.Generator.Dungeon.Room.Type={
        STANDARD	: 0,
		ENTRANCE	: 1,
		EXIT		: 2,
		BOSS_EXIT	: 3,
		TUNNEL		: 4,
		PASSAGE		: 5,
		SHOP		: 6,
		BLACKSMITH	: 7,
		TREASURY	: 8,
		ARMORY		: 9,
		LIBRARY		: 10,
		LABORATORY	: 11,
		VAULT		: 12,
		TRAPS		: 13,
		STORAGE		: 14,
		MAGIC_WELL	: 15,
		GARDEN		: 16,
		CRYPT		: 17,
		STATUE		: 18,
		POOL		: 19,
		RAT_KING	: 20,
		WEAK_FLOOR	: 21,
		PIT			: 22,
		ALTAR		: 23
    }
}
