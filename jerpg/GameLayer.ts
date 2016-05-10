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
            (b) => return a.id != b.id;
        );
    }
    
    update(game: GameEngine) {
        this.objects.forEach(
            (obj) => obj.update();
        );
    }
    
    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color.fillStyle;
        ctx.fillRect()
        
        this.objects.forEach(
            (obj) => obj.render(this);
        );
    }
    
}