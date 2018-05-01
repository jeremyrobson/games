

class Battle {
    constructor(party) {
        this.parties = [];
        this.parties.push(party);

        var enemyparty = new Party("cpu", "o");
        this.parties.push(enemyparty);

        this.units = party.units.concat(enemyparty.units);
        this.battleState = new BattleState_NextTurn(this.units);
    }

    loop() {
        this.battleState = this.battleState.loop();
        
        if (this.battleState === null) {
            this.battleState = new BattleState_NextTurn(this.units);
        }
    }

    mouse_down(mx, my) {
        var partyindex = Math.floor(mx / XOFFSET);
        mx = mx - partyindex * XOFFSET;
        
        var tx = Math.floor(mx / 32);
        var ty = Math.floor(my / 32);
        this.battleState.mouse_down(tx, ty);
    }

    draw(ctx) {
        this.battleState.draw(ctx);

        ctx.textBaseline = "top";
        ctx.font = "24px Arial";
        this.units.forEach(function(unit) {
            var dx = unit.x * 32 + unit.xoffset;
            var dy = unit.y * 32;

            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillText(unit.sprite, dx, dy);
        });
    }
}

class BattleState {
    constructor(units, nextunit) {
        this.units = units;
        this.unit = nextunit;
    }

    mouse_down(x, y) {
        console.log(x, y);
    }

    getUnit(x, y) {
        var unit = null;
        this.units.forEach(function(u) {
            if (x === u.x && y === u.y) {
                unit = u;
            }
        });
        return unit;
    }

    draw(ctx) {
        if (this.unit) {
            ctx.fillStyle = "rgba(0, 155, 255, 0.5)";
            ctx.fillRect(this.unit.x * 32, this.unit.y * 32, 32, 32);
        }
    }

    getDamage() {
        return Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
    }

    invokeAction(actor, action) {
        action.targets.forEach(function(unit) {
            var damage = this.getDamage();
            console.log(actor.sprite + " attacked " + unit.sprite + " for " + damage + " HP damages.");
        }, this);
        
    }
}

class BattleState_NextTurn extends BattleState {
    constructor(units) {
        super();
        this.units = units;
    }

    loop() {
        var nextunit = null;

        this.units.forEach(function(unit) {
            unit.CT += unit.agl;
            if (unit.CT >= 100) {
                if (nextunit) {
                    if (unit.CT > nextunit.CT) {
                        nextunit = unit;
                    }
                }
                else {
                    nextunit = unit;
                }
            }
        });

        if (nextunit) {
            if (nextunit.team === "cpu") {
                return new BattleState_CPUTurn(this.units, nextunit);
            }
            else {
                return new BattleState_PlayerTurn(this.units, nextunit);
            }
        }
        else {
            return this;
        }
    }
}

class BattleState_CPUTurn extends BattleState {
    constructor(units, nextunit) {
        super(units, nextunit);
        this.moved = false;
    }

    loop() {
        var actions = [];

        this.units.forEach(function(u) {
            var action = {};

            action.targets = [];
            action.targets.push(u);
            action.score = this.getActionScore(this.unit, action.targets);

            actions.push(action);
        }, this);

        actions.sort(function(a, b) {
            return b.score - a.score;
        });

        this.invokeAction(this.unit, actions[0]);

        //this.unit.move(x, y);
        //this.moved = true;
        this.unit.CT = 0;
        return null;
    }

    getActionScore(actor, targets) {
        var score = 0;

        targets.forEach(function(unit) {
            var damage = this.getDamage();

            if (unit.team === actor.team) {
                score -= damage;
            }
            else {
                score += damage;
            }
        }, this);

        return score;
    }

    
}

class BattleState_PlayerTurn extends BattleState {
    constructor(units, nextunit) {
        super(units, nextunit);
        this.moved = false;
    }

    loop() {
        if (this.moved) {
            return null;
        }
        else {
            return this;
        }
    }

    mouse_down(x, y) {
        var unit = this.getUnit(x, y);
        if (unit) {
            console.log("Cannot move there.", unit);
        }
        else {
            this.unit.move(x, y);
            this.moved = true;
            this.unit.CT = 0;
        }
    }
}