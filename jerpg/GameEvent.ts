/// <reference path="definitions.d.ts"/>

interface IGameEvent {
    invoke?(scene: GameScene) : void;
    update?(scene: GameScene) : void;
    //render?(ctx: CanvasRenderingContext2D) : void;
    done?(ctx: GameScene) : void;
}

class GameEvent implements IGameEvent {
    id: number;
    enabled: boolean;
    lasttick: number;
    interval: number;
    duration: number;
    count: number;
    next: GameEvent;
    
    constructor() {
        this.id = Math.floor(Math.random() * 1000000);
        this.setEnabled(true);
        this.setDuration(Infinity);
        this.count = 0;
    }
    
    setEnabled(value: boolean) {
        this.enabled = value;
        return this;
    }
    
    setDuration(value: number) {
        this.duration = value;
        return this;
    }
    
    setInterval(value: number) {
        this.interval = value;
        return this;
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
    
    constructor(obj: GameObject) {
        super();
        this.object = obj;
        this.startX = obj.x;
        this.startY = obj.y;
        this.setTarget(this.startX, this.startY);
        this.setSpeed(1);
        this.setInterval(1);
    }
    
    setTarget(x: number, y: number) {
        this.targetX = x;
        this.targetY = y;
        return this;
    }
    
    setSpeed(value: number) {
        this.speed = value;
        return this;
    }
    
    invoke(scene: GameScene) {
        this.angle = getAngle(this.object.x, this.object.y, this.targetX,this.targetY);
        this.lasttick = performance.now();
    }
    
    update(scene: GameScene) {
        super.update(scene);
        
        //todo: update angle to allow "chasing"?
        if (performance.now() > this.lasttick + this.interval) {
            this.object.move(Math.cos(this.angle) * this.speed, Math.sin(this.angle) * this.speed);
            
            let distance: number = getDistance(this.object.x, this.object.y, this.targetX, this.targetY);
            if (distance <= this.speed)
                scene.removeEvent(this);
            
            this.lasttick = performance.now();
        }
        
    }
}

class ChangeMapEvent extends GameEvent {
    constructor() {
        super();
    }
    
    invoke(scene: GameScene) {
        
    }
    
    update(scene: GameScene) {
        super.update(scene);
    }
}

class FadeEvent extends GameEvent {
    effect: string;
    outspeed: number;
    inspeed: number;
    layer: GameLayer;
    object: any;

    //todo: calculate inspeed/outspeed from duration
    constructor(effect: string, object: any, duration: number) {
        super();
        this.effect = effect;
        this.outspeed = 0.01;
        this.inspeed = 0.01;
        this.object = object;
            //.setColor(new Color(0, 0, 0, 1))
            //.setAlpha((effect == "fadeout") ? 1.0 : 0.0)
    }
    
    /*
    setColor(color: Color) {
        this.color = color;
        return this;
    }
    */

    setOutspeed(value: number) {
        this.outspeed = value;
        return this;   
    }
    
    setInspeed(value: number) {
        this.inspeed = value;
        return this;
    }
    
    done(scene: GameScene) {    
        scene.removeEvent(this);
    }
    
    invoke(scene: GameScene) {
    }
    
    update(scene: GameScene) {
        super.update(scene);
        
        if (this.effect == "fadeout" && this.layer.alpha > 0)
            this.object.setAlpha(this.object.alpha - this.outspeed);
        else if (this.effect == "fadein" && this.layer.alpha < 1)
            this.object.setAlpha(this.object.alpha + this.inspeed);
            
        if (this.effect == "fadeout" && this.object.alpha <= 0)
            this.done(scene);
      
        if (this.effect == "fadein" && this.object.alpha >= 1)
            this.done(scene);
    }
}

class DialogEvent extends GameEvent {
    textQueue: Array<string>;
    letters: Array<string>;
    textBox: TextBox;
    
    constructor(textArray: Array<string>, textBox: TextBox) {
        super();

        this.textQueue = textArray;
        this.textBox = textBox;
    }

    update(scene: GameScene) {
        //super.update(scene);
        if (this.letters) {
            if (this.letters.length > 0) {
                this.textBox.addLetter(this.letters.shift());
            }
            else {
                this.letters = null;
            }
        }
        else {
            if (this.textQueue.length > 0) {
                this.letters = this.textQueue.shift().split("");
            }
        }
    }
}
