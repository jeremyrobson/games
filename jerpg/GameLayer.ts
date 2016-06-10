/// <reference path="definitions.d.ts"/>

//todo: layers exist on seperate canvases? 

class GameLayer extends GameObject {
    objects: Array<GameObject>;
    
    constructor(x: number = 0, y: number = 0, width: number = 640, height: number = 480) {
        super(0, 0, width, height);

        this.objects = new Array<GameObject>();
    }

    addObject(obj: GameObject): number {
        return this.objects.push(obj);
    }
    
    removeObject(obj: GameObject): number {
        this.objects = this.objects.filter(
            (a: GameObject) => { return obj.id != a.id }
        );
        return this.objects.length;
    }
    
    update(scene: GameScene) {
        this.objects.forEach(
            (obj: GameObject) => { obj.update(scene) }
        );
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

        this.objects.forEach(
            (obj: GameObject) => { obj.mouseDown(x, y, button) }
        );

        return this;
    }

    mouseUp(x: number, y: number, button: number) : this {
        if (!this.hit(x, y)) return null;

        this.objects.forEach(
            (obj: GameObject) => { obj.mouseUp(x, y, button) }
        );

        return this;
    }

    render(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0) {
        super.render(ctx);
        
        this.objects.forEach(
            (obj: GameObject) => { obj.render(ctx, this.x, this.y) }
        );
    }
    
}
