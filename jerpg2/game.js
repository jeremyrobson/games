var canvas, context;
var user;
var module;

function loop() {
    module.loop();
    draw();
    
    window.requestAnimationFrame(loop);
}

function mouseDown(e) {
    var mx = e.offsetX;
    var my = e.offsetY;
    
    module = module.mouseDown(mx, my);
}

function draw() {
    module.draw(context);
}

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.onmousedown = mouseDown;
    
    user = new GameUser();
    module = new GameMap("world", null);
    
    window.requestAnimationFrame(loop);
}

window.onload = function() {
    init();
}
