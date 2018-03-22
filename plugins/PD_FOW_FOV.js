//=============================================================================
// SD_FOW_FOV.js
//=============================================================================
/*:
 * @plugindesc C7 - Implements the fog of war (FOW) and field of view (FOV) code the engine.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 *
 * @param fowHeader
 * @text Fog of war
 *
 * @param playerViewRange
 * @text Player vision range
 * @desc How many tiles away from the player's position does his vision expand
 * @parent fowHeader
 * @type number
 * @decimals 0
 * @default 3
 *
 * @param playerViewShape
 * @text Player vision shape
 * @desc How to shape the view range?
 * @parent fowHeader
 * @type select
 * @option Cross
 * @value 0
 * @option Permissive FOV
 * @value 1
 * @default 1
 *
 * @param fogFadeSpeed
 * @text Fog fade speed
 * @desc How fast the hide/show animation of the fog runs
 * @parent fowHeader
 * @type number
 * @decimals 2
 * @default 0.1
 *
 * @param fogOpacity
 * @text Fog opacity
 * @desc Opacity of the fog
 * @parent fowHeader
 * @type number
 * @decimals 2
 * @default 1
 *
 * @param fogDiscover
 * @text Remembering
 * @desc Allows tiles already seen to be "remembered"
 * @parent fowHeader
 * @type boolean
 * @default true
 *
 * @param fogDiscoveredOpacity
 * @text Discovered tile opacity
 * @desc Opacity of tiles already discovered
 * @parent fowHeader
 * @type number
 * @decimals 2
 * @default 0.5
 *
 * @param fogShowEventsInDiscovered
 * @text Events on discovered
 * @desc Allows to see events that are not directly seen but are placed over an already discovered tile.
 * @parent fowHeader
 * @type boolean
 * @default false
 *
 *
 * @param fogTileOcclusion
 * @text Occluding tiles
 * @desc Sets which tiles must not allow to see through them.
 * @parent fowHeader
 * @type select[]
 * @option Void (Unused tile. Usually 0)
 * @value 0
 * @option Room floor
 * @value 1
 * @option Corridor floor
 * @value 2
 * @option Wall
 * @value 3
 * @option Door
 * @value 4
 * @default ["3"]
 *
 *
*/
PD=PD||{};
PD.Aliases={};
//Stores the DunGen.Dungeon instance of each level of the dungeon.
PD.Globals={};
PD.Globals.dungeonGenerators=[
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];
PD.Globals.knowTileDatas=[
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

/////////////////////////////////////////////////////////////////////   FOW  ///////////////////////////////////////////////////////////////////////
PD.FOW={};
PD.FOW.Params={};

var pars=PluginManager.parameters('PD_FOW_FOV');
PD.FOW.Params.fogFadeSpeed=Number(pars["fogFadeSpeed"] || "0.1");
PD.FOW.Params.playerViewRange=Number(pars["playerViewRange"] || "5");
PD.FOW.Params.playerViewShape=Number(pars["playerViewShape"] || "0");
PD.FOW.Params.fogOpacity=Number(pars["fogOpacity"] || "1");
PD.FOW.Params.fogDiscover=Boolean(pars["fogDiscover"] || "true");
PD.FOW.Params.fogDiscoveredOpacity=Number(pars["fogDiscoveredOpacity"] || "0.5");
PD.FOW.Params.fogShowEventsInDiscovered=Boolean(pars["fogShowEventsInDiscovered"] || "false");
PD.FOW.Params.fogTileOcclusion=JSON.parse(String(pars["fogTileOcclusion"] || "[\"3\"]"));
PD.FOW.Params.fogTileOcclusion.forEach(function(each, pos){
    PD.FOW.Params.fogTileOcclusion[pos]=Number(each);
},this);

PD.FOW.Bitmap= new Bitmap(48, 48);
PD.FOW.Bitmap.fillAll('black');
PD.FOW.clearFog = function() {
    for (var i = 0; i < $dataMap.width; i++) {
        for (var j = 0; j < $dataMap.height; j++) {
            this.clearFogTile(i,j);
        }
    }
}
PD.FOW.clearFogTile = function(x, y) {
    PD.FOW._tiles[x][y].clearGradient();
    PD.FOW._tiles[x][y].visible = false;
    PD.FOW._tiles[x][y].targetOpacity=0;
}
PD.FOW.paintFog = function(asDiscovered) {
    if(asDiscovered==undefined || asDiscovered==null) asDiscovered==false;
    for (var i = 0; i < $dataMap.width; i++) {
        for (var j = 0; j < $dataMap.height; j++) {
            this.paintFogTile(i,j);
            PD.FOW._tiles[i][j].targetOpacity=((asDiscovered?PD.FOW.Params.fogDiscoveredOpacity:PD.FOW.Params.fogOpacity)*255);
        }
    }
}
PD.FOW.paintFogTile = function(x, y, asDiscovered) {
    if(asDiscovered==undefined || asDiscovered==null) asDiscovered==false;
    PD.FOW._tiles[x][y].visible = true;
    PD.FOW._tiles[x][y].targetOpacity=((asDiscovered?PD.FOW.Params.fogDiscoveredOpacity:PD.FOW.Params.fogOpacity)*255);
}
// Delete all fog sprites
PD.FOW.eraseFog = function() {
    if (this._fog_tiles != undefined){
     for (var i = 0; i < $dataMap.width; i++) {
            for (var j = 0; j < $dataMap.height; j++) {
                this._fog_tiles[i][j].deleteSprite();
            }
        }
    }
}
PD.FOW.isOccluderTile=function(x, y){
    return PD.FOW.Params.fogTileOcclusion.indexOf($gameMap._dungeonGenerator._getTileId(x, y))>-1;
}
PD.Helpers=PD.Helpers || {};
PD.Helpers.getTilesInLine=function(origin, dest){
    var lst=[];
    var xStep=0;
    var yStep=0;
    var x=origin.x;
    var y=origin.y;

    if(origin.x>dest.x){
        xStep=-1;
    }else if(origin.x<dest.x){
        xStep=1;
    }
    if(origin.y>dest.y){
        yStep=-1;
    }else if(origin.y<dest.y){
        yStep=1;
    }
    if(xStep!=0 && yStep!=0){
        console.error("You can't get a line between the given points [("+origin.x+","+origin.y+") and  ("+dest.x+","+dest.y+")] because thats not an straight line!");
        return;
    }
    if(xStep!=0){
        for(x=origin.x; x!=dest.x; x+=xStep){
            if($gameMap.isValid(x, y)){
                lst.push({x:x,y:y});
            }
        }
    }else if(yStep!=0){
        for(y=origin.y; y!=dest.y; y+=yStep){
            if($gameMap.isValid(x, y)){
                lst.push({x:x,y:y});
            }
        }
    }
    return lst;
};
// ===Alias Spriteset_Map===
PD.Aliases.Spriteset_Map={};
PD.Aliases.Spriteset_Map.createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
    if($gameMap.hasGeneratedDungeon()){
    // Create sprites when other sprites are loading to place it in the right "height"
    PD.FOW._tiles = new Array($dataMap.width);
        for (var i = 0; i < $dataMap.width; i++) {
            PD.FOW._tiles[i] = new Array($dataMap.height);
            for (var j = 0; j < $dataMap.height; j++) {
                var sprite = new FogSprite(i, j);
                PD.FOW._tiles[i][j] = sprite;
                sprite.bitmap = PD.FOW.Bitmap;
                this.addChild(sprite);
                sprite.x = i*48;
                sprite.y = j*48;
            }
        }
    }
    PD.Aliases.Spriteset_Map.createCharacters.call(this);
};
// ===End Alias Spriteset_Map===
// ===Fog Sprite Prototype===
function FogSprite() {
    this.initialize.apply(this, arguments);
};
FogSprite.prototype = Object.create(Sprite_Base.prototype);
FogSprite.prototype.constructor = FogSprite;

