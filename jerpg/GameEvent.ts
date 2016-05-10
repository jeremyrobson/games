/// <reference path="definitions.d.ts"/>

interface IGameEvent {
    invoke?(game: Game) : void;
    update?(game: Game) : void;
    render?(ctx: CanvasRenderingContext2D) : void;
}

class GameEvent implements IGameEvent {
    id: number;
    duration: double;
    count: number;
    next: GameEvent;
    
    constructor(next?: GameEvent) {
        this.id = Math.floor(Math.random() * 1000000);
        this.next = next;
    }
    
    update(game: GameEngine) {
        this.count++;
        if (this.count >= this.duration)
            game.removeEvent(this);
    }
}

class SleepEvent extends GameEvent {
    constructor(event:GameEvent, duration:number = 1000) {
        super(event);
        this.duration = duration;
        this.count = 0;
    }
    
    invoke(game: GameEngine) {
        game.setState("sleep");
    }
}

class SpriteEvent extends GameEvent {
    constructor(event:GameEvent) {
        super(event);
    }
    
    invoke(game: GameEngine) {
        
    }
    
    update(game: GameEngine) {
    
    }
    
    render(ctx: CanvasRenderingContext2D) {
    
    }
}

class TextEvent extends GameEvent {
    constructor(event:GameEvent) {
        super(event);
    }
    
    invoke(game: GameEngine) {
        
    }
    
    update(game: GameEngine) {
    
    }
    
    render(ctx: CanvasRenderingContext2D) {
    
    }
}

class ChangeMapEvent extends GameEvent {
    constructor(event:GameEvent) {
        super(event);
    }
    
    invoke(game: GameEngine) {
        
    }
    
    update(game: GameEngine) {
    
    }
    
    render(ctx: CanvasRenderingContext2D) {
    
    }
}

class FadeEvent extends GameEvent {
    effect: string;
    color: string;
    outspeed: number;
    inspeed: number;
    layer: GameLayer;

    constructor(event:GameEvent, effect:string="fade", color:string="black", outspeed:number=0.1, inspeed:number=0.1) {
        super(event);
        this.effect = effect;
        this.outspeed = outspeed;
        this.inspeed = inspeed;
        this.layer = new GameLayer(); //giant rectangle over game view
        this.layer.color = color;
        this.layer.alpha = (effect == "fadeout") ? 1.0 : 0.0;
    }
    
    invoke(game: GameEngine) {
        game.setState("fade");
        game.addLayer(this.layer);
    }
    
    update(game: GameEngine) {
        if (this.effect == "fadeout" && this.alpha > 0)
            this.layer.alpha -= this.outspeed;
        else if (this.effect == "fadein" && this.alpha < 1)
            this.layer.alpha += this.inspeed;
            
        if (this.effect == "fadeout" && this.alpha <= 0)
            game.removeEvent(this);
      
        if (this.effect == "fadein" && this.alpha >= 1) {
            game.removeLayer(this.layer);
            game.removeEvent(this);
        }
    }
}
