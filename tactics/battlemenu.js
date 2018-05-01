class MenuItem {
    constructor(text, fn) {
        this.rect = new Rect(0, 0, 0, 0);
        this.text = text;
        this.fn = fn;
        this.highlight = false;
        this.highlightColor = "rgba(100,100,200,0.5)";
    }
    
    invoke(menu) {
        this.fn(menu);
    }
    
    mouse_down(mx, my, menu) {
        if (this.rect.hit(mx, my)) {
            return this.invoke(menu);
        }
    }
    
    mouse_move(mx, my) {
        if (this.rect.hit(mx, my)) {
            this.highlight = true;
        }
    }
    
    draw(ctx, parentRect, fontsize) {
        var dx = this.rect.x + parentRect.x;
        var dy = this.rect.y + parentRect.y;
        ctx.fillStyle = this.highlight ? this.highlightColor : this.rect.color;
        ctx.fillRect(dx, dy, parentRect.w, fontsize);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = fontsize + "px Arial";
        ctx.fillText(this.text, dx, dy);
    }
}

class Menu {
    constructor(rect, fontsize, items, parent) {
        this.rect = rect;
        this.items = items;
        this.fontsize = fontsize;
        this.parent = parent;
        
        this.items.forEach(function(item, i) {
            item.rect = new Rect(0, i*fontsize, this.rect.w, fontsize, "rgba(0,0,255,0.5)");
        }, this);
    }
    
    mouse_down(mx, my) {
        if (this.rect.hit(mx, my)) {
            this.items.forEach(function(item) {
                item.mouse_down(mx - this.rect.x, my - this.rect.y, this);
            }, this);
        }
    }
    
    mouse_move(mx, my) {
        if (this.rect.hit(mx, my)) {
            this.items.forEach(function(item) {
                item.highlight = false;
                item.mouse_move(mx - this.rect.x, my - this.rect.y);
            }, this);
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.rect.color;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    
        this.items.forEach((item) => {
            item.draw(ctx, this.rect, this.fontsize);
        }, this);
    }
}

class SubMenu extends Menu {
    constructor(menu, items) {
        super(menu.rect, menu.fontsize, items, menu);
    }
}