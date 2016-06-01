/// <reference path="definitions.d.ts"/>

class GameMenu extends GameLayer {
    
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        
        this.setColor(new Color(0,0,255,1));
        this.setTextColor(new Color(255,255,255,1));
        this.setFont("20px Arial");
    }
    
    update(scene: GameScene) {
        
    }
    
    render(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        super.render(ctx, offsetX, offsetY);
        
    }

}