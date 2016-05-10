/// <reference path="definitions.d.ts"/>

class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    
    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    setValue(key:string, value:number) {
        this[key] = value;
    }
    
    toString() : string {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
}