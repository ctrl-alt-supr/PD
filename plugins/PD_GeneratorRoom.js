/*:
 * @plugindesc G3 - Class that represents the rooms the generator creates
 * @author Alex
 *
 * @help Place AFTER PD_GeneratorRect!!!
 * */
if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD => PD_GeneratorRoom is meant to be imported AFTER PD_Generator!");
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
    PD.Generator.Dungeon.Room=function(l, t, r, b){
        PD.Generator.Dungeon.ARect.prototype.constructor.call(this, l, t, r, b)
        this._distance=0;
        this._price=1;
        this._neigbours=[];
        this.connected=[];
        this._type=null;
        this.GUID=Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)+Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    PD.Generator.Dungeon.Room.prototype = Object.create(PD.Generator.Dungeon.ARect.prototype);
    PD.Generator.Dungeon.Room.prototype.constructor = PD.Generator.Dungeon.Room;
    PD.Generator.Dungeon.Room.prototype.addNeigbour=function( otherRoom ) {
		var intersectRect = this.intersect( otherRoom );
		if ((intersectRect.width() == 0 && intersectRect.height() >= 3) || 
			(intersectRect.height() == 0 && intersectRect.width() >= 3)) {
                this._neigbours.push( otherRoom );
			    otherRoom._neigbours.push( this );
		}
    }
    PD.Generator.Dungeon.Room.prototype.type=function(type){
        if(type==undefined || type==null) return this._type;
        this._type=type;
    }
    PD.Generator.Dungeon.Room.prototype.neigbours=function() {
		return this._neigbours;
    }
    PD.Generator.Dungeon.Room.prototype.distance=function(newDist) {
        if(newDist==undefined||newDist==null) return this._distance;
		this._distance=newDist;
    }
    PD.Generator.Dungeon.Room.prototype.price=function(newPrice) {
        if(newPrice==undefined||newPrice==null) return this._price;
		this._price=newPrice;
    }
    PD.Generator.Dungeon.Room.prototype.center=function() {
		return new PD.Generator.Dungeon.Point( 
			Math.floor((this.left + this.right) / 2 + (((this.right - this.left) & 1) == 1 ? PD.Helpers.randomInteger( 1 ) : 0)),
            Math.floor((this.top + this.bottom) / 2 + (((this.bottom - this.top) & 1) == 1 ? PD.Helpers.randomInteger( 1 ) : 0)) 
        );
	}
    PD.Generator.Dungeon.Room.prototype.connect=function( otherRoom ) {
		if (!(this.connected.map(function(e) { return e.room.GUID; }).indexOf(otherRoom.GUID)>-1)) {	
			this.connected.push( {room:otherRoom, door:null} );
			otherRoom.connected.push( {room:this, door:null} );			
		}
    }
    PD.Generator.Dungeon.Room.prototype.random=function( offset ) {
        if(offset==undefined || offset==null){
            offset=0;
        }
        var x=PD.Helpers.randomInteger(this.left + 1 + offset, this.right -1 - offset);
        var y=PD.Helpers.randomInteger(this.top + 1 + offset, this.bottom -1 - offset);
        return new PD.Generator.Dungeon.Point(x, y);
	}
    /**
     * @class A door
     * @extends PD.Generator.Dungeon.Point
     */
    PD.Generator.Dungeon.Door=function(x, y){
        PD.Generator.Dungeon.Point.prototype.constructor.call(this, x, y);
        this.GUID=Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)+Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        this._type=PD.Generator.Dungeon.Door.Type.EMPTY;
    }
    PD.Generator.Dungeon.Door.prototype = Object.create(PD.Generator.Dungeon.Point.prototype);
    PD.Generator.Dungeon.Door.prototype.constructor = PD.Generator.Dungeon.Door;
    PD.Generator.Dungeon.Door.Type={
        EMPTY:0, 
        TUNNEL:1, 
        REGULAR:2, 
        UNLOCKED:3, 
        HIDDEN:4, 
        BARRICADE:5, 
        LOCKED:6
    };
    PD.Generator.Dungeon.Door.prototype.type=function(t){
        if(t!=undefined && t!=null){
            this._type=t;
        }
        return this._type;
    }
    
    /**
     * @enum {number} 
     * @readonly
     * @description Enum for room types
     */
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
    PD.Generator.Dungeon.Room.Type.getName=function(typeToGet){
        for (var property in PD.Generator.Dungeon.Room.Type) {
            if (PD.Generator.Dungeon.Room.Type.hasOwnProperty(property)) {
                if(PD.Generator.Dungeon.Room.Type[property]==typeToGet){
                    return property;
                }
            }
        }
        return null;
    }
    PD.Generator.Dungeon.Room.Type.getPainter=function(typeToGet){
        
        if(typeToGet==PD.Generator.Dungeon.Room.Type.TUNNEL){
            return  new PD.Generator.Dungeon.Painters.Tunnel();
        }
        if(typeToGet==PD.Generator.Dungeon.Room.Type.STANDARD){
            return  new PD.Generator.Dungeon.Painters.Standard();
        }
        if(typeToGet==PD.Generator.Dungeon.Room.Type.ENTRANCE){
            return  new PD.Generator.Dungeon.Painters.Entrance();
        }
        if(typeToGet==PD.Generator.Dungeon.Room.Type.EXIT){
            return  new PD.Generator.Dungeon.Painters.Exit();
        }
        if(typeToGet==PD.Generator.Dungeon.Room.Type.WEAK_FLOOR){
            return  new PD.Generator.Dungeon.Painters.WeakFloor();
        }
        if(typeToGet==PD.Generator.Dungeon.Room.Type.LABORATORY){
            return  new PD.Generator.Dungeon.Painters.Laboratory();
        }
        // }else if(typeToGet==PD.Generator.Dungeon.Room.Type.PASSAGE){
        //     return  PD.Generator.Dungeon.Painters.SimplePassage;
        // }
        return  new PD.Generator.Dungeon.Painters.Simple();
    }
}
