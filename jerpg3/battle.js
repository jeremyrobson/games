class BattleQueue {
    constructor(units) {
        this.list = [];
        this.buffer = [];

        units.forEach(function(u) {
            this.list.push(u);
        }, this);
    }

    tick() {
        this.list = this.list.filter(function(item) {
            return !item.remove;
        });

        this.sort();

        if (this.list[0].ready) {
            return this.list[0];
        }

        this.list.forEach(function(item) {
            item.tick();
        });

        return null;
    }

    add(item) {
        this.list.push(item);
        this.sort();
    }

    sort() {
        this.list.sort(function(a, b) {
            if (a.ctr < b.ctr) return -1;
            if (a.ctr > b.ctr) return 1;
            if (a.priority > b.priority) return -1;
            if (a.priority < b.priority) return 1;
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0; //this should never happen
        });
    }

    toString() {
        var outputText = "";
        this.list.forEach(function(item) {
            outputText += item.toString() + "\n";
        });
        return outputText;
    }
}

class BattleUnit {
    constructor(team, action) {
        this.id = Math.floor(Math.random() * 10000000);
        this.team = team;
        this.sprite = Math.floor(Math.random() * 90) + 10;
        this.color = ["rgb(255,0,0)", "rgb(0,255,0)"][team];
        this.x = Math.floor(Math.random() * MAP_WIDTH),
        this.y = Math.floor(Math.random() * MAP_HEIGHT),
        this.ct = 100;
        this.ctr = 0;
        this.agl = Math.floor(Math.random() * 5) + 5;
        this.actionmove = null;
        this.priority = 0; //actions and moves go before unit turns
        this.ready = this.ctr === 0;
        this.moved = false;
        this.acted = false;

        this.action = actions[action];
    }

    tick() {
        this.ctr -= 1;
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
    }

    invoke(battle) {
        if (this.actionmove) { //unit is already charging
            console.log("Unit No. " + this.actionmove.unit.sprite + " is already preparing to act.");
        }
        else {
            if (!this.moved && !this.acted) {
                this.actionmove = getBestMove(battle, this);
            }
            battle.queue.add(this.actionmove);
        }
        this.done();
        return null;
    }

    done() {
        if (this.moved && this.acted) {
            this.ct = 100;
        }
        else if (this.moved) {
            this.ct = 80;
        }
        else if (this.acted) {
            this.ct = 80;
        }
        else {
            this.ct = 60;
        }
        this.ctr = Math.ceil(this.ct / this.agl);
        this.ready = false;
    }

    draw(ctx) {
        var dx = this.x * TILE_WIDTH;
        var dy = this.y * TILE_HEIGHT;
        ctx.font = "25px Arial";
        ctx.textBaseline = "top";
        ctx.fillStyle = this.color;
        ctx.fillText(this.sprite, dx, dy);
    }

    toString() {
        return "Unit No. " + this.sprite + " - CTR: " + this.ctr + ", Ready: " + this.ready;
    }
}

class GameBattle {
    constructor() {
        this.units = [
            new BattleUnit(0, "bash"),
            new BattleUnit(0, "bash"),
            new BattleUnit(0, "bash"),
            new BattleUnit(0, "bash"),
            new BattleUnit(1, "bash"),
            new BattleUnit(1, "bash"),
            new BattleUnit(1, "bash"),
            new BattleUnit(1, "bash"),
        ];
        this.queue = new BattleQueue(this.units);
        this.activeItem = null;
        this.mapNodes = [];
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;

        this.tile = generateTiles(MAP_WIDTH, MAP_HEIGHT);
    }

    start() {
        this.units.forEach(function(u) {
            u.done();
        });
    }

    update() {
        
        if (this.activeItem) {
            this.activeItem = this.activeItem.invoke(this);
            this.queue.sort();
        }
        else {
            this.activeItem = this.queue.tick();
        }

        output.value = this.queue.toString();
    }

    moveUnit(unit, node) {
        this.tile[unit.x][unit.y].removeUnit(unit);
        unit.x = node.x;
        unit.y = node.y;
        this.tile[unit.x][unit.y].addUnit(unit);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, 640, 480);
        for (var x=0; x<MAP_WIDTH; x++) {
            for (var y=0; y<MAP_HEIGHT; y++) {
                ctx.fillStyle = "rgb(0,150,50)";
                ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH - 1, TILE_HEIGHT - 1);
            }
        }

        this.mapNodes.forEach(function(node) {
            ctx.fillStyle = "rgba(255,0,0," + node.safetyScore + ")";
            ctx.fillRect(node.x * TILE_WIDTH, node.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        });

        this.units.forEach(function(u) {
            u.draw(ctx);
        });
    }
}