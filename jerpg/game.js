var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function getDistance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
var GameObject = (function () {
    function GameObject(x, y, width, height, color) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setColor(color);
    }
    GameObject.prototype.setColor = function (color) {
        this.color = color;
        this.alpha = color.a;
        this.fillStyle = color.toString();
    };
    GameObject.prototype.update = function (scene) {
    };
    GameObject.prototype.render = function (ctx, parent) {
        var drawX = this.x + parent.x;
        var drawY = this.y + parent.y;
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(drawX, drawY, this.width, this.height);
        ctx.fillStyle = "rgb(255,255,0)";
        ctx.font = "24px Arial";
        ctx.textBaseline = "top";
        ctx.fillText(this.id, drawX, drawY);
    };
    return GameObject;
}());
var GameLayer = (function (_super) {
    __extends(GameLayer, _super);
    function GameLayer(width, height) {
        if (width === void 0) { width = 640; }
        if (height === void 0) { height = 480; }
        _super.call(this, 0, 0, width, height, new Color(255, 255, 255, 1));
        this.objects = new Array();
    }
    GameLayer.prototype.addObject = function (obj) {
        this.objects.push(obj);
    };
    GameLayer.prototype.removeObject = function (obj) {
        this.objects = this.objects.filter(function (a) { return obj.id != a.id; });
    };
    GameLayer.prototype.update = function (scene) {
        this.objects.forEach(function (obj) { obj.update(scene); });
    };
    GameLayer.prototype.render = function (ctx) {
        var _this = this;
        ctx.fillStyle = this.color.fillStyle;
        ctx.fillRect(0, 0, this.width, this.height);
        this.objects.forEach(function (obj) { obj.render(ctx, _this); });
    };
    return GameLayer;
}(GameObject));
var GameEvent = (function () {
    function GameEvent() {
        this.id = Math.floor(Math.random() * 1000000);
    }
    GameEvent.prototype.setNextEvent = function (next) {
        this.next = next;
        return this;
    };
    GameEvent.prototype.invoke = function (scene) { };
    GameEvent.prototype.update = function (scene) {
        this.count++;
        if (this.count >= this.duration)
            scene.removeEvent(this);
    };
    return GameEvent;
}());
var SleepEvent = (function (_super) {
    __extends(SleepEvent, _super);
    function SleepEvent() {
        _super.call(this);
    }
    SleepEvent.prototype.invoke = function (scene) {
        scene.setState("sleep");
    };
    return SleepEvent;
}(GameEvent));
var TranslateObjectEvent = (function (_super) {
    __extends(TranslateObjectEvent, _super);
    function TranslateObjectEvent(obj, x, y) {
        _super.call(this);
        this.object = obj;
        this.startX = obj.x;
        this.startY = obj.y;
        this.targetX = x;
        this.targetY = y;
        this.speed = 1;
        this.interval = 1;
    }
    TranslateObjectEvent.prototype.setInterval = function (interval) {
        this.interval = interval;
        return this;
    };
    TranslateObjectEvent.prototype.setSpeed = function (speed) {
        this.speed = speed;
        return this;
    };
    TranslateObjectEvent.prototype.invoke = function (scene) {
        this.angle = getAngle(this.object.x, this.object.y, this.targetX, this.targetY);
        this.lasttick = performance.now();
    };
    TranslateObjectEvent.prototype.update = function (scene) {
        if (performance.now() > this.lasttick + this.interval) {
            this.object.x += Math.cos(this.angle) * this.speed;
            this.object.y += Math.sin(this.angle) * this.speed;
            var distance = getDistance(this.object.x, this.object.y, this.targetX, this.targetY);
            if (distance < 25)
                scene.removeEvent(this);
            this.lasttick = performance.now();
        }
    };
    TranslateObjectEvent.prototype.render = function (ctx) {
    };
    return TranslateObjectEvent;
}(GameEvent));
var DialogEvent = (function (_super) {
    __extends(DialogEvent, _super);
    function DialogEvent() {
        _super.call(this);
    }
    DialogEvent.prototype.invoke = function (scene) {
    };
    DialogEvent.prototype.update = function (scene) {
    };
    DialogEvent.prototype.render = function (ctx) {
    };
    return DialogEvent;
}(GameEvent));
var ChangeMapEvent = (function (_super) {
    __extends(ChangeMapEvent, _super);
    function ChangeMapEvent() {
        _super.call(this);
    }
    ChangeMapEvent.prototype.invoke = function (scene) {
    };
    ChangeMapEvent.prototype.update = function (scene) {
    };
    ChangeMapEvent.prototype.render = function (ctx) {
    };
    return ChangeMapEvent;
}(GameEvent));
var FadeEvent = (function (_super) {
    __extends(FadeEvent, _super);
    function FadeEvent() {
        _super.call(this);
        this.effect = "fadeout";
        this.outspeed = 0.1;
        this.inspeed = 0.1;
        this.layer = new GameLayer();
        this.layer.color = new Color(255, 0, 0, 1.0);
        this.layer.alpha = 1.0;
    }
    FadeEvent.prototype.setEffect = function (effect) {
        this.effect = effect;
        return this;
    };
    FadeEvent.prototype.setColor = function (color) {
        this.color = color;
        return this;
    };
    FadeEvent.prototype.setOutspeed = function (outspeed) {
        this.outspeed = outspeed;
        return this;
    };
    FadeEvent.prototype.setInspeed = function (inspeed) {
        this.inspeed = inspeed;
        return this;
    };
    FadeEvent.prototype.invoke = function (scene) {
        scene.addLayer(this.layer);
    };
    FadeEvent.prototype.update = function (scene) {
        if (this.effect == "fadeout" && this.layer.alpha > 0)
            this.layer.alpha -= this.outspeed;
        else if (this.effect == "fadein" && this.layer.alpha < 1)
            this.layer.alpha += this.inspeed;
        if (this.effect == "fadeout" && this.layer.alpha <= 0)
            scene.removeEvent(this);
        if (this.effect == "fadein" && this.layer.alpha >= 1) {
            scene.removeLayer(this.layer);
            scene.removeEvent(this);
        }
    };
    return FadeEvent;
}(GameEvent));
var GameScene = (function () {
    function GameScene() {
        this.layers = new Array();
        this.events = new Array();
        this.state = "none";
    }
    GameScene.prototype.setState = function (state) {
        this.state = state;
    };
    GameScene.prototype.addEvent = function (event) {
        event.invoke(this);
        this.events.push(event);
    };
    GameScene.prototype.addLayer = function (layer) {
        this.layers.push(layer);
    };
    GameScene.prototype.removeLayer = function (layer) {
        this.layers = this.layers.filter(function (a) { return layer.id != a.id; });
    };
    GameScene.prototype.removeEvent = function (event) {
        if (event.next)
            this.addEvent(event.next);
        this.events = this.events.filter(function (a) { return event.id != a.id; });
    };
    GameScene.prototype.update = function (game) {
        var _this = this;
        this.events.forEach(function (event) { event.update(_this); });
        this.layers.forEach(function (layer) { layer.update(_this); });
    };
    GameScene.prototype.render = function (ctx) {
        this.layers.forEach(function (layer) { layer.render(ctx); });
    };
    return GameScene;
}());
var GameEngine = (function () {
    function GameEngine(window, canvas, context) {
        this.window = window;
        this.canvas = canvas;
        this.ctx = context;
        var scene = new GameScene();
        var layer = new GameLayer(this.canvas.width, this.canvas.height);
        layer.setColor(new Color(0, 0, 0, 1));
        var obj = new GameObject(20, 20, 50, 50, new Color(255, 0, 0, 1));
        layer.addObject(obj);
        scene.addLayer(layer);
        var event = new TranslateObjectEvent(obj, 200, 200).setInterval(10).setSpeed(10);
        scene.addEvent(event);
        var event2 = new TranslateObjectEvent(obj, 400, 0).setInterval(10).setSpeed(1);
        event.setNextEvent(event2);
        this.setScene(scene);
    }
    GameEngine.prototype.start = function () {
        this.update();
        console.log("Engine started with timerID " + this.timerID);
    };
    GameEngine.prototype.setScene = function (scene) {
        this.scene = scene;
    };
    GameEngine.prototype.update = function () {
        var _this = this;
        this.scene.update(this);
        this.render();
        this.timerID = this.window.requestAnimationFrame(function () { return _this.update(); });
    };
    GameEngine.prototype.render = function () {
        this.scene.render(this.ctx);
    };
    return GameEngine;
}());
var Color = (function () {
    function Color(r, g, b, a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 1; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.fillStyle = this.toString();
    }
    Color.prototype.setValue = function (key, value) {
        this[key] = value;
        this.fillStyle = this.toString();
    };
    Color.prototype.toString = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    return Color;
}());
