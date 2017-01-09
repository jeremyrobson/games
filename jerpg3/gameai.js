function moveTowards(target, distance) {
    var angle = getAngle(this, target);
    this.speed = clamp(distance / 10, 0, 2.0);
    this.x = this.x + Math.cos(angle) * this.speed;
    this.y = this.y + Math.sin(angle) * this.speed;
}

function moveAwayFrom(target, distance) {
    var angle = getAngle(this, target);
    this.speed = -clamp(distance / 10, 0, 2.0);
    this.x = this.x + Math.cos(angle) * this.speed;
    this.y = this.y + Math.sin(angle) * this.speed;
}

class GameAI {
    constructor(followtarget, movetarget, actiontarget) {
        this.followtarget = followtarget;
        this.movetarget = movetarget;
        this.actiontarget = actiontarget;
        this.targetReached = false;
        this.distance = 0;
        this.minDistance = 1;
    }
    
    loop(self) {
        this.minDistance = self.minDistance;
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
        super.loop(self);
        
        this.movetarget = this.followtarget;
        
        if (this.movetarget)
            this.distance = getDistance(self, this.movetarget);
        
        if (this.distance > this.minDistance)
            self.moveTowards(this.movetarget, this.distance);
        
        //if (this.targetReached) {
            //self.moveAwayFrom(this.movetarget, this.distance);
            //this.targetReached = false;
        //}
        
        if (this.distance <= this.minDistance) {
            this.targetReached = true;
            this.movetarget = null;
        }
    }
    
}

class Loitering extends GameAI {
    constructor() {
        super(null, null, null);
    }
    
    loop(self) {
        super.loop(self);
        
        if (this.movetarget)
            this.distance = getDistance(self, this.movetarget);
        
        if (this.distance > this.minDistance)
            self.moveTowards(this.movetarget, this.distance);
        
        if (this.distance <= this.minDistance) {
            this.targetReached = true;
            this.movetarget = null;
        }
        
        if (this.targetReached || !this.movetarget) {
            this.movetarget = module.objects.random();
            this.targetReached = false;
        }
    }
}

class Hunting extends GameAI {
    constructor() {
        super(null, null, null);
    }
    
    loop(self) {
        super.loop(self);
        
        if (this.movetarget)
            this.distance = getDistance(self, this.movetarget);
        
        if (this.distance > this.minDistance)
            self.moveTowards(this.movetarget, this.distance);
        
        if (this.distance <= this.minDistance) {
            this.targetReached = true;
            this.movetarget = null;
        }
        
        if (this.targetReached || !this.movetarget) {
            this.movetarget = module.objects.random();
            this.targetReached = false;
        }
    }
}

class Attacking extends GameAI {
    constructor() {
        super(null, null, null);
    }
    
    loop(self) {
        super.loop(self);
        
        if (this.actiontarget) {
            this.movetarget = this.actiontarget;
            
            if (self.action) {
                self.action.invoke(this.distance);
            }
        }
    }
}