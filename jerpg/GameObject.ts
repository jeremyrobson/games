/// <reference path="definitions.d.ts"/>

class GameObject {
    id:string;
    x:number; y:number; width:number; height:number;
    color: Color;
    alpha: number;
    fillStyle: string;
    
    constructor(x:number,y:number,width:number,height:number,color:Color) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setColor(color);
    }
    
    setColor(color: Color) {
        this.color = color;
        this.alpha = color.a;
        this.fillStyle = color.toString();
    }

    update(scene: GameScene) {
        
    }
    
    render(ctx: CanvasRenderingContext2D, parent: GameLayer) {
        let drawX = this.x + parent.x;
        let drawY = this.y + parent.y;
    
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(drawX, drawY, this.width, this.height);
        
        ctx.fillStyle = "rgb(255,255,0)";
        ctx.font = "24px Arial";
        ctx.textBaseline = "top";
        ctx.fillText(this.id, drawX, drawY);
    }
    
}