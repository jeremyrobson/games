class Unit {
    constructor() {
        this.name = random_word(3, 10);
        this.equip = {};

        types.forEach(function(type) {
            this.equip[type] = null;
        }, this);
    }

    equip_item(item) {
        this.equip[item.type] = item;
    }
}

function random_unit() {
    return new Unit();
}