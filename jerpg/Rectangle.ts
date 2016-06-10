/// <reference path="definitions.d.ts"/>

class Rectangle extends GameObject {
    
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.setColor(new Color(50, 100, 150, 1));
        this.setTextColor(new Color(230, 230, 230, 1));
        this.setFont("16px Arial");
    }

}
