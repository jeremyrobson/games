class Party {
    constructor(team, sprite) {
        this.units = [
            new Unit(team, 0, 0, sprite),
            new Unit(team, 1, 0, sprite),
            new Unit(team, 0, 1, sprite),
            new Unit(team, 1, 1, sprite),
            new Unit(team, 1, 2, sprite)
        ];
    }

    addUnit(unit) {
        this.units.push(unit);
    }
}