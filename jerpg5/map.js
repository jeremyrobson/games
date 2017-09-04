function createObjectMap() {
    var objectMap = createTileMap(12, 12, null);

    units.forEach(function(unit) {
        objectMap[unit.x][unit.y] = unit;
    });

    return objectMap;
}

function createTileMap(width, height, defaultValue) {
    var binaryMap = [];
    for (var x=0; x<width; x++) {
        binaryMap[x] = [];
        for (var y=0; y<height; y++) {
            binaryMap[x][y] = defaultValue;
        }
    }
    return binaryMap;
}

function createUnitMap() {
    var unitMap = createTileMap(12, 12, null);

    units.forEach(function(unit) {
        unitMap[unit.x][unit.y] = unit;
    });

    return unitMap;
}