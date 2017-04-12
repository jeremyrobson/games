var MAP_WIDTH = 16, MAP_HEIGHT = 16;
var TILE_WIDTH = 30, TILE_HEIGHT = 30;

function generateTiles(width, height) {
    var tiles = [];
    for (var x=0; x<width; x++) {
        tiles[x] = [];
        for (var y=0; y<height; y++) {
            tiles[x][y] = new Tile(x, y, "grass");
        }
    }
    return tiles;
}

class Tile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.units = [];
    }

    addUnit(unit) {
        this.units.push(unit);
    }

    removeUnit(unit) {
        //todo: speed up using indexing
        this.units = this.units.filter(function(u) {
            return u.id !== unit.id;
        });
    }

    getUnits() {
        return this.units;
    }

    toString() {
        return "X: " + this.x + ", Y: " + this.y + ", Units: " + this.units.length;
    }
}