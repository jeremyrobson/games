class Unit {
    constructor(team, x, y, sprite) {
        this.id = Math.floor(Math.random() * 100000000);
        this.team = team;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.actions = [actiontemplates["melee"], actiontemplates["fire"]];
        this.hp = 100;
        this.agl = Math.floor(Math.random() * 9) + 1;
        this.CT = 0;
        this.CTR = 0; // Math.ceil(100 / this.agl);
        this.moverange = Math.floor(Math.random() * 5) + 5;
        this.action = null;
        this.moved = false;
        this.acted = false;
        this.moveNodes = null;
        this.diamond = null;
        this.path = null;
    }

    tick() {
        this.CT += this.agl;
    }

    turn() {
        var task = null;
        var safetyScores = getSafetyScores(this, units);

        if (!this.moved && !this.acted) {
            this.moveNodes = getMoveNodes(this, this.x, this.y, this.moverange, safetyScores);
            this.action = getBestAction(this);
            this.diamond = createDiamond(
                this.action.actiontemplate.range,
                this.action.node.x,
                this.action.node.y,
                this.action.actiontemplate.center);

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
                    unit.diamond = null;
                });
            }
        }
        else if (!this.moved) {
            this.moveNodes = getMoveNodes(this, this.x, this.y, this.moverange, safetyScores);

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
            this.diamond = createDiamond(
                this.action.actiontemplate.range,
                this.action.node.x,
                this.action.node.y,
                this.action.actiontemplate.center);

            var task = new Task("action", this, 999, function(unit) { //task invoke
                unit.action.invoke();
                return false;
            }, function(unit) { //task done
                unit.acted = true;
                unit.action = null;
                unit.diamond = null;
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

    applyDamage(damage) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
        }
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

function getMoveNodes(unit, startX, startY, moverange, safetyScores) {
    var moveNodes = [];
    var binaryMap = createTileMap(WIDTH, HEIGHT, 0);
    var objectMap = createObjectMap();

    var startNode = new MoveNode(startX, startY, 0, null, 0);

    moveNodes.push(startNode);

    binaryMap[startX][startY] = 1;

    var xmove = [-1, 0, 1, 0];
    var ymove = [0, -1, 0, 1];
    var i = 0;
    while (i < moveNodes.length) {

        var steps = moveNodes[i].steps + 1;
        if (steps > moverange) {
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

            moveNodes.push(new MoveNode(x, y, steps, moveNodes[i], safetyScores[x][y]));
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
        var unitMap = createUnitMap(); //todo: create single unitMap and clone
        unitMap[unit.x][unit.y] = null;
        unitMap[node.x][node.y] = unit;

        unit.actions.forEach(function(actiontemplate) {
            var diamond = createDiamond(actiontemplate.range, node.x, node.y, actiontemplate.center);

            diamond.forEach(function(d) {
                var targetList = getTargetList(actiontemplate, d, unitMap);
                var score = calculateActionScore(actiontemplate, unit, targetList);
                score += node.safetyScore;
                actionList.push(new Action(actiontemplate, unit, node, d, score));
            });
        });
    });

    actionList.sort(function(a, b) {
        return b.score - a.score;
    });

    return actionList[0];
}

function getBestMove(unit) {

}

/**
 *  @param {int} radius - the radius of the diamond
 *  @param {int} centerx - the center x of the diamond
 *  @param {int} centery - the center y of the diamond
 *  @param {boolean} center - whether or not to include the center tile
 */
function createDiamond(radius, centerx, centery, includeCenter) {
    var diamond = [];

    for (var i=-radius; i<=radius; i++) {
        for (var j=-radius; j<=radius; j++) {
            if (Math.abs(i) + Math.abs(j) <= radius) {
                if (!includeCenter && i === j && i === 0) {
                    continue;
                }

                var x = i + centerx;
                var y = j + centery;

                if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
                    continue;
                }

                diamond.push({ x, y });
            }
        }
    }

    return diamond;
}

function getSpread(spreadtemplate, d) {
    var spread = [];

    spreadtemplate.forEach(function(s) {
        var x = s.x + d.x;
        var y = s.y + d.y;

        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) {
            return;
        }

        spread.push({ x, y });
    });

    return spread;
}

function getTargetList(actiontemplate, d, unitMap) {
    var spread = getSpread(actiontemplate.spread, d);
    var targetList = [];

    spread.forEach(function(s) {
        var unit = unitMap[s.x][s.y];
        if (unit) {
            targetList.push(unit);
        }
    });

    return targetList;
}

function calculateActionScore(actiontemplate, unit, targetList) {
    var score = 0;

    targetList.forEach(function(target) {
        if (unit.team === target.team) {
            score -= calculateDamage(actiontemplate, unit, target);
        }
        else {
            score += calculateDamage(actiontemplate, unit, target);
        }
    });

    return score;
}

function calculateDamage(actiontemplate, unit, target) {
    var damage = 0;

    damage = actiontemplate.pow;

    return damage;
}