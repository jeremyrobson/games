var unittypes = {
    "Human": {
        "sprite": 0x1F601
    },
    "Snek": {
        "sprite": 0x1F40D
    }
};

class GameUnit {
    constructor(type, x, y, color, ai) {
        this.x = x;
        this.y = y;
        this.speed = 0.1;
        this.color = color;
        this.size = 24;
        this.ai = ai;
        
        this.type = type;
        var spritetemplate = clone(unittypes[type]);
        this.sprite = String.fromCodePoint(spritetemplate.sprite);
    }
    
    loop() {
        this.ai.loop(this);
    }
    
    draw(ctx,offsetx=0,offsety=0) {
        var dx = this.x - offsetx - 16;
        var dy = this.y - offsety - 16;
        
        ctx.fillStyle = this.color.toString();
        ctx.font = this.size + "px Arial";
        ctx.textBaseline = "top";
        ctx.fillText(this.sprite,dx,dy);
    }
    
    setMoveTarget(movetarget) {
        this.ai.setMoveTarget(movetarget);
    }
    
    setFollowTarget(followtarget) {
        this.ai.setFollowTarget(followtarget);
    }
}

class Party {
    constructor(count, x=0, y=0) {
        this.units = [];
        this.x = x;
        this.y = y;
        
        for (var i=0; i<count; i++) {
            var followtarget = this.units[i-1];
            
            var newunit = new GameUnit(
                "Human",
                x,
                y,
                new Color(255,255,0,1),
                new Following(followtarget)
            );
            
            this.units.push(newunit);
        }
    }
    
    loop() {
        this.units.forEach(function(u) {
           u.loop(); 
        });
    }
    
    move() {

    }
    
    mouseDown(x, y, selobject) {
        var followtarget = {
            "x": x,
            "y": y
        };
        
        if (selobject)
            followtarget = selobject;
        
        this.units[0].setFollowTarget(followtarget);
    }
    
    draw(ctx,offsetx=0,offsety=0) {
        this.units.forEach(function(u) {
           u.draw(ctx,offsetx,offsety); 
        });
    }
}