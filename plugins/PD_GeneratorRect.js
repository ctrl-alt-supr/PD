if(PD==undefined||PD.Generator==undefined||PD.Generator.Dungeon==undefined){
    console.error("PD_GeneratorRect is meant to be imported AFTER PD_Generator!");
} else{
    PD.Generator.Dungeon.ARect=function(l, t, r, b){
        this.top=t;
        this.bottom=b;
        this.left=l;
        this.right=r;
    }
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
        var res = new PD.Generator.Dungeon.ARect(Math.max( left, other.left ),Math.max( top, other.top ),Math.min( right, other.right ),Math.min( bottom, other.bottom ));
        return res;
    }
    PD.Generator.Dungeon.ARect.prototype.x=function(){
        return this.left;
    }
    PD.Generator.Dungeon.ARect.prototype.y=function(){
        return this.top;
    }

    PD.Generator.Dungeon.Point = function(x, y) {
        var _this = this;
        if (((typeof x === 'number') || x === null) && ((typeof y === 'number') || y === null)) {
            var __args = Array.prototype.slice.call(arguments);
            this.x = 0;
            this.y = 0;
            this.x = 0;
            this.y = 0;
            (function () {
                _this.x = x;
                _this.y = y;
            })();
        }
        else if (((x != null && x instanceof Point) || x === null) && y === undefined) {
            var __args = Array.prototype.slice.call(arguments);
            var p_1 = __args[0];
            this.x = 0;
            this.y = 0;
            this.x = 0;
            this.y = 0;
            (function () {
                _this.x = p_1.x;
                _this.y = p_1.y;
            })();
        }
        else if (x === undefined && y === undefined) {
            var __args = Array.prototype.slice.call(arguments);
            this.x = 0;
            this.y = 0;
            this.x = 0;
            this.y = 0;
        }
        else
            throw new Error('invalid overload');
    }
    PD.Generator.Dungeon.Point.prototype.set$int$int = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    PD.Generator.Dungeon.Point.prototype.set = function (x, y) {
        if (((typeof x === 'number') || x === null) && ((typeof y === 'number') || y === null)) {
            return this.set$int$int(x, y);
        }
        else if (((x != null && x instanceof Point) || x === null) && y === undefined) {
            return this.set$Point(x);
        }
        else
            throw new Error('invalid overload');
    };
    PD.Generator.Dungeon.Point.prototype.set$Point = function (p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    };
    PD.Generator.Dungeon.Point.prototype.clone = function () {
        return new PD.Generator.Dungeon.Point(this);
    };
    PD.Generator.Dungeon.Point.prototype.scale = function (f) {
        this.x *= f;
        this.y *= f;
        return this;
    };
    PD.Generator.Dungeon.Point.prototype.offset$int$int = function (dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    };
    PD.Generator.Dungeon.Point.prototype.offset = function (dx, dy) {
        if (((typeof dx === 'number') || dx === null) && ((typeof dy === 'number') || dy === null)) {
            return this.offset$int$int(dx, dy);
        }
        else if (((dx != null && dx instanceof PD.Generator.Dungeon.Point) || dx === null) && dy === undefined) {
            return this.offset$Point(dx);
        }
        else
            throw new Error('invalid overload');
    };
    PD.Generator.Dungeon.Point.prototype.offset$Point = function (d) {
        this.x += d.x;
        this.y += d.y;
        return this;
    };
    /**
     *
     * @param {*} obj
     * @return {boolean}
     */
    PD.Generator.Dungeon.Point.prototype.equals = function (obj) {
        if (obj != null && obj instanceof Point) {
            var p = obj;
            return p.x === this.x && p.y === this.y;
        }
        else {
            return false;
        }
    };
}
