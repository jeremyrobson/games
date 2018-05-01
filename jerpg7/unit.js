class Unit {
    constructor(team, x, y, sprite) {
        this.team = team;
        this.x = x;
        this.y = y;
        this.agl = Math.floor(Math.random() * 9) + 1;
        this.CT = 0
        this.sprite = sprite;

        if (team === "player") {
            this.xoffset = XOFFSET;
        }
        else {
            this.xoffset = 0;
        }
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }
}