FogSprite.prototype.initialize = function(x, y) {
    Sprite_Base.prototype.initialize.call(this);
    this.gradientMap = new Map();
    this.visible = false;
    this.mapX = x;
    this.mapY = y;
    this.targetOpacity = this.opacity;

    return this;
}

// event_id = -1 is reserved for map hidden.  When tile is revealed, adds pair (-1, <opacity>)
FogSprite.prototype.addGradient = function(event_id, opacity) {
    this.gradientMap.set(event_id, opacity);
    this.updateOpacity();
}

FogSprite.prototype.removeGradient = function(event_id) {
    if (this.gradientMap.has(event_id)) {
        this.gradientMap.delete(event_id);
        this.updateOpacity();
    }
}

FogSprite.prototype.updateOpacity = function() {
    var new_opacity = 1;

    this.gradientMap.forEach(function(value) {
        new_opacity -= value;
    });

    if (new_opacity < 0) new_opacity = 0;
    this.targetOpacity = new_opacity * 255;
}

FogSprite.prototype.clearGradient = function () {
    this.gradientMap = new Map();
    this.updateOpacity();
}

FogSprite.prototype.deleteSprite = function() {
    this.parent.removeChild(this);
}

FogSprite.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    // Check each tile for change in opacity
    if (this.opacity > this.targetOpacity) {
        var temp = this.opacity - PD.FOW.Params.fogFadeSpeed*255;
        if (temp < this.targetOpacity)
            this.opacity = this.targetOpacity;
        else
            this.opacity = temp;
    } else if (this.opacity < this.targetOpacity) {
        var temp = this.opacity + PD.FOW.Params.fogFadeSpeed*255;
        if (temp > this.targetOpacity)
            this.opacity = this.targetOpacity;
        else
            this.opacity = temp;
    }
}
// ===Fog Sprite Prototype===
// ===Alias Game_CharacterBase===
PD.Aliases.Game_CharacterBase={};

