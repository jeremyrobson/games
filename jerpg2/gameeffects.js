class Particle {
    constructor(x, y, size, color, life) {
        this.startx = x;
        this.starty = y;
        this.x = this.startx;
        this.y = this.starty;
        this.size = size;
        this.color = color;
        this.life = life;
    }
}

class Sparkle extends Particle {
    constructor(x, y, size, color, life) {
        super(x, y, size, color, life);
        
        this.speed = 0.2;
        this.amp = 2;
        this.freq = 1/16;
    }
    
    loop() {
        this.life -= 1;
        
        this.move();
    }
    
    move() {
        this.x += this.speed;
        this.y = this.starty + Math.sin(this.x * Math.PI * this.freq) * this.amp;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }
}