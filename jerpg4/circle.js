class Circle {
    constructor(src) {
        this.src = src;
        this.x = src.x
        this.y = src.y;
        this.width = 16;
        this.height = 16;
        this.color = "rgba(0,255,255,0.5)";
        this.speed = 32;
        this.angle = 0;
        this.radius = 10;
    }

    update() {
        var distance = getDistance(this, this.src);

        if (distance < 50) {
            this.angle = this.angle + 0.1;
            if (this.angle > Math.PI) {
                this.angle = -Math.PI;
            }
            var velx = Math.cos(this.angle) * this.speed;
            var vely = Math.sin(this.angle) * this.speed;
            this.x = this.src.x + velx;
            this.y = this.src.y + vely;
        }
        else {
            this.angle = Math.atan2(this.y-this.src.y,this.x-this.src.x);
            var velx = Math.cos(this.angle);
            var vely = Math.sin(this.angle);
            this.vel = clamp(distance / 10, -this.speed, this.speed);
            this.x = clamp(this.x - Math.cos(this.angle) * this.vel, 0, 640);
            this.y = clamp(this.y - Math.sin(this.angle) * this.vel, 0, 480);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}