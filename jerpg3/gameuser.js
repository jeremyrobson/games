class GameUser {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.party = new Party(5);
        this.movetarget = null;
    }
    
    loop() {
        this.move();
    }
    
    
    mouseDown(x, y) {
        this.party.mouseDown(x, y);
        
        this.movetarget = {
            "x": x,
            "y": y
        }
    }
    
    move() {
        if (this.movetarget) {
            var distance = getDistance(this, this.movetarget);
            
            if (distance > 1) {
            
                var dx = this.movetarget.x - this.x;
                var dy = this.movetarget.y - this.y;
                var angle = Math.atan2(dy, dx);
                
                this.speed = clamp(distance / 10, 0, 3);
                
                this.x = this.x + Math.cos(angle) * this.speed;
                this.y = this.y + Math.sin(angle) * this.speed;
            }
        }

    }
}