/// <reference path="definitions.d.ts"/>

class GameEngine {
    ctx: CanvasRenderingContext2D;
    state: string;
    layers: Array<GameLayer>;
    events: Array<GameEvent>;
    
    constructor() {
        this.state = "none";
        this.layers = new Array<GameLayer>();
        this.events = new Array<GameEvent>();
    }

    setState(state: string) {
        this.state = state;
    }
    
    addEvent(event: GameEvent) {
        event.invoke(this);
        this.events.push(event);
    }
    
    addLayer(layer: GameLayer) {
        this.layers.push(layer);
    }
    
    removeLayer(a: GameLayer) {
        this.layers = this.layers.filter(
            (b) => return a.id != b.id;
        );
    }
    
    removeEvent(event: GameEvent) {
        if (event.next)
            this.addEvent(event.next);
    
        this.events = this.events.filter(
            (b) => return a.id != b.id;
        );
    }
    
    update() {
        this.events.forEach(
            (event) => event.update(this);
        );
    
        this.layers.forEach(
            (layer) => layer.update(this);
        );
    }
    
    render() {
        this.layers.forEach(
            (layer) => layer.render(this.ctx);
        );
    }
    
}