var actions = {
    "bash": {
        "ctr": 0,
        "range": 1,
        "shape": "line",
        "spread": 0,
        "targetSelf": false
    },
    "spear": { //weapon will override bash's range, shape, spread
        "ctr": 0,
        "range": 2,
        "shape": "line",
        "spread": 0,
        "targetSelf": false
    },
    "arrow": { //weapon will override bash's range, shape, spread
        "ctr": 0,
        "range": 5,
        "spread": 0,
        "targetSelf": false
    },
    "fire": {
        "ctr": 5,
        "range": 3,
        "shape": "diamond",
        "spread": 1,
        "targetSelf": true
    }

}

function getSpread(x, y, action) {
    var newspread = [];
    
    newspread = [{x: x, y: y}];

    return newspread;
}

function getTargetList(map, unit, node, spread) {
    var targetList = [];
    spread.forEach(function(s) {
        var mapunit = map.getUnit(s.x, s.y);
        if (mapunit && mapunit.id != unit.id) { //do not target self based on map location
            targetList.push(mapunit);
        }
        if (s.x == node.x && s.y == node.y) { //only target self in new move location
            targetList.push(unit);
        }
    });
    return targetList;
}

function createDiamond(x, y, range, includeCenter) {
    var diamond = [];
    for (var i=-range; i<=range; i++) {
        for (var j=-range; j<=range; j++) {
            if (!includeCenter && i == j) {
                continue;
            }
            else if (Math.abs(i) + Math.abs(j) <= range) {
                diamond.push({
                    x: i + x,
                    y: j + y
                });
            }
        }
    }
    return diamond;
}

class BattleAction {
    constructor(battle, unit, action, d, node, score) {
        this.unit = unit;
        this.ctr = Math.floor(Math.random() * 20); //actions[action].ctr;
        this.range = action.range;
        this.spread = getSpread(x, y, action);
        this.x = d.x;
        this.y = d.y;
        this.node = node; //where the unit must be to complete action
        this.ready = false;
        this.remove = false;
        this.score = 0;
    }

    tick() {
        console.log("action tick");
        this.ctr -= 1;
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
    }

    invoke(battle) {
        console.log("action invoke");
        this.done();
        return null;
    }

    done() {
        this.remove = true;
        this.unit.actionmove = null;
    }

    draw(ctx) {

    }

    getDamage(target) {
        return Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
    }

    mustMoveFirst() {
        return (!(this.unit.x === this.node.x && this.unit.y === this.node.y));
    }

    toString() {
        return "Action - Unit No. " + this.unit.sprite + " - CTR: " + this.ctr + ", Node: " + this.x + ", " + this.y;
    }
}

class DoNothing {
    constructor(battle, unit) {
        this.unit = unit;
        this.ctr = 0;
        this.ready = true;
    }

    tick() {
        console.log("do nothing tick");
    }

    invoke() {
        this.done();
        this.unit.actionmove = null;
        return null;
    }

    done() {
        console.log("Unit No. " + this.unit.sprite + " did nothing...");
    }

    draw(ctx) {

    }

    toString() {
        return "Unit No. " + this.unit.sprite + ", - CTR: " + this.ctr  + ", Ready: " + this.ready;
    }
}

function getBestAction(battle, unit) {
    var bestAction = null;
    var possibleActions = [];

    var mapNodes = getMapNodes(battle, battle.units, unit);

    mapNodes.sort(function(a, b) { //most dangerous
        return a.safetyScore - b.safetyScore;
    });

    battle.mapNodes = mapNodes;

    unit.actions.forEach(function(action) {
        mapNodes.forEach(function(node) {
            var score = node.safetyScore;

            var diamond = createDiamond(node.x, node.y, action.range, action.targetSelf);

            diamond.forEach(function(d) {
                var spread = getSpread(d.x, d.y, action);
                spread.forEach(function(s) {
                    var targetList = getTargetList(battle, unit, node, action.spread);

                    targetList.forEach(function(target) {
                        score += action.getDamage(target);
                    });
                });

                var possibleAction = new BattleAction(
                    battle,
                    unit,
                    action,
                    d,
                    node,
                    score
                );

                possibleActions.push(possibleAction);
            });
        });
    });

    possibleActions.sort(function(a, b) {
        return b.score - a.score;
    });

    bestAction = possibleActions[0];

    return bestAction;
}