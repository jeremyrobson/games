var mapobjects = {
    "Tree1": {
        "code": 0x1F332
    },
    "Tree2": {
        "code": 0x1F333
    }
};

var maptypes = {
    "world": {
        "objecttypes": ["tree1", "tree2"]
    }
};

class GameObject {
    constructor(maptype, x, y) {
        var objecttype = maptypes[maptype].objecttypes.random();
        
        this.x = x;
        this.y = y;
        this.color = "rgba(255,255,255,1)";
        this.sprite = String.fromCodePoint(parseInt(mapobjects[objecttype].code));
        this.size = 32;
    }
    
    loop() {
        
    }
    
    draw(ctx, offsetx, offsety) {
        var dx = this.x - offsetx - 16;
        var dy = this.y - offsety - 16;
        ctx.fillStyle = this.color;
        ctx.font = this.size + "px Arial";
        ctx.fillText(this.sprite, dx, dy);
    }
}