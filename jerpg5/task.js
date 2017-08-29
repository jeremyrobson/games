class Task {
    constructor(type, unit, CT, invoke, done) {
        this.type = type;
        this.unit = unit;
        this.CT = CT;
        this.invoke = invoke;
        this.done = done;
        this.sprite = tasksprites[type];
        this.remove = false;
    }

    turn() {
        if (this.invoke(this.unit) === false) {
            this.done(this.unit);
            this.remove = true;
        }
    }

    toString(ctx) {
        return this.unit.sprite + " " + this.sprite + "CT: " + this.CT;
    }
}