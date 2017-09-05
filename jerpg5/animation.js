class Animation {
    
        /**
         *  @param {int} x - x coordinate
         *  @param {int} y - y coordinate
         *  @param {int} size - font size in pixels
         *  @param {string} sprite - sprite emoji
         */
        constructor(x, y, size, sprite) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.sprite = sprite;
            this.life = 100;
            this.remove = false;
        }
    
        update() {
            this.life--;
            if (this.life <= 0) {
                this.remove = true;
            }
        }
    
        draw(ctx, offsetx, offsety) {
            var dx = this.x - offsetx;
            var dy = this.y - offsety;
            ctx.save();
            ctx.textBaseline = "top";
            ctx.font = this.size + "px Monospace";
            ctx.fillText(this.sprite, dx, dy);
            ctx.restore();
        }
    
    }