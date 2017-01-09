var maptypes = {
    "World": {
        "unittypes": ["Snek"],
        "objecttypes": ["Tree1", "Tree2"]
    }
};

class GameMap {
    constructor(maptype, jeremy, units) {
        this.width = QUAD_WIDTH * jeremy;
        this.height = QUAD_HEIGHT * jeremy;
        this.quads = generate_quads(jeremy);
        this.color = new Color(55,155,85,1.0);
        
        this.locus = {x:0,y:0};
        this.offsetx = 0;
        this.offsety = 0;
        this.mouse = {"x": 0, "y": 0};
        this.hoverobject = null;
        
        this.objects = generate_objects(maptype, jeremy);

        this.addObjects(units, 0, 0);
    }
    
    addObjects(arr) {
        arr.forEach(function(o) {
            this.objects.push(o);
            this.quads[o.qx][o.qy].push(o);
        }, this);
    }
    
    updateQuads(o) {
        if (o.qx != o.lqx || o.qy != o.lqy) {
            
            var oldarr = this.quads[o.lqx][o.lqy];
            var newarr = []; 
            var length = oldarr.length;
            
            //create new array, filter object's id
            for (var i=0; i<length; i++) {
                if (oldarr[i].id !== o.id)
                    newarr.push(oldarr[i]);
            }
            
            this.quads[o.lqx][o.lqy] = newarr;
            
            //add to new quad and save new index
            this.quads[o.qx][o.qy].push(o);
            
            o.lqx = o.qx;
            o.lqy = o.qy;
        }
    }
    
    loop() {
        this.offsetx = this.locus.x - 320;
        this.offsety = this.locus.y - 240;
        
        var distance;
        this.objects.forEach(function(o) {
            o.loop();
            
            distance = getDistance(this.mouse, o);
            
            if (distance < 16)
                this.hoverobject = o;
            
            this.updateQuads(o);    
        }, this);
    }
    
    mouseDown(mx, my) {
        mx = mx + this.offsetx;
        my = my + this.offsety;
        mx = clamp(mx, 0, this.width);
        my = clamp(my, 0, this.height);
        this.mouse = {"x": mx, "y": my};
        this.selobject = null;
        
        var distance;
        var shortest = 16;
        this.objects.forEach(function(o) {
            distance = getDistance(this.mouse, o);
            
            if (distance < shortest) {
                this.selobject = o;
                shortest = distance;
            }
        }, this);
        
        console.log(this.selobject);
        
        this.locus.mouseDown(mx, my, this.selobject);
    }
    
    mouseMove(mx, my) {
        mx = mx + this.offsetx;
        my = my + this.offsety;
        mx = clamp(mx, 0, this.width);
        my = clamp(my, 0, this.height);
        this.mouse = {"x": mx, "y": my};
    }
    
    draw(ctx) {
        var dx, dy;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(0,0,640,480);
        
        var offsetx, offsety;
        
        offsetx = this.offsetx;
        offsety = this.offsety;
        
        this.objects.forEach(function(o) {
            if (o.x >= offsetx && o.y >= offsety &&
                o.x < offsetx + 620 && o.y < offsety + 455)
                o.draw(ctx, offsetx, offsety);
        });
        
        if (this.hoverobject) {
            dx = this.hoverobject.x-offsetx-16;
            dy = this.hoverobject.y-offsety-16;
            ctx.strokeStyle = "rgba(255,255,0,0.8)";
            ctx.lineWidth = 2;
            /*
            ctx.beginPath();
            ctx.moveTo(this.mouse.x-offsetx, this.mouse.y-offsety);
            ctx.lineTo(dx, dy);
            ctx.stroke();
            */
            ctx.fillStyle = "rgba(255,255,0,0.8)";
            ctx.strokeRect(dx, dy, 32, 32);
        }
    }
}

class WorldMap extends GameMap {
    constructor(maptype, jeremy, units) {
        super(maptype, jeremy, units);

        units = generate_units(maptype, jeremy);
        

        this.addObjects(units);
    }
    
    loop() {
        super.loop();
        

    }
}

function generate_quads(jeremy) {
    var quads = [];
    for (var x=0; x<jeremy; x++) {
        quads[x] = [];
        for (var y=0; y<jeremy; y++) {
            quads[x][y] = [];
        }
    }
    return quads;
}

function generate_objects(maptype, jeremy) {
    var objects = [];
    
    for (var i=0;i<10000;i++) {
        var x = randint(0, jeremy * QUAD_WIDTH);
        var y = randint(0, jeremy * QUAD_HEIGHT);
        var newobj = new GameObject(maptype, x, y);
        objects.push(newobj);
    }
    
    return objects;
}

function generate_units(maptype, jeremy) {
    var units = [];
    
    for (var i=0; i<100; i++) {
        var unittype = maptypes[maptype]["unittypes"].random();
        var x = randint(0, jeremy * QUAD_WIDTH);
        var y = randint(0, jeremy * QUAD_HEIGHT);
        var color = "rgba(255,255,255,1)";
        var ai = new Loitering();
        var newunit = new GameUnit(unittype, x, y, color, ai);
        units.push(newunit);
    }
    
    return units;
}