function createObjectMap() {
    var objectMap = createTileMap(WIDTH, HEIGHT, null);

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
    var unitMap = createTileMap(WIDTH, HEIGHT, null);

    units.forEach(function(unit) {
        unitMap[unit.x][unit.y] = unit;
    });

    return unitMap;
}

/**
 * Creates a 2D array of values between 0 and 1 representing the
 * safest tiles on the map for a given unit
 * @param {Unit} unit 
 * @param {Array<Unit>} units 
 */
function getSafetyScores(unit, units) {
    var ss = [];
    var min = 0;
    var max = 0;

    for (var i=0; i<WIDTH; i++) {
        ss[i] = [];
        for (var j=0; j<HEIGHT; j++) {
            var score = 0;
            units.forEach(function(u) {
                var dx = i - u.x;
                var dy = j - u.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                var invsqrt = 1 / distance;
                if (distance === 0) {
                    invsqrt = 1; //no infinity allowed due to division by zero
                }
                if (unit.id === u.id) {
                    invsqrt = 0; //self does not contribute to safety score
                }
                if (unit.team === u.team) {
                    invsqrt;
                }
                else {
                    invsqrt = -invsqrt;
                }
                score += invsqrt;
            });

            ss[i][j] = score;

            if (score < min) {
                min = score;
            }

            if (score > max) {
                max = score + Number.EPSILON;
            }
        }
    }

    //normalize
    for (var i=0; i<WIDTH; i++) {
        for (var j=0; j<HEIGHT; j++) {
            ss[i][j] = (ss[i][j] - min) / (max - min);
        }
    }

    return ss;
}