/// <reference path="definitions.d.ts"/>

class GameLayer extends GameObject {
    objects: Array<GameObject>;
    
    constructor(width: number = 640, height: number = 480) {
        super(0, 0, width, height, new Color(255,255,255,1));

        this.objects = new Array<GameObject>();
    }

    addObject(obj: GameObject) {
        this.objects.push(obj);
    }
    
    removeObject(obj: GameObject) {
        this.objects = this.objects.filter(
            (a: GameObject) => { return obj.id != a.id }
        );
    }
    
    update(scene: GameScene) {
        this.objects.forEach(
            (obj: GameObject) => { obj.update(scene) }
        );
    }
    
    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color.fillStyle;
        ctx.fillRect(0, 0, this.width, this.height);
        
        this.objects.forEach(
            (obj: GameObject) => { obj.render(ctx, this) }
        );
    }
    
}