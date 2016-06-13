function getDistance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
function getAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
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
        this.border = false;
        this.borderSize = 2;
        this.borderColor = new Color(0, 255, 0, 1);
        this.shadow = false;
        this.shadowColor = new Color(0, 0, 0, 1);
        this.shadowBlur = 0;
        console.log(this.width, this.height);
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
            && mx < this.x + this.width && my < this.y + this.height;
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        return this;
    }
    update(scene) {
    }
    mouseMove(x, y, offsetX = 0, offsetY = 0) { return this; }
    mouseDown(x, y, offsetX = 0, offsetY = 0) { return this; }
    mouseUp(x, y, offsetX = 0, offsetY = 0) { return this; }
    drawRect(ctx, x, y, width, height) {
        ctx.beginPath();
        ctx.fillStyle = this.color.fillStyle;
        ctx.rect(x, y, this.width, this.height);
        if (this.shadow) {
            ctx.shadowColor = this.shadowColor.fillStyle;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        else
            ctx.shadowColor = "transparent";
        if (this.border) {
            ctx.strokeStyle = this.borderColor.fillStyle;
            ctx.lineWidth = this.borderSize;
            ctx.stroke();
        }
        ctx.fill();
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
    }
}
class Rectangle extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setColor(new Color(50, 100, 150, 1));
        this.setTextColor(new Color(230, 230, 230, 1));
        this.setFont("16px Arial");
    }
}
class GameControl extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setColor(new Color(0, 0, 255, 1));
        this.setTextColor(new Color(255, 255, 255, 1));
        this.setFont("20px Arial");
        this.mousePressed = false;
    }
    setFunction(fn) {
        this.fn = fn;
        return this;
    }
    mouseMove(x, y, offsetX = 0, offsetY = 0) {
        this.mousePressed = false;
        this.shadow = false;
        if (!this.hit(x - offsetX, y - offsetY))
            return null;
        return this;
    }
    mouseDown(x, y, offsetX = 0, offsetY = 0) {
        this.mousePressed = false;
        if (!this.hit(x - offsetX, y - offsetY))
            return null;
        this.mousePressed = true;
        return this;
    }
    mouseUp(x, y, offsetX = 0, offsetY = 0) {
        if (!this.hit(x - offsetX, y - offsetY))
            return null;
        if (this.mousePressed) {
            this.fn("menu changes json goes here?");
        }
        this.mousePressed = false;
        return this;
    }
    update(scene) {
    }
    render(ctx, offsetX, offsetY) {
        super.render(ctx, offsetX, offsetY);
    }
}
class GameButton extends GameControl {
    constructor(caption, x, y, width, height) {
        super(x, y, width, height);
        this.caption = caption;
        this.setColor(new Color(0, 0, 155, 1));
        this.setTextColor(new Color(255, 255, 255, 1));
        this.setFont("20px Arial");
        this.border = true;
        this.shadowColor = new Color(255, 255, 255, 1);
        this.shadowBlur = 16;
    }
    mouseMove(x, y, offsetX = 0, offsetY = 0) {
        if (!super.mouseMove(x, y, offsetX, offsetY))
            return null;
        console.log("move");
        this.shadow = true;
        return this;
    }
    mouseDown(x, y, offsetX = 0, offsetY = 0) {
        if (!super.mouseDown(x, y, offsetX, offsetY))
            return null;
        console.log("button mouse down", x, y);
        return this;
    }
    mouseUp(x, y, offsetX = 0, offsetY = 0) {
        if (!super.mouseUp(x, y, offsetX, offsetY))
            return null;
        return this;
    }
    update(scene) {
    }
    render(ctx, offsetX, offsetY) {
        super.render(ctx, offsetX, offsetY);
        let dx = this.x + offsetX + 10;
        let dy = this.y + offsetY + 10;
        this.drawText(ctx, this.caption, dx, dy);
    }
}
class TextBox extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.lines = [];
        this.fontSize = 24;
        this.text = "";
        this.lineOffset = 0;
        this.border = true;
    }
    newLine(letter) {
        if (letter === "\n" || letter === " ") {
            this.lines.push("");
            this.lineLength = 0;
        }
        else {
            this.lines.push(letter);
            this.lineLength = 1;
        }
        if (this.lines.length * this.fontSize > this.height)
            this.lineOffset++;
    }
    addLetter(letter, word) {
        this.text += letter;
        if (this.lines.length === 0 ||
            this.lines.length > 0 && letter === "\n") {
            this.newLine(letter);
            return;
        }
        let currentLine = this.lines.length - 1;
        if (letter === " ")
            this.lineLength = this.lines[currentLine].length;
        if (word.length + this.lineLength > 40)
            this.newLine(letter);
        else
            this.lines[currentLine] += letter;
    }
    render(ctx, offsetX, offsetY) {
        super.render(ctx, offsetX, offsetY);
        this.lines.forEach((line, i) => {
            this.drawText(ctx, line, this.x, this.y + (i - this.lineOffset) * this.fontSize);
        });
    }
}
class GameLayer extends GameObject {
    constructor(x = 0, y = 0, width = 640, height = 480) {
        super(x, y, width, height);
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
    mouseMove(x, y) {
        if (!this.hit(x, y))
            return null;
        this.objects.forEach((obj) => { obj.mouseMove(x, y); });
        return this;
    }
    mouseDown(x, y) {
        if (!this.hit(x, y))
            return null;
        this.objects.forEach((obj) => { obj.mouseDown(x, y); });
        return this;
    }
    mouseUp(x, y) {
        if (!this.hit(x, y))
            return null;
        this.objects.forEach((obj) => { obj.mouseUp(x, y); });
        return this;
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
        this.border = true;
    }
    mouseMove(x, y, offsetX = 0, offsety = 0) {
        if (!this.hit(x, y))
            return null;
        this.objects.forEach((obj) => { obj.mouseMove(x, y, this.x, this.y); });
        return this;
    }
    mouseDown(x, y, offsetX = 0, offsetY = 0) {
        if (!this.hit(x, y))
            return null;
        this.objects.forEach((obj) => { obj.mouseDown(x, y, this.x, this.y); });
        return this;
    }
    mouseUp(x, y, offsetX = 0, offsetY = 0) {
        if (!this.hit(x, y))
            return null;
        this.objects.forEach((obj) => { obj.mouseUp(x, y, this.x, this.y); });
        return this;
    }
    update(scene) {
    }
    render(ctx, offsetX, offsetY) {
        super.render(ctx, offsetX, offsetY);
        this.objects.forEach((obj) => { obj.render(ctx, this.x, this.y); });
    }
}
class GameEvent {
    constructor() {
        this.id = Math.floor(Math.random() * 1000000);
        this.setEnabled(true);
        this.setDuration(Infinity);
        this.count = 0;
        this.isDone = false;
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
    constructor(effect, object, duration) {
        super();
        this.effect = effect;
        this.outspeed = 0.01;
        this.inspeed = 0.01;
        this.object = object;
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
        scene.removeEvent(this);
    }
    invoke(scene) {
    }
    update(scene) {
        super.update(scene);
        if (this.effect == "fadeout" && this.object.alpha > 0)
            this.object.setAlpha(this.object.alpha - this.outspeed);
        else if (this.effect == "fadein" && this.object.alpha < 1)
            this.object.setAlpha(this.object.alpha + this.inspeed);
        if (this.effect == "fadeout" && this.object.alpha <= 0)
            this.done(scene);
        if (this.effect == "fadein" && this.object.alpha >= 1)
            this.done(scene);
    }
}
class AddObjectsEvent extends GameEvent {
    constructor(layer, delay, ...arr) {
        super();
        this.delay = delay;
        this.arr = arr;
        this.layer = layer;
    }
    update(scene) {
        super.update(scene);
        if (this.arr.length > 0)
            this.layer.addObject(this.arr.shift());
        else
            scene.removeEvent(this);
    }
}
class OpenMenuEvent extends GameEvent {
    constructor(menu) {
        super();
        this.menu = menu;
        this.targetHeight = menu.height;
        this.menu.y = this.menu.y + this.menu.height / 2;
        this.menu.height = 0;
    }
    update(scene) {
        super.update(scene);
        if (this.menu.height < this.targetHeight) {
            this.menu.height += 2;
            this.menu.y -= 1;
        }
        else
            scene.removeEvent(this);
    }
}
class DialogEvent extends GameEvent {
    constructor(textArray, textBox) {
        super();
        this.paragraphs = textArray;
        this.textBox = textBox;
        this.letters = [];
        this.words = [];
    }
    update(scene) {
        super.update(scene);
        if (this.pause > 0)
            return --this.pause;
        if (this.letters.length > 0) {
            let letter = this.letters.shift();
            if (letter === "@") {
                let d = parseInt(this.letters.shift()) || 0;
                this.pause = d * 10;
            }
            else
                this.textBox.addLetter(letter, this.currentWord);
        }
        else if (this.words.length > 0) {
            this.currentWord = this.words.shift();
            this.letters = this.currentWord.split("");
            this.textBox.addLetter(" ", " ");
        }
        else {
            if (this.paragraphs.length > 0) {
                this.words = this.paragraphs.shift().split(" ");
                this.currentWord = this.words.shift();
                this.letters = this.currentWord.split("");
            }
            else {
                scene.removeEvent(this);
            }
        }
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
        console.log("invoking event", event);
        event.invoke(this);
        this.events.push(event);
        return event;
    }
    loopEvents(events) {
        events[events.length - 1].setNextEvent(events[0]);
        this.queueEvents(events);
    }
    queueEvents(events) {
        for (let i = 0; i < events.length - 1; i++)
            events[i].setNextEvent(events[i + 1]);
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
    mouseMove(x, y) {
        this.layers.forEach((layer) => { layer.mouseMove(x, y); });
        return this;
    }
    mouseDown(x, y) {
        this.layers.forEach((layer) => { layer.mouseDown(x, y); });
        return this;
    }
    mouseUp(x, y) {
        this.layers.forEach((layer) => { layer.mouseUp(x, y); });
        return this;
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
        this.canvas.onmousemove = this.mouseMove.bind(this);
        this.canvas.onmousedown = this.mouseDown.bind(this);
        this.canvas.onmouseup = this.mouseUp.bind(this);
        let scene = new GameScene();
        let layer = new GameLayer(0, 0, this.canvas.width, this.canvas.height);
        layer.setColor(new Color(0, 0, 0, 1));
        let tb = new TextBox(20, 20, 240, 120);
        layer.addObject(tb);
        scene.addLayer(layer);
        let fade = new FadeEvent("fadein", tb, 3000);
        let arr = [
            "Hello@5\n",
            "How are you?@5\n",
            "I am really hoping that this text will wrap within the set parameters.@5\n",
            "It's@5 just@5 that@5 I can't believe this works.@9"
        ];
        let menu = new GameMenu(100, 100, 200, 100);
        let but = new GameButton("click", 50, 50, 50, 50).setFunction((text) => {
            console.log(text);
        });
        menu.addObject(but);
        let aoe = new AddObjectsEvent(layer, 1, menu);
        let ome = new OpenMenuEvent(menu);
        scene.queueEvents([fade, aoe, ome]);
        this.setScene(scene);
    }
    start() {
        console.log("Engine started with timerID " + this.timerID);
        this.update();
    }
    setScene(scene) {
        this.scene = scene;
    }
    update() {
        this.scene.update(this);
        this.render();
        this.timerID = this.window.requestAnimationFrame(() => this.update());
    }
    setMouseCoords(e) {
        this.mouseX = (e.layerX) ? e.layerX : e.offsetX;
        this.mouseY = (e.layerY) ? e.layerY : e.offsetY;
    }
    mouseMove(e) {
        this.setMouseCoords(e);
        this.scene.mouseMove(this.mouseX, this.mouseY);
    }
    mouseDown(e) {
        this.setMouseCoords(e);
        this.scene.mouseDown(this.mouseX, this.mouseY);
    }
    mouseUp(e) {
        this.setMouseCoords(e);
        this.scene.mouseUp(this.mouseX, this.mouseY);
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
