class Bar {
    constructor(x, y, width, height, value, max) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
        this.max = max;
        this.color = "rgba(0,0,255,0.3)";
        this.size = 0;
        this.font = "24px Arial";
        this.remove = false;
    }

    update() {
        this.size = this.width * this.value / this.max;
        this.text = Math.floor(this.value / 10) + " / " + Math.floor(this.max / 10);
    }

    draw(ctx) {
        ctx.font = this.font;
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.height);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(this.text, this.x, this.y);
    }
}