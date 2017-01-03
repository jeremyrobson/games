class GameAI {
    constructor(followtarget, movetarget, actiontarget) {
        this.followtarget = followtarget;
        this.movetarget = movetarget;
        this.actiontarget = actiontarget;
    }
    
    loop(self) {
        
    }
    
    move(self) {
        if (this.movetarget) {
            var distance = getDistance(self, this.movetarget);
            
            if (distance > 1) {
            
                var dx = this.movetarget.x - self.x;
                var dy = this.movetarget.y - self.y;
                var angle = Math.atan2(dy, dx);
                
                self.speed = clamp(distance / 10, 0, 2.0);
                
                self.x = self.x + Math.cos(angle) * self.speed;
                self.y = self.y + Math.sin(angle) * self.speed;
            }
            else
                this.movetarget = null;
        }
    }
    
    setMoveTarget(movetarget) {
        this.movetarget = movetarget;
    }
    
    setFollowTarget(followtarget) {
        this.followtarget = followtarget;
    }
}

class Following extends GameAI {
    constructor(followtarget) {
        super(followtarget, null, null);
    }
    
    loop(self) {
        this.movetarget = this.followtarget;
        
        this.move(self);
    }
    
}

class Loitering extends GameAI {
    constructor() {
        super(null, null, null);
    }
    
    loop(self) {
        if (this.movetarget === null) {
            this.movetarget = module.objects.random();
        }
        
        this.move(self);
    }
}