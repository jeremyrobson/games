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
    constructor(type, x, y, sprite, size, color = "rgba(255,255,255,1.0)") {
        this.id = guid();
        this.type = type;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.qx = Math.floor(this.x / QUAD_WIDTH);
        this.qy = Math.floor(this.y / QUAD_HEIGHT);
        this.lqx = this.qx;
        this.lqy = this.qy;
        this.speed = 0.1;
        this.color = color;
        this.size = size;
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