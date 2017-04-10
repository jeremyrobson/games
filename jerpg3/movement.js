function listHasPoint(list, x, y) {
    for (var p = 0; p < list.length; p++) {
        if (list[p].x === x && list[p].y === y) {
            return true;
        }
    }
    return false;
}

class MoveNode {
    constructor(x, y, steps, parent, safetyScore) {
        this.x = x;
        this.y = y;
        this.steps = steps;
        this.parent = parent;
        this.safetyScore = safetyScore;
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
}

function getSafetyScore(battle, units, unit, x, y) {
    var safetyScore = 0;

    //filter out self
    var otherUnits = units.filter(function(u) {
        return u.id != unit.id;
    });

    otherUnits.forEach(function(u) {
        var dx = x - u.x;
        var dy = y - u.y;
        var distance = Math.sqrt(dx*dx + dy*dy);
        if (distance === 0) { //this should never happen
            return;
        }
        if (u.team === unit.team) {
            safetyScore += (1 / distance);
        }
        else {
            safetyScore -= (1 / distance);
        }
    });

    //check queue for future action spreads that hit this tile
    var actions = battle.queue.getActions(x, y, 10);
    actions.forEach(function(action) {
        // "what if" the unit moved to the proposed x,y?
        var damage = action.getDamage(unit);
        if (damage > 0) { //unit would be damaged
            safetyScore -= 1;
        }
        if (unit.hp - damage < 0) { //unit would be killed
            safetyScore -= 2;
        }
        if (damage < 0) { //unit would be healed
            safetyScore += 1;
        }
        
    });

    return safetyScore;
}

function createBinaryMap(map, width, height) {
    var bmap = [];
    for (var x=0; x<width; x++) {
        bmap[x] = [];
        for (var y=0; y<height; y++) {
            bmap[x][y] = 0;
        }
    }
    return bmap;
}

function getMapNodes(map, units, unit) {
    var binaryMap = createBinaryMap(map, map.width, map.height);
    binaryMap[unit.x][unit.y] = 1; //visit starting node

    var i = 0, steps = 0;
    var xList = [0, -1, 0, 1];
    var yList = [-1, 0, 1, 0];
    var minSafetyScore = 0, maxSafetyScore = 0;

    var nodeList = [new MoveNode(unit.x, unit.y, 0, null, 0)];

    while (i < nodeList.length) {
        for (var j=0; j<4; j++) {

            var x = nodeList[i].x + xList[j];
            var y = nodeList[i].y + yList[j];

            //if node is off the map
            if (x < 0 || y < 0 || x >= map.width || y >= map.height) {
                continue; //skip this node
            }

            //if node has already been visited
            if (binaryMap[x][y] === 1) {
                continue; //skip this node
            }

            var mapUnit = map.tile[x][y].units[0];

            //if unit exists on node and is enemy
            if (mapUnit && mapUnit.team !== unit.team) {
                //if enemy is not dead
                if (mapUnit.status !== "dead") {
                    continue; //skip this node
                }
            }

            var safetyScore = getSafetyScore(map, units, unit, x, y);
            minSafetyScore = safetyScore < minSafetyScore ? safetyScore : minSafetyScore;
            maxSafetyScore = safetyScore > maxSafetyScore ? safetyScore : maxSafetyScore;

            nodeList.push(new MoveNode(x, y, nodeList[i].steps + 1, nodeList[i], safetyScore));

            binaryMap[x][y] = 1; //visit node
        }
        i++;
    }

    //normalize safety scores between 0 and 1
    nodeList.forEach(function(node) {
        node.safetyScore = (node.safetyScore - minSafetyScore) / (maxSafetyScore - minSafetyScore);
    });

    return nodeList;
}

function getPath(move) {
    var path = [];

    var node = move;

    while (node) {
        path.push(node);
        node = node.parent;
    }

    return path.reverse();
}

class BattleMove {
    constructor(unit, node) {
        this.unit = unit;
        this.node = node;
        this.ctr = 0;
        this.ready = false;
        this.priority = 1;
        this.remove = false;
    }

    tick() {
        this.ctr -= 1;
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
    }

    invoke(battle) {
        battle.moveUnit(this.unit, this.node);
        this.done();
        return null;
    }

    done() {
        this.remove = true;
    }

    toString() {
        return "Move - Unit No. " + this.unit.sprite + " - CTR: " + this.ctr + ", Node: " + this.node.x + ", " + this.node.y;
    }
}

function getBestMove(battle, unit) {
    var bestMove = null;

    var mapNodes = getMapNodes(battle, battle.units, unit);

    battle.mapNodes = mapNodes;

    bestMove = new BattleMove(unit, new MoveNode(0, 0, 0, null, 0));

    return bestMove;
}