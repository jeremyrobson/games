class Unit {
    constructor(team, x, y) {
        this.team = team;
        this.x = x;
        this.y = y;
        this.sprite = sprites[Math.floor(Math.random() * sprites.length)];
        this.agl = Math.floor(Math.random() * 9) + 1;
        this.CT = 0;
        this.CTR = 0; // Math.ceil(100 / this.agl);
        this.moverange = Math.floor(Math.random() * 5) + 5;
        this.action = null;
        this.moved = false;
        this.acted = false;
        this.moveNodes = null;
        this.path = null;
    }

    tick() {
        this.CT += this.agl;
    }

    turn() {
        var task = null;

        if (!this.moved && !this.acted) {
            this.moveNodes = getMoveNodes(this, this.x, this.y, this.moverange);
            this.action = getBestAction(this);
            
            if (this.action.requiresMove) {
                this.path = getPath(this.action.node);
                var task = new Task("move", this, 999, function(unit) { //task invoke
                    var p = unit.path.getNextNode();
                    if (p) {
                        unit.move(p.x, p.y);
                        return true;
                    }
                    else {
                        return false;
                    }
                }, function(unit) { //task done
                    unit.moved = true;
                    unit.moveNodes = null;
                    unit.path = null;
                });
            }
            else {
                var task = new Task("action", this, 999, function(unit) { //task invoke
                    unit.action.invoke();
                    return false;
                }, function(unit) { //task done
                    unit.acted = true;
                    unit.action = null;
                });
            }
        }
        else if (!this.moved) {
            this.moveNodes = getMoveNodes(this, this.x, this.y, this.moverange);

            //todo: move to safest node, not random one
            var randomNode = this.moveNodes[Math.floor(Math.random() * this.moveNodes.length)];
            this.path = getPath(randomNode);
            var task = new Task("move", this, 999, function(unit) { //task invoke
                var p = unit.path.getNextNode();
                if (p) {
                    unit.move(p.x, p.y);
                    return true;
                }
                else {
                    return false;
                }
            }, function(unit) { //task done
                unit.moved = true;
                unit.moveNodes = null;
                unit.path = null;
            });
        }
        else if (!this.acted) {
            this.moveNodes = [new MoveNode(this.x, this.y, 0, null, 0)];
            this.action = getBestAction(this);

            var task = new Task("action", this, 999, function(unit) { //task invoke
                unit.action.invoke();
                return false;
            }, function(unit) { //task done
                unit.acted = true;
                unit.action = null;
            });
        }
        else {
            var task = new Task("done", this, 999, function(unit) { //task invoke
                //todo: which direction to face
                return false;
            }, function(unit) { //task done
                unit.done();
            });
        }

        return task;
    }

    done() {
        this.CT = 0;
        this.moved = false;
        this.acted = false;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {

    }

    draw(ctx) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = "32px Arial";
        ctx.fillText(this.sprite, this.x * 40, this.y * 40);
    }
    
    toString() {
        return this.sprite + "CT: " + this.CT;
    }
}

function getMoveNodes(unit, startX, startY, range) {
    var moveNodes = [];
    var binaryMap = createTileMap(12, 12, 0);
    var objectMap = createObjectMap();

    var startNode = new MoveNode(startX, startY, 0, null, 0);

    moveNodes.push(startNode);

    binaryMap[startX][startY] = 1;

    var xmove = [-1, 0, 1, 0];
    var ymove = [0, -1, 0, 1];
    var i = 0;
    while (i < moveNodes.length) {

        var steps = moveNodes[i].steps + 1;
        if (steps > range) {
            i++;
            continue;
        }

        for (var j=0; j<4; j++) {
            var x = moveNodes[i].x + xmove[j];
            var y = moveNodes[i].y + ymove[j];

            if (x < 0 || y < 0 || x > 11 || y > 11) {
                continue;
            }

            if (binaryMap[x][y] > 0) {
                continue; //can't visit visited tiles
            }
            else {
                binaryMap[x][y] = 1; //visit the current tile
            }
            
            if (objectMap[x][y] instanceof Unit) {
                var u = objectMap[x][y];

                //can't pass through enemy units
                if (u.team !== unit.team) {
                    continue;
                }
            }

            moveNodes.push(new MoveNode(x, y, steps, moveNodes[i], 0));
        }

        i++;
    }

    //remove occupied tiles (team members, trees, etc., but not self on first node)
    moveNodes = moveNodes.filter(function(node, i) {
        return !objectMap[node.x][node.y] || i === 0;
    });

    return moveNodes;
}

function getPath(node) {
    var nodes = [];

    while (node.parent) {
        nodes.push(node);
        node = node.parent;
    }

    return {
        index: 0,
        nodes: nodes.reverse(),
        getNextNode: function() {
            return this.nodes[this.index++];
        }
    };
}

function getBestAction(unit) {
    var actionList = [];
    unit.moveNodes.forEach(function(node, i) {
        var rangeList = [
            {x: node.x - 1, y: node.y},
            {x: node.x + 1, y: node.y},
            {x: node.x, y: node.y - 1},
            {x: node.x, y: node.y + 1},
        ];
        rangeList.forEach(function(r) {
            var actiontemplate = "melee";

            if (r.x === unit.x && r.y === unit.y && i > 0) {
                //if i > 0 then the unit has moved before invoking this action
                //if r.xy === unit.xy then it is attempting to invoke an action
                //on its former position post-move, which is a no-no
            }
            else {
                var targetList = getTargetList(actiontemplate, r);
                var score = calculateActionScore(actiontemplate, unit, targetList);
                actionList.push(new Action(actiontemplate, unit, node, r, score));
            }
        });
    });

    actionList.sort(function(a, b) {
        return b.score - a.score;
    });

    console.log(actionList);

    return actionList[0];
}

function getBestMove(unit) {

}

function getTargetList(actiontemplate, r) {
    var spread = [r]; //getSpread(actiontemplate.spread, r);
    var targetList = [];

    //actiontemplate.spread.forEach()

    spread.forEach(function(s) {
        var unit = getUnitByPosition(s.x, s.y);
        if (unit) {
            targetList.push(unit);
        }
    });

    return targetList;
}

function calculateActionScore(actiontemplate, unit, targetList) {
    var score = 0;

    targetList.forEach(function(target) {
        score += calculateDamage(actiontemplate, unit, target);
    });

    return score;
}

function calculateDamage(actiontemplate, unit, r) {
    var damage = 0;

    damage = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;

    return damage;
}