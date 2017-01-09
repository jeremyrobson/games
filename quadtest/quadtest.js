var canvas, context;
var points = [];
var quads;
const DIVISIONS = 10;
const QUAD_WIDTH = 640 / DIVISIONS;
const QUAD_HEIGHT = 480 / DIVISIONS;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

class Point {
    constructor() {
        this.id = guid();
        this.x = Math.floor(Math.random() * 640);
        this.y = Math.floor(Math.random() * 480);
        this.vx = Math.random() - 0.5;
        this.vy = Math.random() - 0.5;
        this.qx = Math.floor(this.x / QUAD_WIDTH);
        this.qy = Math.floor(this.y / QUAD_HEIGHT);
        this.lqx = this.qx;
        this.lqy = this.qy;
    }
    
    loop() {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        
        if (this.x < 0) {
            this.vx = -this.vx;
            this.x = 0;
        }
            
        if (this.x >= 640) {
            this.vx = -this.vx;
            this.x = 640 - 1;
        }
        
        if (this.y < 0) {
            this.vy = -this.vy;
            this.y = 0;
        }
        
        if (this.y >= 480) {
            this.vy = -this.vy;
            this.y = 480 - 1;
        }
        
        this.qx = Math.floor(this.x / QUAD_WIDTH);
        this.qy = Math.floor(this.y / QUAD_HEIGHT);
        
        //if point entered a new quad
        if (this.qx != this.lqx || this.qy != this.lqy) {
            
            var oldarr = quads[this.lqx][this.lqy];
            var newarr = []; 
            var length = oldarr.length;
            
            //create new array, filter object's id
            for (var i=0; i<length; i++) {
                if (oldarr[i].id !== this.id)
                    newarr.push(oldarr[i]);
            }
            
            quads[this.lqx][this.lqy] = newarr;
            
            //add to new quad and save new index
            quads[this.qx][this.qy].push(this);
            
            this.lqx = this.qx;
            this.lqy = this.qy;
        }
        
        
    }
    
    draw(ctx) {
        ctx.fillStyle = "rgb(255, 255, 0)";
        ctx.fillRect(this.x,this.y,2,2);
    }
}

function loop() {
    points.forEach(function(p) {
        p.loop();   
    });
    
    draw();
    
    window.requestAnimationFrame(loop);
}

function draw() {
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0,0,640,480);
    
    context.lineWidth = 1;
    context.strokeStyle = "rgba(0,255,0,0.5)";
    for (var x=0;x<DIVISIONS;x++) {
        for (var y=0;y<DIVISIONS;y++) {
            context.strokeRect(x*QUAD_WIDTH,y*QUAD_HEIGHT,QUAD_WIDTH,QUAD_HEIGHT);
            
            context.fillStyle = "rgba(0,255,255,0.5)";
            context.font = "16px Arial";
            context.textBaseline = "top";
            context.fillText(quads[x][y].length, x*QUAD_WIDTH,y*QUAD_HEIGHT);
        }
    }
    
    points.forEach(function(p) {
        p.draw(context);
    });
}

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    quads = [];
    for (var qx = 0; qx < DIVISIONS; qx++) {
        quads[qx] = [];
        for (var qy = 0; qy < DIVISIONS; qy++) {
            quads[qx][qy] = [];
        }
    }
    
    for (var i=0; i<50; i++) {
        var point = new Point();
        points.push(point);
        
        point.qindex = quads[point.qx][point.qy].push(point);
    }
    
    window.requestAnimationFrame(loop);
};