PD.Aliases.Game_CharacterBase.update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    PD.Aliases.Game_CharacterBase.update.call(this);
    if($gameMap.hasGeneratedDungeon()){
        if(this._FOW_oldX!= this._x || this._FOW_oldY!=this._y){
            this.updateFOW();
            this._FOW_oldX=this._x;
            this._FOW_oldY=this._y;
        }
    }
};

Game_CharacterBase.prototype.updateFOW = function() {
    if(this.constructor==Game_Player){
        var orX=this._x;
        var orY=this._y;
        var usesDiscovery=PD.FOW.Params.fogDiscover;
        this._visibleTiles.forEach(function(each){
            PD.FOW.paintFogTile(each.x, each.y, usesDiscovery);
        }, this);
         if(usesDiscovery){
            this._discoveredTiles.forEach(function(each){
                PD.FOW.paintFogTile(each.x, each.y, true);
            }, this);
         }
        if(PD.FOW.Params.playerViewShape==0){       //Cross
            //Vertical line
            var destY=orY+this._viewRange;
            var tls=PD.Helpers.getTilesInLine({x:orX, y:orY}, {x:orX, y:destY});
            for (var index = 0; index < tls.length; index++) {
                var el = tls[index];
                if(el.y>orY && PD.FOW.isOccluderTile(el.x, el.y-1)) break;
                PD.FOW.clearFogTile(el.x, el.y);
                this._visibleTiles.push(el);
                if(!this.knowsTile(el.x, el.y)){
                    this._discoveredTiles.push(el);
                }
            }
            destY=orY-this._viewRange;
            tls=PD.Helpers.getTilesInLine({x:orX, y:orY}, {x:orX, y:destY});
            for (var index = 0; index < tls.length; index++) {
                 var el = tls[index];
                if(el.y<orY && PD.FOW.isOccluderTile(el.x, el.y+1)) break;
                PD.FOW.clearFogTile(el.x, el.y);
                this._visibleTiles.push(el);
                if(!this.knowsTile(el.x, el.y)){
                    this._discoveredTiles.push(el);
                }
            }
            //horizontal line
            destX=orX-this._viewRange;
            tls=PD.Helpers.getTilesInLine({x:orX, y:orY}, {x:destX, y:orY});
            for (var index = 0; index < tls.length; index++) {
                var el = tls[index];
                if(el.x<orX && PD.FOW.isOccluderTile(el.x+1, el.y)) break;
                PD.FOW.clearFogTile(el.x, el.y);
                this._visibleTiles.push(el);
                if(!this.knowsTile(el.x, el.y)){
                    this._discoveredTiles.push(el);
                }
            }
            destX=orX+this._viewRange;
            tls=PD.Helpers.getTilesInLine({x:orX, y:orY}, {x:destX, y:orY});
            for (var index = 0; index < tls.length; index++) {
                var el = tls[index];
                if(el.x>orX && PD.FOW.isOccluderTile(el.x-1, el.y)) break;
                PD.FOW.clearFogTile(el.x, el.y);
                this._visibleTiles.push(el);
                if(!this.knowsTile(el.x, el.y)){
                    this._discoveredTiles.push(el);
                }
            }
        }else if(PD.FOW.Params.playerViewShape==1){       //Square
            if(PD.FOV==undefined || PD.FOV._mapHeight!=$gameMap.height || PD.FOV._mapWidth!=$gameMap.width){
                var isTransparentFunc=function(x, y){
                    return !PD.FOW.isOccluderTile(x, y);
                };
                PD.FOV= new PermissiveFov($gameMap.width, $gameMap.height, isTransparentFunc);
            }
            var slf=this;
            PD.FOV.compute(orX,orY,this._viewRange,function(x, y){
                if($gameMap.isValid(x, y)){
                    PD.FOW.clearFogTile(x, y);
                    slf._visibleTiles.push({x:x, y:y});
                    if(!slf.knowsTile(x, y)){
                        slf._discoveredTiles.push({x:x, y:y});
                    } 
                }
            });
        }
    }
};
PD.Aliases.Game_CharacterBase.initialize = Game_CharacterBase.prototype.initialize;
Game_CharacterBase.prototype.initialize = function() {
    PD.Aliases.Game_CharacterBase.initialize.call(this);
    this._visibleTiles=[];
    this._discoveredTiles=[];
    this._FOW_oldX=0;
    this._FOW_oldY=0;
    this._viewRange=0;
    if(this.constructor==Game_Player){
        this._viewRange=PD.FOW.Params.playerViewRange;
    }
};
Game_CharacterBase.prototype.canSeeTile = function(x, y) {
    if(!$gameMap.hasGeneratedDungeon()){
        return true;
    }
    return this._visibleTiles.filter(function(itm){
        return itm.x==x && itm.y==y;
    }).length>0;
};
Game_CharacterBase.prototype.knowsTile = function(x, y) {
    if(!$gameMap.hasGeneratedDungeon()){
        return true;
    }
    return this._discoveredTiles.filter(function(itm){
        return itm.x==x && itm.y==y;
    }).length>0;
};
Game_CharacterBase.prototype.canSeeCharacter = function(char) {
    if(!$gameMap.hasGeneratedDungeon()){
        return true;
    }
    if(char==null){
        return false;
    }
    return this._visibleTiles.filter(function(itm){
        return (itm.x==char._x && itm.y==char._y);
    }).length>0;
};
// ===Alias Game_CharacterBase===
PD.Aliases.Scene_Map={};
PD.Aliases.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    PD.Aliases.Scene_Map.update.call(this);
    if($gameMap.hasGeneratedDungeon()){
        var realX = $gameMap.displayX();
        var realY = $gameMap.displayY();
        if (this._FOW_oldX != realX || this._FOW_oldY != realY) {
            for (var i = 0; i < $dataMap.width; i++){
                for (var j = 0; j < $dataMap.height; j++) {
                    PD.FOW._tiles[i][j].x = (i - realX)*48;
                    PD.FOW._tiles[i][j].y = (j - realY)*48;
                }
            }
        }
        this._FOW_oldX=realX;
        this._FOW_oldY=realY;
    }
};
PD.Aliases.Scene_Map.start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    PD.Aliases.Scene_Map.start.call(this);
    this._FOW_oldX=0;
    this._FOW_oldY=0;
}
PD.Aliases.DataManager={};
PD.Aliases.DataManager.onDungeonMapLoaded=DataManager.onDungeonMapLoaded;
DataManager.onDungeonMapLoaded=function(){
    PD.Aliases.DataManager.onDungeonMapLoaded.call(this);
    $gamePlayer._FOW_oldX=0;
    $gamePlayer._FOW_oldY=0;
}
////////////////////////////////////////////////////////////////   FOW  END   ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////   FOV  START   ///////////////////////////////////////////////////////////////////
/**
 * @param {number} nearX
 * @param {number} nearY
 * @param {number} farX
 * @param {number} farY
 * @constructor
 */
