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
        this.moved = false;
        this.acted = false;
        this.moveNodes = null;
        this.path = null;
    }

    tick() {
        this.CT += this.agl;
    }

    turn() {
        if (!this.moved) {
            this.moveNodes = getMoveNodes(this, this.x, this.y, this.moverange);
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

            return task;
        }
        else {
            var task = new Task("done", this, 999, function(unit) { //task invoke
                //todo: which direction to face
                return false;
            }, function(unit) { //task done
                unit.done();
            });

            return task;
        }
    }

    done() {
        this.CT = 0;
        this.moved = false;
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

    var startNode = {
        x: startX,
        y: startY,
        steps: 0,
        parent: null
    };

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

            moveNodes.push({
                x: x,
                y: y,
                steps: steps,
                parent: moveNodes[i]
            });
        }

        i++;
    }

    //remove occupied tiles (team members and self)
    moveNodes = moveNodes.filter(function(node) {
        return !objectMap[node.x][node.y];
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