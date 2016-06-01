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
        
        let gd = new TextBox(20, 20, 50, 50); //change to GameMenu or GameDialog?
        gd.setColor(new Color(0,255,255,1));

        layer.addObject(gd);
        scene.addLayer(layer);
        
        let fade = new FadeEvent("fadein", gd, 1000);

        let arr: Array<string> = ["Hello", "How are you?"];
        let te = new DialogEvent(arr, gd);

        let me = new TranslateObjectEvent(gd).setTarget(200, 200).setSpeed(1);

        let te2 = new DialogEvent(["I am fine."], gd);

        scene.queueEvents([fade, te, me, te2]);

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
