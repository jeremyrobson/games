/// <reference path="definitions.d.ts"/>

class TextBox extends Rectangle {
    text: string;
    cursor: Point;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.text = ""; 
    }

    addLetter(letter: string) {
        this.text += letter;
    }

    setText(text: string) {
        this.text = text;
    }

    render(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        super.render(ctx, offsetX, offsetY);

        this.drawText(ctx, this.text, this.cursor.x, this.cursor.y);
    }
}
