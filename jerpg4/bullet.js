class Bullet {
    constructor(src, x, y, x1, y1, x2, y2) {
        this.src = src;
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.angle = Math.atan2(y2-y1,x2-x1);
        this.color = "rgb(255,255,0)";
        this.speed = 10;
        this.remove = false;
        this.life = 100;
        this.text = "❄️";
        this.font = "24px Arial";
    }

    update() {
        this.velx = Math.cos(this.angle) * this.speed;
        this.vely = Math.sin(this.angle) * this.speed;
        this.x += this.velx;
        this.y += this.vely;
        this.life--;
        if (this.life <= 0) {
            this.remove = true;
        }

        var targets = acquireTargets(this, [this.src.id]);

        targets.forEach(function(target) {
            if (target.distance < 32) {
                this.remove = true;
                var damage = getDamage(this.src, target.unit);
                target.unit.applyDamage(damage);
            }
        }, this);
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.fillText(this.text, this.x, this.y);
    }
}