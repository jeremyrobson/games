class Spread {
    constructor(src, x, y, maxRadius, rgb) {
        this.src = src; //src can be unit or objects like a bomb
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.alpha = 1.0;
        this.speed = 2;
        this.maxRadius = maxRadius;
        this.rgb = rgb;
        this.color = "rgba(" + this.rgb + ",1.0)";
        this.borderColor = "rgba(" + this.rgb + ",0.5)";
        this.remove = false;
    }

    update() {
        var ratio = this.radius / this.maxRadius;

        var targets = acquireTargets(this, [this.src.id]);
        targets.forEach(function(target) {
            if (target.distance < this.radius && ratio < 0.5) {
                var damage = Math.floor(Math.random() * 2);
                if (damage > 0) {
                    target.unit.applyDamage(damage);
                }
            }
        }, this);

        //detonate undetonated bombs within radius
        var bombs = getBombs(this.x, this.y, this.radius, [this.id, this.src.id]);
        bombs.forEach(function(bomb) {
            var distance = getDistance(this, bomb);
            if (distance < this.radius && !bomb.detonated) {
                bomb.detonate();
            }
        }, this);

        if (this.radius < this.maxRadius) {
            this.radius += this.speed;
            this.alpha = 1.0 - ratio;
        }
        else {
            this.remove = true;
        }
        this.borderColor = "rgba(" + this.rgb + "," + this.alpha + ")";
        this.color = "rgba(" + this.rgb + "," + this.alpha / 2 + ")";
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}