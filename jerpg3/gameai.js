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

function getLocalObjects(obj, map) {
    var x0 = clamp(obj.qx - 1, 0, map.jeremy-1);
    var x1 = clamp(obj.qx + 1, 0, map.jeremy-1);
    var y0 = clamp(obj.qy - 1, 0, map.jeremy-1);
    var y1 = clamp(obj.qy + 1, 0, map.jeremy-1);

    var objectList = [];

    for (var x=x0; x<=x1; x++) {
        for (var y=y0; y<=y1; y++) {
            map.quads[x][y].forEach(function(o) {
                objectList.push(o);
            });
        }
    }

    return objectList;
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
    
    loop(self, map) {
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
            var localObjects = getLocalObjects(self, map);
            this.movetarget = localObjects.random();
            this.targetReached = false;
        }
    }
}

class Hunting extends GameAI {
    constructor() {
        super(null, null, null);
        
        //hunting radius
        this.minDistance = 200;
    }
    
    loop(self, map) {
        super.loop(self);
        
        if (!this.actiontarget)
            this.acquireActionTarget(self, map);
        else {
            this.distance = getDistance(self, this.actiontarget);
        
            if (this.distance > this.minDistance)
                self.moveTowards(this.actiontarget, this.distance);
            
            if (this.distance <= this.minDistance) {
                this.backupai = this.ai;
                this.ai = new Attacking(null, null, this.actiontarget);
            }
        }
    }
    
    acquireTarget(self, map) {
        var target = null;
        
        var localObjects = getLocalObjects(self, map);
        var targetList = [];


        localObjects.forEach(function(o) {
            var possibleTarget = {
                "object": o,
                "distance": getDistance(self, o),
                "score": 0
            };
            targetList.push(possibleTarget);
        });
        
        targetList.sort(function(a,b) {
            return a.distance - b.distance;
        });

        console.log(targetList);

        //filter based on type
        //sort based on "score"
        //score comes from distance, hp left, unit type, etc.
        
        target = targetList[0];

        return target;
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