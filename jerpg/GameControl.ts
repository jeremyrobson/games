/// <reference path="definitions.d.ts"/>

class GameControl extends GameObject {
    mousePressed: boolean;
    fn: Function;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        
        this.setColor(new Color(0,0,255,1));
        this.setTextColor(new Color(255,255,255,1));
        this.setFont("20px Arial");
        this.mousePressed = false;
    }
    
    setFunction(fn: Function) : this {
        this.fn = fn;
        return this;
    }

    mouseMove(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this {
        this.mousePressed = false;
        this.shadow = false;
 
        if (!this.hit(x - offsetX, y - offsetY)) return null;

        return this;
    }

    mouseDown(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this {
        this.mousePressed = false;

        if (!this.hit(x - offsetX, y - offsetY)) return null;

        this.mousePressed = true;

        return this;
    }

    mouseUp(x: number, y: number, offsetX: number = 0, offsetY: number = 0) : this {
        if (!this.hit(x - offsetX, y - offsetY)) return null;

        if (this.mousePressed) {
            this.fn("menu changes json goes here?");
        }

        this.mousePressed = false;

        return this;
    }

    update(scene: GameScene) {
        
    }
    
    render(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        super.render(ctx, offsetX, offsetY);
        
    }

}
