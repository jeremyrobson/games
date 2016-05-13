/// <reference path="definitions.d.ts"/>

class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    fillStyle: string;
    
    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.fillStyle = this.toString();
    }
    
    setValue(key:string, value:number) {
        this[key] = value;
        this.fillStyle = this.toString();
    }
    
    toString() : string {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
}