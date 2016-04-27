class Game {
	constructor(window, canvas, context) {
		this._window = window;
		this._canvas = canvas;
		this._context = context;
		this._state = new WorldMap()
		this.update();
	}
	
	update() {
		this._state.update();
		this.render();
		this._window.requestAnimationFrame(this.update.bind(this));
	}
	
	render() {
		this._context.fillStyle = "rgb(0,0,0)";
		this._context.fillRect(0,0,this._canvas.width,this._canvas.height);
		
		this._state.render(this._context);
	}
}

class ObjectLayer {
	constructor() {
		this.objects = [];
	}

	add_object(obj) {
		this.objects.push(obj);
	}
	
	update() {
		this.objects.forEach((obj) => {
			obj.update();
		});
	}
	
	render(ctx) {
		this.objects.forEach((obj) => {
			obj.render(ctx);
		});
	}
}

class GameState {
	
	constructor() {
		this.layers = [new ObjectLayer()];
	}
	
	update() {
		this.layers.forEach((layer) => {
			layer.update();
		});
	}
	
	render(ctx) {
		this.layers.forEach((layer) => {
			layer.render(ctx);
		});
	}

}

class MapState extends GameState {
	constructor() {
		super();
	}
}

class WorldMap extends MapState {
	constructor() {
		super();
		this._width = 1024;
		this._height = 1024;
		for (var i=0; i<100; i++) {
			this.layers[0].add_object(new Tree(this));
		}
	}
}

class GameObject {
	constructor(x=0, y=0) {
		this._x = x;
		this._y = y;
		this._width = 5;
		this._height = 5;
		this._velx = 0;
		this._vely = 0;
		this._color = "rgb(255,0,0)";
	}
	
	update() {
		this._x += this._velx;
		this._y += this._vely;
	}
	
	render(ctx) {
		ctx.fillStyle = this._color;
		ctx.fillRect(this._x, this._y, this._width, this._height);
	}
	
	set color(color) {
		this._color = color;
	}
}

class Tree extends GameObject {
	constructor(map) {
		super();
		this._x = Math.random() * map._width;
		this._y = Math.random() * map._height;
		this._width = 12;
		this._height = 48;
		this._color = "rgb(0,255,0)";
	}
	
	
	
}
