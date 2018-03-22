/*:
 * @plugindesc G2 - Classes representing rectangles and points required by the generator
 * @author Alex
 *
 * @help Place AFTER PD_Generator!!!
 * */
if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD => PD_GeneratorRect is meant to be imported AFTER PD_Generator!");
} else{
    /**
     * @class A rect
     */
    PD.Generator.Dungeon.ARect=function(l, t, r, b){
        if(l==undefined && t==undefined && r==undefined && b==undefined){
            this.top=0;
            this.left=0;
            this.right=0;
            this.bottom=0;
        }else if(l.constructor.prototype instanceof PD.Generator.Dungeon.ARect || l.constructor===PD.Generator.Dungeon.ARect){  //ARect as the first parameter
            this.top=l.top;
            this.bottom=l.bottom;
            this.left=l.left;
            this.right=l.right;
        }else{
            this.top=t;
            this.bottom=b;
            this.left=l;
            this.right=r;
        }
    }
    PD.Generator.Dungeon.ARect.prototype.constructor=PD.Generator.Dungeon.ARect;
    PD.Generator.Dungeon.ARect.prototype.width=function(){
        return this.right-this.left;
    }
    PD.Generator.Dungeon.ARect.prototype.height=function(){
        return this.bottom-this.top;
    }
    PD.Generator.Dungeon.ARect.prototype.square=function(){
        return this.width()*this.height();
    }
    PD.Generator.Dungeon.ARect.prototype.isEmpty=function() {
        return this.right <= this.left || this.bottom <= this.top;
    }
    PD.Generator.Dungeon.ARect.prototype.setEmpty=function() {
        this.left = this.right = this.top = this.bottom = 0;
        return this;
    }
    PD.Generator.Dungeon.ARect.prototype.set=function(l, t, r, b) {
        this.top=t;
        this.bottom=b;
        this.left=l;
        this.right=r;
        return this;
    }
    PD.Generator.Dungeon.ARect.prototype.intersect=function( other ) {
        var res = new PD.Generator.Dungeon.ARect(Math.max( this.left, other.left ),Math.max( this.top, other.top ),Math.min( this.right, other.right ),Math.min( this.bottom, other.bottom ));
        return res;
    }
    PD.Generator.Dungeon.ARect.prototype.x=function(){
        return this.left;
    }
    PD.Generator.Dungeon.ARect.prototype.y=function(){
        return this.top;
    }


     /**
     * @class A point
     */
    PD.Generator.Dungeon.Point = function(x, y) {
        if(x==undefined || y==undefined){
            this.x=0;
            this.y=0;
        }else{
            this.x=x;
            this.y=y;
        }
    }
    PD.Generator.Dungeon.Point.prototype.set = function(x, y) {
        this.x=x;
        this.y=y;
        return this;
    }
    PD.Generator.Dungeon.Point.prototype.setByPoint = function(other) {
        this.x=other.x;
        this.y=other.y;
        return this;
    }
    PD.Generator.Dungeon.Point.prototype.clone = function() {
        return new Point(this.x, this.y);
    }
    PD.Generator.Dungeon.Point.prototype.scale = function(f) {
        this.x*=f;
        this.y*=f;
        return this;
    }
    PD.Generator.Dungeon.Point.prototype.offset = function(x, y) {
        this.x+=x;
        this.y+=y;
        return this;
    }
    PD.Generator.Dungeon.Point.prototype.offsetByPoint = function(other) {
        this.x+=other.x;
        this.y+=other.y;
        return this;
    }
    PD.Generator.Dungeon.Point.prototype.equals = function(other) {
        return (this.x==other.x && this.y==other.y);
    }
}