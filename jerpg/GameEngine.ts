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
        
        let layer = new GameLayer(0, 0, this.canvas.width, this.canvas.height);
        layer.setColor(new Color(0,0,0,1));
        
        let d = new GameDialog(["hello", "how are you?", "I am fineeeee"], 20, 20, 50, 50);

        layer.addObject(d);
        scene.addLayer(layer);
        
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