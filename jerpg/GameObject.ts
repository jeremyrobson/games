/// <reference path="definitions.d.ts"/>

//todo: implements Drawable, Sortable
//remember, dialogs go on top layer

class GameObject implements MouseListener {
    id:string;
    x:number; y:number; width:number; height:number;
    color: Color;
    alpha: number;
    font: string;
    textColor: Color;
    border: boolean;
    borderSize: number;
    borderColor: Color;
    shadow: boolean;
    draggable: boolean;
    mouseX: number;
    mouseY: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setColor(new Color(255,0,0,1));
        this.setTextColor(new Color(255,255,0,1));
        this.setFont("24px Arial");
    }
    
    setColor(color: Color): this {
        this.color = color;
        this.alpha = color.a;
        return this;
    }
    
    setAlpha(alpha: number): any {
        if (alpha < 0) alpha = 0;
        this.alpha = alpha;
        this.color.a = alpha;
        return this;
    }

    setTextColor(color: Color): any {
        this.textColor = color;
        return this;
    }

    setFont(font: string): any {
        this.font = font;
        return this;
    }

    hit(mx: number, my: number): boolean {
        return mx >= this.x && my >= this.y
        && mx < this.width && my < this.height;
    }

    move(dx: number, dy: number): any {
        this.x += dx;
        this.y += dy;
        return this;
    }

    update(scene: GameScene) {
        
    }
  
    mouseMove(x: number, y: number) : this { return this; }
    mouseDown(x: number, y: number, button: number) : this { return this;}
    mouseUp(x: number, y: number, button: number) : this { return this; }

    drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        ctx.fillStyle = this.color.fillStyle;
        ctx.fillRect(x, y, this.width, this.height);

    }
    
    drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
        ctx.fillStyle = this.textColor.fillStyle;
        ctx.font = this.font;
        ctx.textBaseline = "top";
        ctx.fillText(text, x, y);
    }

    render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0) {
        let drawX = this.x + offsetX;
        let drawY = this.y + offsetY;
        this.drawRect(ctx, drawX, drawY, this.width, this.height);
        //this.drawText(ctx, this.id, drawX, drawY);
    

    }
    
}
