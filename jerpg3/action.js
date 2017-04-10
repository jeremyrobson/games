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
        this.ctr = actions[action].ctr;
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

    getDamage(target) {
        return Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
    }

    toString() {
        return "Action - Unit No. " + this.unit.sprite + " - CTR: " + this.ctr + ", Node: " + this.x + ", " + this.y;
    }
}

function getBestAction(battle, unit) {
    var bestAction = null;

    bestAction = new BattleAction(battle, unit, "bash", 5, 5, new MoveNode(0, 0, 0, 0, 0));

    return bestAction;
}