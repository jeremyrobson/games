/// <reference path="definitions.d.ts"/>

class TextBox extends Rectangle {
    lines: Array<string>;
    cursor: Point;
    fontSize: number;
    text: string;
    lineLength: number;
    lineOffset: number;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.lines = [];
        this.fontSize = 24;
        this.text = ""; //not necessarily needed
        this.lineOffset = 0;
    }

    newLine(letter: string) {
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

    addLetter(letter: string, word: string) {
        this.text += letter; //not used

        if (this.lines.length === 0 || //first line
            this.lines.length > 0 && letter === "\n") { //create new line on \n
            this.newLine(letter);
            return;
        }

        let currentLine = this.lines.length - 1;

        if (letter === " ") //on space, update length of current line
            this.lineLength = this.lines[currentLine].length;
        
        //if current line + current word is too big, go to next line
        if (word.length + this.lineLength > 40)
            this.newLine(letter);
        else
            this.lines[currentLine] += letter;
    }

    render(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) {
        super.render(ctx, offsetX, offsetY);

        this.lines.forEach((line, i) => {
            this.drawText(ctx, line, this.x, this.y + (i - this.lineOffset) * this.fontSize);
        });
    }
}
