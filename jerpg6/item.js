var types = ["right-hand", "left-hand", "head", "body", "accessory"];
var subtypes = [
    {
        "type": "right-hand",
        "name": "sword"
    },
    {
        "type": "left-hand",
        "name": "shield"
    },
    {
        "type": "head",
        "name": "helmet"
    },
    {
        "type": "body",
        "name": "armor"
    },
    {
        "type": "accessory",
        "name": "ring"
    }
]

class Item {
    constructor(type, subtype) {
        this.name = random_word(3, 10);
        this.type = type;
        this.subtype = subtype;
        this.elements = [];
        this.effects = [];
        this.stats = [];
    }
}


function random_item() {
    var type = types.selectRandom();
    var subtype_shortlist = subtypes.filter(function(item) {
        return item.type === type;
    });
    var subtype = subtype_shortlist.selectRandom();
    return new Item(type, subtype.name);
}