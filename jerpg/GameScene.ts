/// <reference path="definitions.d.ts"/>

class GameScene implements MouseListener {
    layers: Array<GameLayer>;
    events: Array<GameEvent>;
    queue: Array<GameEvent>;
    state: string;
    mouseX: number;
    mouseY: number;

    constructor() {
        this.layers = new Array<GameLayer>();
        this.events = new Array<GameEvent>();
        this.state = "none";
    }

    setState(state: string) {
        this.state = state;
    }

    addEvent(event: GameEvent) {
        console.log("invoking event", event);
        event.invoke(this);
        this.events.push(event);
        return event;
    }

    loopEvents(events: Array<GameEvent>) {
        events[events.length - 1].setNextEvent(events[0]);
        this.queueEvents(events);
    }

    queueEvents(events: Array<GameEvent>) {
        for (let i = 0; i < events.length - 1; i++)
            events[i].setNextEvent(events[i + 1]);
        this.addEvent(events[0]);
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
        if (event.enabled && event.next)
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
    
    mouseMove(x: number, y: number) : this {
        this.layers.forEach(
            (layer: GameLayer) => { layer.mouseMove(x, y) }
        );

        return this;
    }

    mouseDown(x: number, y: number) : this {
        this.layers.forEach(
            (layer: GameLayer) => { layer.mouseDown(x, y) }
        );

        return this;
    }

    mouseUp(x: number, y: number) : this {
        this.layers.forEach(
            (layer: GameLayer) => { layer.mouseUp(x, y) }
        );

        return this;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.layers.forEach(
            (layer: GameLayer) => { layer.render(ctx) }
        );
    }
}
