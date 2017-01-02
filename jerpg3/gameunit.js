var unittypes = {
    "Human": {
        "sprite": 0x1F601
    },
    "Snek": {
        "sprite": 0x1F40D
    }
};

var aitypes = {
    "None": {
        "loop": function() {
            
        }
    },
    "Following": {
        "loop": function() {
            this.movetarget = this.followtarget;
        }
    },
    "Loitering": {
        "loop": function() {
            if (this.movetarget === null) {
                this.movetarget = module.objects.random();
            }
        }
    }
};

class GameUnit {
    constructor(type, x, y, color, ai) {
        this.x = x;
        this.y = y;
        this.speed = 0.1;
        this.color = color;
        this.followtarget = null;
        this.movetarget = null;
        this.actiontarget = null;
        this.size = 24;
        this.ai = aitypes[ai];
        
        this.type = type;
        var spritetemplate = clone(unittypes[type]);
        this.sprite = String.fromCodePoint(spritetemplate.sprite);
    }
    
    loop() {
        this.ai.loop.call(this);
        
        this.move();
    }
    
    move() {
        if (this.movetarget) {
            var distance = getDistance(this, this.movetarget);
            
            if (distance > 1) {
            
                var dx = this.movetarget.x - this.x;
                var dy = this.movetarget.y - this.y;
                var angle = Math.atan2(dy, dx);
                
                this.speed = clamp(distance / 10, 0, 2.0);
                
                this.x = this.x + Math.cos(angle) * this.speed;
                this.y = this.y + Math.sin(angle) * this.speed;
            }
            else
                this.movetarget = null;
        }

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
        this.movetarget = movetarget;
        
    }
    
    setFollowTarget(followtarget) {
        this.followtarget = followtarget;
    }
}

class Party {
    constructor(count, x=0, y=0) {
        this.units = [];
        this.x = x;
        this.y = y;
        this.movetarget = null;
        this.followtarget = null;
        this.actiontarget = null;
        
        for (var i=0; i<count; i++) {
            var followtarget = this.units[i-1];
            
            var newunit = new GameUnit(
                "Human",
                x,
                y,
                new Color(255,255,0,1),
                "Following"
            );
            
            newunit.setFollowTarget(followtarget);
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
    
    mouseDown(x, y) {
        this.followtarget = {
            "x": x,
            "y": y
        };
        
        this.units[0].setFollowTarget(this.followtarget);
    }
    
    draw(ctx,offsetx=0,offsety=0) {
        this.units.forEach(function(u) {
           u.draw(ctx,offsetx,offsety); 
        });
    }
}