var FOVLine = function(nearX, nearY, farX, farY) {
	/**
	 * @type {number}
	 * @private
	 */
	this._nearX = nearX;

	/**
	 * @type {number}
	 * @private
	 */
	this._nearY = nearY;

	/**
	 * @type {number}
	 * @private
	 */
	this._farX = farX;

	/**
	 * @type {number}
	 * @private
	 */
	this._farY = farY;

	/**
	 * @type {number}
	 * @private
	 */
	this._deltaX = this._farX - this._nearX;

	/**
	 * @type {number}
	 * @private
	 */
	this._deltaY = this._farY - this._nearY;
};

FOVLine.prototype.clone = function () {
	return new FOVLine(this._nearX, this._nearY, this._farX, this._farY);
};

/**
 * @param {number} nearX
 * @param {number} nearY
 */
FOVLine.prototype.setNearPoint = function(nearX, nearY) {
	this._nearX = nearX;
	this._nearY = nearY;

	this._deltaX = this._farX - this._nearX;
	this._deltaY = this._farY - this._nearY;
};

/**
 * @param {number} farX
 * @param {number} farY
 */
FOVLine.prototype.setFarPoint = function(farX, farY) {
	this._farX = farX;
	this._farY = farY;

	this._deltaX = this._farX - this._nearX;
	this._deltaY = this._farY - this._nearY;
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
FOVLine.prototype.isBelow = function(x, y) {
	return this._relativeSlope(x, y) > 0;
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
FOVLine.prototype.isBelowOrCollinear = function(x, y) {
	return this._relativeSlope(x, y) >= 0;
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
FOVLine.prototype.isAbove = function(x, y) {
	return this._relativeSlope(x, y) < 0;
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
FOVLine.prototype.isAboveOrCollinear = function(x, y) {
	return this._relativeSlope(x, y) <= 0;
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
FOVLine.prototype.isCollinear = function(x, y) {
	return this._relativeSlope(x, y) == 0;
};

/**
 * @param {FOVLine} line
 * @returns {boolean}
 */
FOVLine.prototype.isFOVLineCollinear = function(line) {
	return this.isCollinear(line._nearX, line._nearY) && this.isCollinear(line._farX, line._farY);
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 * @private
 */
FOVLine.prototype._relativeSlope = function(x, y) {
	return this._deltaY * (this._farX - x) - this._deltaX * (this._farY - y);
};


/**
 * @param {FOVLine} shallowFOVLine
 * @param {FOVLine} steepFOVLine
 * @constructor
 */
var FOVView = function(shallowFOVLine, steepFOVLine) {
	/**
	 * @type {FOVLine}
	 */
	this.shallowFOVLine = shallowFOVLine;

	/**
	 * @type {FOVLine}
	 */
	this.steepFOVLine = steepFOVLine;

	/**
	 * @type {?FOVViewBump}
	 */
	this.shallowBump = null;

	/**
	 * @type {?FOVViewBump}
	 */
	this.steepBump = null;
};

/**
 * @returns {FOVView}
 */
FOVView.prototype.clone = function() {
	var view = new FOVView(
		this.shallowFOVLine.clone(),
		this.steepFOVLine.clone()
	);
	view.shallowBump = this.shallowBump ? this.shallowBump.clone() : null;
	view.steepBump = this.steepBump ? this.steepBump.clone() : null;

	return view;
};


/**
 * @param {number} x
 * @param {number} y
 * @param {?FOVViewBump} parent
 * @constructor
 */
var FOVViewBump = function(x, y, parent) {
	/**
	 * @type {number}
	 */
	this.x = x;

	/**
	 * @type {number}
	 */
	this.y = y;

	/**
	 * @type {FOVViewBump}
	 */
	this.parent = parent;
};

/**
 * @returns {FOVViewBump}
 */
FOVViewBump.prototype.clone = function() {
	return new FOVViewBump(this.x, this.y, this.parent ? this.parent.clone() : null);
};


/**
 * Check whether point (x,y) is transparent (i.e. is not an obstacle)
 * @callback isTransparent
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
/**
 * Check whether point (x,y) has previously been marked as visible
 * @callback isVisible
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
/**
 * Mark point (x,y) as visible
 * @callback setVisible
 * @param {number} x
 * @param {number} y
 */
/**
 * A data object passed into the octant methods
 * @typedef {object} fovData
 * @property {Array.<Array.<number>>} visited
 * @property {number} startX
 * @property {number} startY
 * @property {number} radius
 * @property {setVisible} setVisible
 * @property {isTransparent} isTransparent
 */

/**
 * @param {number} mapWidth
 * @param {number} mapHeight
 * @param {isTransparent} isTransparent
 * @constructor
 */
var PermissiveFov = function(mapWidth, mapHeight, isTransparent) {
	this._mapWidth = mapWidth;
	this._mapHeight = mapHeight;
	this._isTransparent = isTransparent;
};

/**
 * @param {number} startX
 * @param {number} startY
 * @param {number} radius
 * @param {setVisible} setVisible
 */
PermissiveFov.prototype.compute = function(startX, startY, radius, setVisible) {
	var minExtentX;
	var maxExtentX;
	var minExtentY;
	var maxExtentY;

	/**
	 * @type {fovData}
	 */
	var data = {
		setVisible: setVisible,
		isTransparent: this._isTransparent,
		startX: startX,
		startY: startY,
		radius: radius,
		visited: []
	};

	// Will always see the centre.
	data.setVisible(startX, startY);
	data.visited[startX] = [];
	data.visited[startX][startY] = 1;

	// Get the dimensions of the actual field of view, making sure not to go off the map or beyond the radius.
	minExtentX = (startX < radius ? startX : radius);
	maxExtentX = (this._mapWidth - startX <= radius ? this._mapWidth - startX - 1 : radius);
	minExtentY = (startY < radius ? startY : radius);
	maxExtentY = (this._mapHeight - startY <= radius ? this._mapHeight - startY - 1 : radius);

	_computeQuadrant(data, 1, 1, maxExtentX, maxExtentY);
	_computeQuadrant(data, 1, -1, maxExtentX, minExtentY);
	_computeQuadrant(data, -1, -1, minExtentX, minExtentY);
	_computeQuadrant(data, -1, 1, minExtentX, maxExtentY);
};

/**
 * @param {number} mapWidth
 * @param {number} mapHeight
 */
PermissiveFov.prototype.setMapDimensions = function(mapWidth, mapHeight) {
	this._mapWidth = mapWidth;
	this._mapHeight = mapHeight;
};

/**
 * @param {isTransparent} isTransparent
 */
PermissiveFov.prototype.setIsTransparent = function(isTransparent) {
	this._isTransparent = isTransparent;
};

/**
 * @param {fovData} data
 * @param {number} deltaX
 * @param {number} deltaY
 * @param {number} maxX
 * @param {number} maxY
 * @private
 */
function _computeQuadrant(data, deltaX, deltaY, maxX, maxY) {
	var activeFOVViews = [];
	var startJ;
	var maxJ;
	var i;
	var j;
	var maxI;
	var shallowFOVLine;
	var steepFOVLine;
	var viewIndex;

	shallowFOVLine = new FOVLine(0, 1, maxX, 0);
	steepFOVLine = new FOVLine(1, 0, 0, maxY);

	activeFOVViews.push(new FOVView(shallowFOVLine, steepFOVLine));
	viewIndex = 0;

	// Visit the tiles diagonally and going outwards
	//
	// .
	// .
	// 9
	// 58
	// 247
	// @136..
	maxI = maxX + maxY;
	for (i = 1; i <= maxI && activeFOVViews.length; ++i) {
		startJ = (0 > i - maxX ? 0 : i - maxX);
		maxJ = (i < maxY ? i : maxY);

		for (j = startJ; j <= maxJ && viewIndex < activeFOVViews.length; ++j) {
			_visitPoint(data, i - j, j, deltaX, deltaY, viewIndex, activeFOVViews);
		}
	}
}

/**
 * @param {fovData} data
 * @param {number} x
 * @param {number} y
 * @param {number} deltaX
 * @param {number} deltaY
 * @param {number} viewIndex
 * @param {Array.<FOVView>} activeFOVViews
 * @private
 */
function _visitPoint(data, x, y, deltaX, deltaY, viewIndex, activeFOVViews) {
	var topLeft = [x, y + 1];
	var bottomRight = [x + 1, y]; // The top left and bottom right corners of the current coordinate.
	var shallowFOVViewIndex;
	var steepFOVViewIndex;
	var realX;
	var realY;
	var pt;
	var shallowFOVLineIsAboveBottomRight;
	var steepFOVLineIsBelowTopLeft;

	for (; viewIndex < activeFOVViews.length &&
		activeFOVViews[viewIndex].steepFOVLine.isBelowOrCollinear(bottomRight[0], bottomRight[1]); ++viewIndex) {
		// The current coordinate is above the current view and is ignored. The steeper fields may need it though.
	}

	if (
		viewIndex == activeFOVViews.length ||
		activeFOVViews[viewIndex].shallowFOVLine.isAboveOrCollinear(topLeft[0], topLeft[1])
	) {
		// Either the current coordinate is above all of the fields or it is below all of the fields.
		return;
	}

	// It is now known that the current coordinate is between the steep
	// and shallow lines of the current view.

	// The real quadrant coordinates
	realX = x * deltaX;
	realY = y * deltaY;

	pt = [data.startX + realX, data.startY + realY];
	if (!data.visited[pt[0]] || !data.visited[pt[0]][pt[1]]) {
		data.visited[pt[0]] = data.visited[pt[0]] || [];
		data.visited[pt[0]][pt[1]] = 1;
		data.setVisible(pt[0], pt[1]);
	}

	if (data.isTransparent(pt[0], pt[1])) {
		// The current coordinate does not block sight and therefore has no effect on the view.
		return;
	}

	// The current coordinate is an obstacle.
	shallowFOVLineIsAboveBottomRight = activeFOVViews[viewIndex].shallowFOVLine.isAbove(bottomRight[0], bottomRight[1]);
	steepFOVLineIsBelowTopLeft = activeFOVViews[viewIndex].steepFOVLine.isBelow(topLeft[0], topLeft[1]);

	if (shallowFOVLineIsAboveBottomRight && steepFOVLineIsBelowTopLeft) {
		// The obstacle is intersected by both lines in the current view. The view is completely blocked.
		activeFOVViews.splice(viewIndex, 1);
	} else if (shallowFOVLineIsAboveBottomRight) {
		// The obstacle is intersected by the shallow line of the current view. The shallow line needs to be raised.
		_addShallowBump(topLeft[0], topLeft[1], activeFOVViews, viewIndex);
		_checkFOVView(activeFOVViews, viewIndex);
	} else if (steepFOVLineIsBelowTopLeft) {
		// The obstacle is intersected by the steep line of the current view. The steep line needs to be lowered.
		_addSteepBump(bottomRight[0], bottomRight[1], activeFOVViews, viewIndex);
		_checkFOVView(activeFOVViews, viewIndex);
	} else {
		// The obstacle is completely between the two lines of the current view.
		// Split the current view into two views above and below the current coordinate.
		shallowFOVViewIndex = viewIndex;
		steepFOVViewIndex = ++viewIndex;

		activeFOVViews.splice(shallowFOVViewIndex, 0, activeFOVViews[shallowFOVViewIndex].clone());
		_addSteepBump(bottomRight[0], bottomRight[1], activeFOVViews, shallowFOVViewIndex);

		if (!_checkFOVView(activeFOVViews, shallowFOVViewIndex)) {
			--steepFOVViewIndex;
		}

		_addShallowBump(topLeft[0], topLeft[1], activeFOVViews, steepFOVViewIndex);
		_checkFOVView(activeFOVViews, steepFOVViewIndex);
	}
}

/**
 * @param {number} x
 * @param {number} y
 * @param {Array.<FOVView>} activeFOVViews
 * @param {number} viewIndex
 * @private
 */
function _addShallowBump(x, y, activeFOVViews, viewIndex) {
	activeFOVViews[viewIndex].shallowFOVLine.setFarPoint(x, y);
	activeFOVViews[viewIndex].shallowBump = new FOVViewBump(x, y, activeFOVViews[viewIndex].shallowBump);

	for (var curBump = activeFOVViews[viewIndex].steepBump; curBump; curBump = curBump.parent) {
		if (activeFOVViews[viewIndex].shallowFOVLine.isAbove(curBump.x, curBump.y)) {
			activeFOVViews[viewIndex].shallowFOVLine.setNearPoint(curBump.x, curBump.y);
		}
	}
}

/**
 * @param {number} x
 * @param {number} y
 * @param {Array.<FOVView>} activeFOVViews
 * @param {number} viewIndex
 * @private
 */
function _addSteepBump(x, y, activeFOVViews, viewIndex) {
	activeFOVViews[viewIndex].steepFOVLine.setFarPoint(x, y);
	activeFOVViews[viewIndex].steepBump = new FOVViewBump(x, y, activeFOVViews[viewIndex].steepBump);

	for (var curBump = activeFOVViews[viewIndex].shallowBump; curBump; curBump = curBump.parent) {
		if (activeFOVViews[viewIndex].steepFOVLine.isBelow(curBump.x, curBump.y)) {
			activeFOVViews[viewIndex].steepFOVLine.setNearPoint(curBump.x, curBump.y);
		}
	}
}

/**
 * @param {Array.<FOVView>} activeFOVViews
 * @param {number} viewIndex
 * @returns {boolean}
 * @private
 */
function _checkFOVView(activeFOVViews, viewIndex) {
	/* Remove the view in activeFOVViews at index viewIndex if either:
	 *     - the two lines are collinear
	 *     - the lines pass through either extremity
	 */
	if (
		activeFOVViews[viewIndex].shallowFOVLine.isFOVLineCollinear(activeFOVViews[viewIndex].steepFOVLine) &&
		(activeFOVViews[viewIndex].shallowFOVLine.isCollinear(0, 1) || activeFOVViews[viewIndex].shallowFOVLine.isCollinear(1, 0))
	) {
		activeFOVViews.splice(viewIndex, 1);
		return false;
	}

	return true;
}
////////////////////////////////////////////////////////////////   FOV  END   ///////////////////////////////////////////////////////////////////