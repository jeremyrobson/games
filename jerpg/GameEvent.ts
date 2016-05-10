interface IGameEvent {
    invoke(game: Game) : void;
    update(game: Game) : void;
    render?(ctx: CanvasRenderingContext2D) : void;
}

class GameEvent implements IGameEvent {
    id: number;
    remove: boolean;
    
    constructor() {
        this.id = Math.floor(Math.random() * 1000000);
        this.remove = false;
    }
}

class SleepEvent extends GameEvent {
    duration: double;
    count: number;

    constructor(duration:number = 1000) {
        super();
        this.duration = duration;
        this.count = 0;
    }
    
    invoke(game) {
        game.setState("sleep");
    }
    
    update(game) {
        this.count++;
        if (this.count >= this.duration)
            game.gotoNextState();
    }
}

class SpriteEvent extends GameEvent {
    constructor() {
        super();
    }
    
    invoke(game) {
        
    }
    
    update(game) {
    
    }
    
    render(ctx) {
    
    }
}

class TextEvent extends GameEvent {
    constructor() {
        super();
    }
    
    invoke(game) {
        
    }
    
    update(game) {
    
    }
    
    render(ctx) {
    
    }
}

class ChangeMapEvent extends GameEvent {
    constructor() {
        super();
    }
    
    invoke(game) {
        
    }
    
    update(game) {
    
    }
    
    render(ctx) {
    
    }
}

class FadeEvent extends GameEvent {
    effect: string;
    color: string;
    outspeed: number;
    inspeed: number;
    layer: GameLayer;

    constructor(effect:string="fade", color:string="black", outspeed:number=0.1, inspeed:number=0.1) {
        super();
        this.effect = effect;
        this.outspeed = outspeed;
        this.inspeed = inspeed;
        this.layer = new GameLayer(); //giant rectangle over game view
        this.layer.color = color;
        this.layer.alpha = (effect == "fadeout") ? 1.0 : 0.0;
    }
    
    invoke(game) {
        game.setState("fade");
        game.addLayer(this.layer);
    }
    
    update(game) {
        if (this.effect == "fadeout" && this.alpha > 0)
            this.layer.alpha -= this.outspeed;
        else if (this.effect == "fadein" && this.alpha < 1)
            this.layer.alpha += this.inspeed;
            
        if (this.effect == "fadeout" && this.alpha <= 0)
            this.remove = true;
      
        if (this.effect == "fadein" && this.alpha >= 1) {
            game.removeLayer(this.layer);
            this.remove = true;
        }
    }
}
