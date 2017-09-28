var elements = ["heal", "fire", "water", "earth", "air", "light", "dark"];
var effects = ["none", "halve", "quarter", "block", "reflect", "absorb", "reflect2", "absorb2"];

class Spell {
    constructor() {
        this.spread = [[2,2]];
        this.elementLevel = 0;
        this.effectLevel = 0;
        this.turns = 0;

        this.element = elements[this.elementLevel];
        this.effect = effects[this.effectLevel];

        this.spreadMap = [];
        for (var x=0; x<5; x++) {
            this.spreadMap[x] = [];
            for (var y=0; y<5; y++) {
                this.spreadMap[x][y] = 0;
            }
        }
        this.spreadMap[2][2] = 1;
    }

    addSpread(x, y) {
        var cost = 0;
        if (this.isSpreadAvailable(x, y) && this.spread.length < 24) {
            this.spread.push([x,y]);
            this.spreadMap[x][y] = 1;
            cost = this.getSpreadAddCost(this.spread.length);
        }
        return cost;
    }

    removeSpread(x, y) {
        var refund = 0;
        if (this.spread.length > 0 && !(x == 2 && y ==2)) {
            refund = this.getSpreadAddCost(this.spread.length);
            this.spread = this.spread.filter(function(s) {
                return !(s[0] == x && s[1] == y);
            });
            this.spreadMap[x][y] = 0;
        }
        return refund;
    }

    isSpreadAvailable(x, y) {
        return this.spreadMap[x][y] == 0;
    }

    getSpreadAddCost(level) {
        if (!level) {
            level = this.spread.length + 1;
        }
        return Math.pow(10, Math.floor(Math.log2(level)));
    }

    upgradeElement() {
        var cost = 0;
        if (this.elementLevel < elements.length - 1) {
            this.elementLevel++;
            this.element = elements[this.elementLevel];
            cost = this.getElementUpgradeCost(this.elementLevel);
        }
        return cost;
    }

    getElementUpgradeCost(level) {
        if (!level) {
            level = this.elementLevel + 1;
        }
        return Math.pow(4, level) * level;
    }

    downgradeElement() {
        var refund = 0;
        if (this.elementLevel > 0) {
            refund = this.getElementUpgradeCost(this.elementLevel);
            this.elementLevel--;
            this.element = elements[this.elementLevel];
        }
        return refund;
    }
}