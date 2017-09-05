function randint(value, min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function clamp(val, min, max) {
    if (val < min) {
        return min;
    }
    if (val > max) {
        return max;
    }
    return val;
}


class Color {

    /**
     *  @param {int} x - x coordinate
     *  @param {int} y - y coordinate
     *  @param {int} size - font size in pixels
     *  @param {Color} color - color object
     *  @param {string} text - text
     */
    constructor(r,g,b,a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    randomize(amount=0) {
        this.r = clamp(randint(this.r-amount,this.r+amount),0,255);
        this.g = clamp(randint(this.g-amount,this.g+amount),0,255);
        this.b = clamp(randint(this.b-amount,this.b+amount),0,255);
        return this;
    }
    
    toString() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
}