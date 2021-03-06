/// <reference path="definitions.d.ts"/>

class GameMenu extends GameLayer {
    
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        
        this.setColor(new Color(0,0,255,1));
        this.setTextColor(new Color(255,255,255,1));
        this.setFont("20px Arial");
        this.border = true;
    }
    
    mouseMove(x: number, y: number, offsetX: number = 0, offsety: number = 0) : this {
        if (!this.hit(x, y)) return null;

        this.objects.forEach(
           (obj: GameObject) => { obj.mouseMove(x, y, this.x, this.y) }
        );

        return this;
    }

    mouseDown(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this {
        if (!this.hit(x, y)) return null;

        this.objects.forEach(
            (obj: GameObject) => { obj.mouseDown(x, y, this.x, this.y) }
        );

        return this;
    }

    mouseUp(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this {
        if (!this.hit(x, y)) return null;

        this.objects.forEach(
            (obj: GameObject) => { obj.mouseUp(x, y, this.x, this.y) }
        );

        return this;
    }

    update(scene: GameScene) {
        
    }
    
    render(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        super.render(ctx, offsetX, offsetY);
       
        this.objects.forEach(
            (obj: GameObject) => { obj.render(ctx, this.x, this.y) }  
        );
    }

}
