class TextBall {
    constructor(x, y, size, color, text) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.borderColor = new Color(0,0,0,1);
        this.shadowColor = new Color(0,0,0,1);
        this.initialY = y;
        this.vx = Math.random() * 3 - 1;
        this.vy = -2;
        this.momentum = 0.1;
        this.text = text;
        this.remove = false;
    }

    update() {
        this.color.a -= 0.005;
        this.shadowColor.a -= 0.005;
        this.borderColor.a -= 0.005;

        this.vy += this.momentum;
        this.y += this.vy;
        this.x += this.vx;
        if (this.y > this.initialY) {
            this.y = this.initialY;
            this.vy = -this.vy;
        }
        if (this.color.a <= 0) {
            this.remove = true;
        }
    }

    draw(ctx, offsetx, offsety) {
        var dx = this.x - offsetx - 16;
        var dy = this.y - offsety - 16;
        ctx.save();
        ctx.font = this.size + "px Monospace";
        ctx.shadowColor = this.shadowColor;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 1;
        ctx.strokeText(this.text, dx, dy);
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, dx, dy);
        ctx.restore();
    }

}