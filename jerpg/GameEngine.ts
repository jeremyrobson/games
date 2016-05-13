/// <reference path="definitions.d.ts"/>

class GameEngine {
    window: Window;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    timerID: number;
    scene: GameScene;
    //lasttick: number;

    constructor(window: Window, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.window = window;
        this.canvas = canvas;
        this.ctx = context;
        
        let scene = new GameScene();
        
        let layer = new GameLayer(this.canvas.width, this.canvas.height);
        layer.setColor(new Color(0,0,0,1));
        
        let obj = new GameObject(20, 20, 50, 50, new Color(255,0,0,1));
        layer.addObject(obj);
        scene.addLayer(layer);
        
        let event = new TranslateObjectEvent(obj, 200, 200).setInterval(10).setSpeed(10);
        scene.addEvent(event);
        
        let event2 = new TranslateObjectEvent(obj, 400, 0).setInterval(10).setSpeed(1);
        event.setNextEvent(event2);
        
        this.setScene(scene);
    }

    start() {
        //this.lasttick = performance.now();
        this.update();
        console.log("Engine started with timerID " + this.timerID);
    }
    
    setScene(scene: GameScene) {
        this.scene = scene;
    }
    
    update() {
        this.scene.update(this);
        
        this.render();
        //this.lasttick = performance.now();
        this.timerID = this.window.requestAnimationFrame(() => this.update());
    }
    
    render() {
        this.scene.render(this.ctx);
    }
    
}