function randint(min, max) {
    return Math.floor(Math.random() * (max-min) + min);
}

function clamp(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

function wrap(val, max) {
    if (val < 0) return val + max;
    if (val >= max) return val - max;
    return val;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getDistance(o1, o2) {
    var dx = o2.x - o1.x;
    var dy = o2.y - o1.y;
    return Math.sqrt(dx*dx+dy*dy);
}

Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
};