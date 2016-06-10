/// <reference path="definitions.d.ts"/>

class GameMenu extends GameLayer {
    
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        
        this.setColor(new Color(0,0,255,1));
        this.setTextColor(new Color(255,255,255,1));
        this.setFont("20px Arial");
    }
    
    mouseMove(x: number, y: number) : this {
        if (!this.hit(x, y)) return null;

        this.objects.forEach(
           (obj: GameObject) => { obj.mouseMove(x, y) }
        );

        return this;
    }

    mouseDown(x: number, y: number, button: number) : this {
        if (!this.hit(x, y)) return null;

        console.log("menu mouse down", x, y, button);

        return this;
    }

    mouseUp(x: number, y: number, button: number) : this {
        if (!this.hit(x, y)) return null;


        return this;
    }

    update(scene: GameScene) {
        
    }
    
    render(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        super.render(ctx, offsetX, offsetY);
        
    }

}
