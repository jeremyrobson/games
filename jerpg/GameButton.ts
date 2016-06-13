/// <reference path="definitions.d.ts"/>

class GameButton extends GameControl {
    caption: string;

    constructor(caption: string, x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        
        this.caption = caption;
        this.setColor(new Color(0,0,155,1));
        this.setTextColor(new Color(255,255,255,1));
        this.setFont("20px Arial");
        this.border = true;
        this.shadowColor = new Color(255,255,255,1);
        this.shadowBlur = 16;
    }

    mouseMove(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this {
        if (!super.mouseMove(x, y, offsetX, offsetY)) return null;

        this.shadow = true;

        return this;
    }

    mouseDown(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this {
        if (!super.mouseDown(x, y, offsetX, offsetY)) return null;

        return this;
    }

    mouseUp(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this {
        if (!super.mouseUp(x, y, offsetX, offsetY)) return null;

        return this;
    }

    update(scene: GameScene) {
        
    }
    
    render(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        super.render(ctx, offsetX, offsetY);
        let dx = this.x + offsetX + 10;
        let dy = this.y + offsetY + 10;

        this.drawText(ctx, this.caption, dx, dy);
    }

}
