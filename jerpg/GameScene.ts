/// <reference path="definitions.d.ts"/>

class GameScene {
    layers: Array<GameLayer>;
    events: Array<GameEvent>;
    state: string;
    
    constructor() {
        this.layers = new Array<GameLayer>();
        this.events = new Array<GameEvent>();
        this.state = "none";
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
    
    removeLayer(layer: GameLayer) {
        this.layers = this.layers.filter(
            (a: GameLayer) => { return layer.id != a.id }
        );
    }
    
    removeEvent(event: GameEvent) {
        if (event.next)
            this.addEvent(event.next);
    
        this.events = this.events.filter(
            (a: GameEvent) => { return event.id != a.id }
        );
    }
    
    update(game: GameEngine) {
        this.events.forEach(
            (event: GameEvent) => { event.update(this) }
        );
    
        this.layers.forEach(
            (layer: GameLayer) => { layer.update(this) }
        );
    }
    
    render(ctx: CanvasRenderingContext2D) {
        this.layers.forEach(
            (layer: GameLayer) => { layer.render(ctx) }
        );
    }
}