class Unit {
    constructor(team, x, y) {
        this.team = team;
        this.x = x;
        this.y = y;
        this.sprite = sprites[Math.floor(Math.random() * sprites.length)];
        this.agl = Math.floor(Math.random() * 9) + 1;
        this.CT = 0;
        this.CTR = 0; // Math.ceil(100 / this.agl);
        //this.ready = false;
        this.moved = false;
        this.acted = false;
    }

    tick() {
        this.CT += this.agl;
        //if (this.CT >= 100) {
        //    this.ready = true;
        //}
    }

    turn() {
        if (!this.moved) {
            var path = [
                { x: this.x + 1, y: this.y },
                { x: this.x + 2, y: this.y },
                { x: this.x + 3, y: this.y },
                { x: this.x + 4, y: this.y },
                { x: this.x + 5, y: this.y }
            ];
            var task = new Task("move", this, 999, function(unit) { //task invoke
                var p = path.shift();
                if (p) {
                    unit.move(p.x, p.y);
                    return true;
                }
                else {
                    return false;
                }
            }, function(unit) { //task done
                unit.moved = true;
            });

            return task;
        }
        else {
            var task = new Task("done", this, 999, function(unit) { //task invoke
                //todo: which direction to face
                return false;
            }, function(unit) {
                unit.done();
            });

            return task;
        }
    }

    done() {
        this.CT = 0;
        this.moved = false;
        //this.ready = false;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {

    }

    draw(ctx) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "32px Arial";
        ctx.fillText(this.sprite, this.x * 40, this.y * 40);
    }
    
    toString() {
        return this.sprite + "CT: " + this.CT;
    }
}