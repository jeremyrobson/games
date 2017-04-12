var actions = {
    "bash": {
        "ctr": 0,
        "range": 1,
        "shape": "line",
        "spread": 0
    },
    "spear": { //weapon will override bash's range, shape, spread
        "ctr": 0,
        "range": 2,
        "shape": "line",
        "spread": 0
    },
    "arrow": { //weapon will override bash's range, shape, spread
        "ctr": 0,
        "range": 5,
        "spread": 0
    },
    "fire": {
        "ctr": 5,
        "range": 3,
        "shape": "diamond",
        "spread": 1
    }

}

function getSpread(x, y, action) {
    var newspread = [];
    
    newspread = [{x: x, y: y}];

    return newspread;
}

function getTargetList(map, unit, move, spread) {
    var targetList = [];
    spread.forEach(function(s) {
        var mapunit = map.getUnit(s.x, s.y);
        if (mapunit && mapunit.id != unit.id) { //do not target self based on map location
            targetList.push(mapunit);
        }
        if (s.x == move.x && s.y == move.y) { //only target self in new move location
            targetList.push(unit);
        }
    });
    return targetList;
}

class BattleAction {
    constructor(battle, unit, action, x, y, node) {
        this.unit = unit;
        this.ctr = Math.floor(Math.random() * 20); //actions[action].ctr;
        this.range = actions[action].range;
        this.spread = getSpread(x, y, actions[action]);
        this.x = x;
        this.y = y;
        this.node = node; //where the unit must be to complete action
        this.ready = false;
        this.remove = false;
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

    var mapNodes = getMapNodes(battle, battle.units, unit);

    mapNodes.sort(function(a, b) { //most dangerous
        return a.safetyScore - b.safetyScore;
    });

    battle.mapNodes = mapNodes;

    bestAction = new BattleAction(
        battle,
        unit,
        "bash",
        Math.floor(Math.random() * 16),
        Math.floor(Math.random() * 16),
        mapNodes[0]
    );

    return bestAction;
}