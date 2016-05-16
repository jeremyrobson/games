function getDistance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
class GameObject {
    constructor(x, y, width, height) {
        this.id = Math.floor(Math.random() * 1000000).toString();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setColor(new Color(255, 0, 0, 1));
        this.setTextColor(new Color(255, 255, 0, 1));
        this.setFont("24px Arial");
    }
    setColor(color) {
        this.color = color;
        this.alpha = color.a;
        return this;
    }
    setAlpha(alpha) {
        if (alpha < 0)
            alpha = 0;
        this.alpha = alpha;
        this.color.a = alpha;
        return this;
    }
    setTextColor(color) {
        this.textColor = color;
        return this;
    }
    setFont(font) {
        this.font = font;
        return this;
    }
    hit(mx, my) {
        return mx >= this.x && my >= this.y
            && mx < this.width && my < this.height;
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    }
    update(scene) {
    }
    drawRect(ctx, x, y, width, height) {
        ctx.fillStyle = this.color.fillStyle;
        ctx.fillRect(x, y, this.width, this.height);
    }
    drawText(ctx, text, x, y) {
        ctx.fillStyle = this.textColor.fillStyle;
        ctx.font = this.font;
        ctx.textBaseline = "top";
        ctx.fillText(text, x, y);
    }
    render(ctx, offsetX = 0, offsetY = 0) {
        let drawX = this.x + offsetX;
        let drawY = this.y + offsetY;
        this.drawRect(ctx, drawX, drawY, this.width, this.height);
        this.drawText(ctx, this.id, drawX, drawY);
    }
}
class GameLayer extends GameObject {
    constructor(x = 0, y = 0, width = 640, height = 480) {
        super(0, 0, width, height);
        this.objects = new Array();
    }
    addObject(obj) {
        return this.objects.push(obj);
    }
    removeObject(obj) {
        this.objects = this.objects.filter((a) => { return obj.id != a.id; });
        return this.objects.length;
    }
    update(scene) {
        this.objects.forEach((obj) => { obj.update(scene); });
    }
    render(ctx, offsetX = 0, offsetY = 0) {
        super.render(ctx);
        this.objects.forEach((obj) => { obj.render(ctx, this.x, this.y); });
    }
}
class GameMenu extends GameLayer {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setColor(new Color(0, 0, 255, 1));
        this.setTextColor(new Color(255, 255, 255, 1));
        this.setFont("20px Arial");
    }
    update(scene) {
    }
    render(ctx, offsetX, offsetY) {
        super.render(ctx, offsetX, offsetY);
    }
}
class GameDialog extends GameMenu {
    constructor(textArray, x, y, width, height) {
        super(x, y, width, height);
        this.textQueue = textArray;
        this.textIndex = 0;
        this.letterIndex = 0;
        this.text = "";
    }
    update(scene) {
        if (this.letters) {
            let letter = this.letters[this.letterIndex];
            if (letter) {
                this.text += letter;
                this.letterIndex++;
            }
            else {
                this.textIndex++;
                this.letters = null;
            }
        }
        else {
            if (this.textQueue[this.textIndex]) {
                this.letters = this.textQueue[this.textIndex].split("");
                this.letterIndex = 0;
            }
        }
    }
    render(ctx, offsetX, offsetY) {
        super.render(ctx, offsetX, offsetY);
        this.drawText(ctx, this.text, 100, 100);
    }
}
class GameEvent {
    constructor() {
        this.id = Math.floor(Math.random() * 1000000);
        this.setEnabled(true);
        this.setDuration(Infinity);
        this.count = 0;
    }
    setEnabled(value) {
        this.enabled = value;
        return this;
    }
    setDuration(value) {
        this.duration = value;
        return this;
    }
    setInterval(value) {
        this.interval = value;
        return this;
    }
    setNextEvent(next) {
        this.next = next;
        return this;
    }
    invoke(scene) { }
    update(scene) {
        this.count++;
        if (this.count >= this.duration)
            scene.removeEvent(this);
    }
}
class SleepEvent extends GameEvent {
    constructor() {
        super();
    }
    invoke(scene) {
        scene.setState("sleep");
    }
}
class TranslateObjectEvent extends GameEvent {
    constructor(obj) {
        super();
        this.object = obj;
        this.startX = obj.x;
        this.startY = obj.y;
        this.setTarget(this.startX, this.startY);
        this.setSpeed(1);
        this.setInterval(1);
    }
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
        return this;
    }
    setSpeed(value) {
        this.speed = value;
        return this;
    }
    invoke(scene) {
        this.angle = getAngle(this.object.x, this.object.y, this.targetX, this.targetY);
        this.lasttick = performance.now();
    }
    update(scene) {
        super.update(scene);
        if (performance.now() > this.lasttick + this.interval) {
            this.object.move(Math.cos(this.angle) * this.speed, Math.sin(this.angle) * this.speed);
            let distance = getDistance(this.object.x, this.object.y, this.targetX, this.targetY);
            if (distance <= this.speed)
                scene.removeEvent(this);
            this.lasttick = performance.now();
        }
    }
}
class DialogEvent extends GameEvent {
    constructor() {
        super();
    }
    invoke(scene) {
    }
    update(scene) {
        super.update(scene);
    }
}
class ChangeMapEvent extends GameEvent {
    constructor() {
        super();
    }
    invoke(scene) {
    }
    update(scene) {
        super.update(scene);
    }
}
class FadeEvent extends GameEvent {
    constructor(effect) {
        super();
        this.effect = effect;
        this.outspeed = 0.01;
        this.inspeed = 0.01;
        this.layer = new GameLayer()
            .setColor(new Color(0, 0, 0, 1))
            .setAlpha((effect == "fadeout") ? 1.0 : 0.0);
    }
    setColor(color) {
        this.color = color;
        return this;
    }
    setOutspeed(value) {
        this.outspeed = value;
        return this;
    }
    setInspeed(value) {
        this.inspeed = value;
        return this;
    }
    done(scene) {
        scene.removeLayer(this.layer);
        scene.removeEvent(this);
    }
    invoke(scene) {
        scene.addLayer(this.layer);
    }
    update(scene) {
        super.update(scene);
        if (this.effect == "fadeout" && this.layer.alpha > 0)
            this.layer.setAlpha(this.layer.alpha - this.outspeed);
        else if (this.effect == "fadein" && this.layer.alpha < 1)
            this.layer.setAlpha(this.layer.alpha + this.inspeed);
        if (this.effect == "fadeout" && this.layer.alpha <= 0)
            this.done(scene);
        if (this.effect == "fadein" && this.layer.alpha >= 1)
            this.done(scene);
    }
}
class GameScene {
    constructor() {
        this.layers = new Array();
        this.events = new Array();
        this.state = "none";
    }
    setState(state) {
        this.state = state;
    }
    addEvent(event) {
        event.invoke(this);
        this.events.push(event);
        return event;
    }
    loopEvents(...events) {
        for (let i = 0; i < events.length - 1; i++)
            events[i].setNextEvent(events[i + 1]);
        events[events.length - 1].setNextEvent(events[0]);
        this.addEvent(events[0]);
    }
    addLayer(layer) {
        this.layers.push(layer);
    }
    removeLayer(layer) {
        this.layers = this.layers.filter((a) => { return layer.id != a.id; });
    }
    removeEvent(event) {
        if (event.enabled && event.next)
            this.addEvent(event.next);
        this.events = this.events.filter((a) => { return event.id != a.id; });
    }
    update(game) {
        this.events.forEach((event) => { event.update(this); });
        this.layers.forEach((layer) => { layer.update(this); });
    }
    render(ctx) {
        this.layers.forEach((layer) => { layer.render(ctx); });
    }
}
class GameEngine {
    constructor(window, canvas, context) {
        this.window = window;
        this.canvas = canvas;
        this.ctx = context;
        let scene = new GameScene();
        let layer = new GameLayer(0, 0, this.canvas.width, this.canvas.height);
        layer.setColor(new Color(0, 0, 0, 1));
        let d = new GameDialog(["hello", "how are you?", "I am fineeeee"], 20, 20, 50, 50);
        layer.addObject(d);
        scene.addLayer(layer);
        this.setScene(scene);
    }
    start() {
        this.update();
        console.log("Engine started with timerID " + this.timerID);
    }
    setScene(scene) {
        this.scene = scene;
    }
    update() {
        this.scene.update(this);
        this.render();
        this.timerID = this.window.requestAnimationFrame(() => this.update());
    }
    render() {
        this.scene.render(this.ctx);
    }
}
class Color {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.fillStyle = this.toString();
    }
    setValue(key, value) {
        this[key] = value;
        this.fillStyle = this.toString();
    }
    toString() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
}
