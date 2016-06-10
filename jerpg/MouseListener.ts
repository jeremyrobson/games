interface MouseListener {
    mouseX: number;
    mouseY: number;
    mouseButton?: number;

    mouseMove?(x: number, y:number): GameObject | GameScene;
    mouseDown?(x: number, y:number, button:number): GameObject | GameScene;
    mouseUp?(x:number, y:number, button:number): GameObject | GameScene;
    mouseDrag?(x:number, y:number, button:number): GameObject | GameScene;
    mouseEnter?(x:number, y:number): GameObject | GameScene;
    mouseLeave?(x:number, y:number): GameObject | GameScene;
}
