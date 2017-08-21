class Bomb {
    constructor(src, x, y) {
        this.id = ++ids;
        this.src = src;
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.color = "rgb(255,255,0)";
        this.remove = false;
        this.text = "💣";
        this.font = "32px Arial";
        this.detonated = false;
    }

    detonate() {
        layer1.push(new Spread(this, this.x, this.y, 150, "255,0,255"));
        this.remove = true;
        this.detonated = true;
    }

    update() {
        var targets = acquireTargets(this, [this.src.id]);

        targets.forEach(function(target) {
            if (target.distance < 32) {
                this.detonate();
            }
        }, this);
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.fillText(this.text, this.x - 16, this.y - 16);
    }
}