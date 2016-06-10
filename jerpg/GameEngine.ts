/// <reference path="definitions.d.ts"/>

class GameEngine {
    window: Window;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    timerID: number;
    scene: GameScene;
    mouseX: number;
    mouseY: number;
    //lasttick: number;

    constructor(window: Window, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.window = window;
        this.canvas = canvas;
        this.ctx = context;
    
        this.canvas.onmousemove = this.mouseMove.bind(this);
        this.canvas.onmousedown = this.mouseDown.bind(this);
        this.canvas.onmouseup = this.mouseUp.bind(this);
        //this.canvas.onmouseover = mouseEnter;
        //this.canvas.onmouseout = mouseLeave;

        let scene = new GameScene();
        
        let layer = new GameLayer(0, 0, this.canvas.width, this.canvas.height);
        layer.setColor(new Color(0,0,0,1));
        
        let tb = new TextBox(20, 20, 240, 120); //change to GameMenu or GameDialog?

        layer.addObject(tb);
        scene.addLayer(layer);
        
        let fade = new FadeEvent("fadein", tb, 1000);

        let arr: Array<string> = [
            "Hello@5\n",
            "How are you?@5\n",
            "I am really hoping that this text will wrap within the set parameters.@5\n",
            "It's@5 just@5 that@5 I can't believe this works.@9"
        ];
        let de = new DialogEvent(arr, tb);

        let toe = new TranslateObjectEvent(tb).setTarget(200, 200).setSpeed(1);

        let de2 = new DialogEvent(["\n\n\nI@3 @3a@3m@3 @3f@3i@3n@3e@3.@3"], tb);

        let menu = new GameMenu(100, 100, 200, 100);

        let aoe = new AddObjectsEvent(layer, 1, menu);

        let ome  = new OpenMenuEvent(menu);

        scene.queueEvents([fade, de, toe, de2, aoe, ome]);

        this.setScene(scene);
    }

    start() {
        console.log("Engine started with timerID " + this.timerID);
        //this.lasttick = performance.now();
        this.update();
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

    setMouseCoords(e: MouseEvent) {
        this.mouseX = (e.layerX) ? e.layerX : e.offsetX;
        this.mouseY = (e.layerY) ? e.layerY : e.offsetY;
    }

    mouseMove(e: MouseEvent) {
       this.setMouseCoords(e);
       this.scene.mouseMove(this.mouseX, this.mouseY);
    }

    mouseDown(e: MouseEvent) {
        this.setMouseCoords(e);
        this.scene.mouseDown(this.mouseX, this.mouseY, e.button);
    }

    mouseUp(e: MouseEvent) {
        this.setMouseCoords(e);
        this.scene.mouseUp(this.mouseX, this.mouseY, e.button);
    }

    render() {
        this.scene.render(this.ctx);
    }
    
}
