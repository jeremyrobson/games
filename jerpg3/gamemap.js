var maptypes = {
    "World": {
        "unittypes": ["Snek"],
        "objecttypes": ["Tree1", "Tree2"]
    }
};

class GameMap {
    constructor(maptype, width, height, units) {
        this.width = width; //quads
        this.height = height;
        this.color = new Color(55,155,85,1.0);
        
        this.locus = {x:0,y:0};
        this.offsetx = 0;
        this.offsety = 0;
        this.mouse = {"x": 0, "y": 0};
        this.selobject = null;
        
        this.objects = generate_objects(maptype);

        this.addObjects(units, 0, 0);
    }
    
    addObjects(arr) {
        this.objects = this.objects.concat(arr);
    }
    
    loop() {
        this.offsetx = this.locus.x - 320;
        this.offsety = this.locus.y - 240;
        
        var distance;
        this.objects.forEach(function(o) {
            o.loop();
            
            distance = getDistance(this.mouse, o);
            
            if (distance < 16)
                this.selobject = o;
                
        }, this);
    }
    
    mouseDown(mx, my) {
        mx = mx + this.offsetx;
        my = my + this.offsety;
        
        mx = clamp(mx, 0, 8192);
        my = clamp(my, 0, 8192);
        
        console.log(mx, my);
        
        this.locus.mouseDown(mx, my, this.selobject);
    }
    
    mouseMove(mx, my) {
        mx = mx + this.offsetx;
        my = my + this.offsety;
        
        mx = clamp(mx, 0, 8192);
        my = clamp(my, 0, 8192);
        
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
        
        if (this.selobject) {
            dx = this.selobject.x-offsetx-16;
            dy = this.selobject.y-offsety-16;
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
    constructor(maptype, width, height, units) {
        super(maptype, width, height, units);

        units = generate_units(maptype);
        

        this.addObjects(units);
    }
    
    loop() {
        super.loop();
        

    }
}

function generate_objects(maptype) {
    var objects = [];
    
    for (var i=0;i<10000;i++) {
        var x = randint(0, 8192);
        var y = randint(0, 8192);
        var newobj = new GameObject(maptype, x, y);
        objects.push(newobj);
    }
    
    return objects;
}

function generate_units(maptype) {
    var units = [];
    
    for (var i=0; i<100; i++) {
        var unittype = maptypes[maptype]["unittypes"].random();
        var x = randint(0, 8192);
        var y = randint(0, 8192);
        var color = "rgba(255,255,255,1)";
        var ai = new Loitering();
        var newunit = new GameUnit(unittype, x, y, color, ai);
        units.push(newunit);
    }
    
    return units;
}