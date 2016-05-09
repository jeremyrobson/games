interface GameEvent {
    constructor() {
        
    }
    
    invoke(game) {
        
    }
    
    update(game) {
    
    }
    
    render(ctx) {
    
    }
}

class SleepEvent implements GameEvent {
    constructor(duration) {
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

class SpriteEvent implements GameEvent {
    constructor() {
        
    }
    
    invoke(game) {
        
    }
    
    update(game) {
    
    }
    
    render(ctx) {
    
    }
}

class TextEvent implements GameEvent {
    constructor() {
        
    }
    
    invoke(game) {
        
    }
    
    update(game) {
    
    }
    
    render(ctx) {
    
    }
}

class ChangeMapEvent implements GameEvent {
    constructor() {
        
    }
    
    invoke(game) {
        
    }
    
    update(game) {
    
    }
    
    render(ctx) {
    
    }
}

class FadeEvent implements GameEvent {
    constructor(effect, color="black", outspeed=0.1, inspeed=0.1) {
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
            game.gotoNextEvent();
      
        if (this.effect == "fadein" && this.alpha >= 1) {
            game.removeLayer(this.layer);
            game.gotoNextEvent();
        }
    }
}
