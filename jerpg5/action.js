class Action {
    /**
     *  @param {ActionTemplate} actiontemplate - the template for the action
     *  @param {Unit} unit - the unit who is invoking the action
     *  @param {Node} node - the node where the unit must be in order to carry out the action
     *  @param {ITargettable} target - the unit or tile where the action is hitting
     *  @param {int} score - the field to sort actions by: high to low
     */
    constructor(actiontemplate, unit, node, target, score) {
        this.actiontemplate = actiontemplate;
        this.unit = unit;
        this.node = node;
        this.target = target;
        this.score = score;
        this.requiresMove = false;

        if (node.x !== unit.x || node.y !== unit.y) {
            this.requiresMove = true;
        }
    }

    invoke() {
        console.log(this.unit.sprite + " used " + this.actiontemplate.name + " on " + this.target.x + ", " + this.target.y);

        var unitMap = createUnitMap();
        var targetList = getTargetList(this.actiontemplate, this.target, unitMap);
        targetList.forEach(function(unit) {
            var damage = calculateDamage(this.actiontemplate, this.unit, this.target);
            unit.applyDamage(damage);
            layer2.add(new Animation(unit.x * 40, unit.y * 40, 32, this.actiontemplate.sprite));
            layer2.add(new TextBall(unit.x * 40, unit.y * 40, 24, new Color(255, 255, 255, 1.0), damage));
        }, this);
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(0,255,0,0.9)";

        var spread = getSpread(this.actiontemplate.spread, this.target);
        spread.forEach(function(s) {
            ctx.fillRect(s.x * 40, s.y * 40, 40, 40);
        });
    }
}