class HPBox {
    constructor(unit) {
        this.unit = unit;
        this.maxwidth = 24;
    }
    update() {
        this.x = this.unit.x - 8;
        this.y = this.unit.y - 16;
        this.width = this.unit.hp / this.unit.maxhp * this.maxwidth;
        this.height = 4;
    }
    draw(ctx) {
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.maxwidth, this.height);
        ctx.fillStyle = "rgb(0,255,0)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}