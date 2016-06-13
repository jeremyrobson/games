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
    shadowColor: Color;
    shadowBlur: number;
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
        this.border = false;
        this.borderSize = 2;
        this.borderColor = new Color(0,255,0,1);
        this.shadow = false;
        this.shadowColor = new Color(0,0,0,1);
        this.shadowBlur = 0;

        console.log(this.width, this.height);
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
        && mx < this.x + this.width && my < this.y + this.height;
    }

    move(dx: number, dy: number): any {
        this.x += dx;
        this.y += dy;
        return this;
    }

    update(scene: GameScene) {
        
    }
  
    mouseMove(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this { return this; }
    mouseDown(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this { return this; }
    mouseUp(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this { return this; }

    drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        ctx.beginPath();
        ctx.fillStyle = this.color.fillStyle;
        ctx.rect(x, y, this.width, this.height);

        if (this.shadow) {
            ctx.shadowColor = this.shadowColor.fillStyle;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        else
            ctx.shadowColor = "transparent";

        if (this.border) {
            ctx.strokeStyle = this.borderColor.fillStyle;
            ctx.lineWidth = this.borderSize;
            ctx.stroke();
        }

        ctx.fill();
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
    

    }
    
}
