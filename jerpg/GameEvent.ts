/// <reference path="definitions.d.ts"/>

interface IGameEvent {
    invoke?(scene: GameScene) : void;
    update?(scene: GameScene) : void;
    render?(ctx: CanvasRenderingContext2D) : void;
}

class GameEvent implements IGameEvent {
    id: number;
    lasttick: number;
    interval: number;
    duration: number;
    count: number;
    next: GameEvent;
    
    constructor() {
        this.id = Math.floor(Math.random() * 1000000);
    }
    
    setNextEvent(next: GameEvent) {
        this.next = next;
        return this;
    }
    
    invoke(scene: GameScene) { }
    
    update(scene: GameScene) {
        this.count++;
        if (this.count >= this.duration)
            scene.removeEvent(this);
    }
}

class SleepEvent extends GameEvent {
    constructor() {
        super();

    }
    
    invoke(scene: GameScene) {
        scene.setState("sleep");
    }
}

class TranslateObjectEvent extends GameEvent {
    object: GameObject;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    speed: number;
    angle: number;
    
    constructor(obj: GameObject, x:number, y:number) {
        super();
        this.object = obj;
        this.startX = obj.x;
        this.startY = obj.y;
        this.targetX = x;
        this.targetY = y;
        this.speed = 1;
        this.interval = 1;
    }
    
    setInterval(interval: number) {
        this.interval = interval;
        return this;
    }
    
    setSpeed(speed: number) {
        this.speed = speed;
        return this;
    }
    
    invoke(scene: GameScene) {
        this.angle = getAngle(this.object.x, this.object.y, this.targetX,this.targetY);
        this.lasttick = performance.now();
    }
    
    update(scene: GameScene) {
        if (performance.now() > this.lasttick + this.interval) {
            this.object.x += Math.cos(this.angle) * this.speed;
            this.object.y += Math.sin(this.angle) * this.speed;
            
            let distance = getDistance(this.object.x, this.object.y, this.targetX, this.targetY);
            if (distance < 25)
                scene.removeEvent(this);
            
            this.lasttick = performance.now();
        }
        
    }
    
    render(ctx: CanvasRenderingContext2D) {
    
    }
}

class DialogEvent extends GameEvent {
    textArray: Array<string>;
    textIndex: number;
    currentPos: number;
    
    constructor() {
        super();
    }
    
    invoke(scene: GameScene) {
        
    }
    
    update(scene: GameScene) {
    
    }
    
    render(ctx: CanvasRenderingContext2D) {
    
    }
}

class ChangeMapEvent extends GameEvent {
    constructor() {
        super();
    }
    
    invoke(scene: GameScene) {
        
    }
    
    update(scene: GameScene) {
    
    }
    
    render(ctx: CanvasRenderingContext2D) {
    
    }
}

class FadeEvent extends GameEvent {
    effect: string;
    color: Color;
    outspeed: number;
    inspeed: number;
    layer: GameLayer;

    constructor() {
        super();
        this.effect = "fadeout";
        this.outspeed = 0.1;
        this.inspeed = 0.1;
        this.layer = new GameLayer(); //todo, layer canvases on page
        this.layer.color = new Color(255, 0, 0, 1.0);
        this.layer.alpha = 1.0;
    }
    
    setEffect(effect:string) {
        this.effect = effect;
        return this;
    }
    
    setColor(color:Color) {
        this.color = color;
        return this;
    }
    
    setOutspeed(outspeed:number) {
        this.outspeed = outspeed;
        return this;   
    }
    
    setInspeed(inspeed:number) {
        this.inspeed = inspeed;
        return this;
    }
    
    invoke(scene: GameScene) {
        //scene.setState("fadeout");
        scene.addLayer(this.layer);
    }
    
    update(scene: GameScene) {
        if (this.effect == "fadeout" && this.layer.alpha > 0)
            this.layer.alpha -= this.outspeed;
        else if (this.effect == "fadein" && this.layer.alpha < 1)
            this.layer.alpha += this.inspeed;
            
        if (this.effect == "fadeout" && this.layer.alpha <= 0)
            scene.removeEvent(this);
      
        if (this.effect == "fadein" && this.layer.alpha >= 1) {
            scene.removeLayer(this.layer);
            scene.removeEvent(this);
        }
    }
}
