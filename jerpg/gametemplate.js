let templates = {
    "unit-template": {
        "_id": "",
        "name": "",
        "race": "",
        "job-class": "",
        "equip": {
            "left-hand": "",
            "right-hand": "",
            "two-hand": "",
            "head": "",
            "body": "",
            "accessory": ""
        },
        "stats": {
            "HP": { "val": 0, "max": 0 },
            "MP": { "val": 0, "max": 0 },
            "PWR": { "val": 0, "max": 0 },
            "DEF": { "val": 0, "max": 0 },
            "STR": { "val": 0, "max": 0 },
            "AGL": { "val": 0, "max": 0 },
            "STA": { "val": 0, "max": 0 },
            "MAG": { "val": 0, "max": 0 }
        },
        "statuses": []
    },
    "equip-types": ["left-hand", "right-hand", "head", "body", "accessory"],
    "stats": ["HP", "MP", "PWR", "DEF", "STR", "AGL", "STA", "MAG"],
    "race-template": {
        "Human": {
            "base-HP": 25,
            "base-MP": 10,
            "base-STR": 3,
            "base-AGL": 3,
            "base-MAG": 3
        }
    },
    "races": ["Human"],
    "job-class-template": {
        "Squire": {
            "mult-HP": 2,
            "mult-MP": 2,
            "mult-STR": 2,
            "mult-AGL": 2,
            "mult-MAG": 2
        },
        "Mage": {
            "mult-HP": 1,
            "mult-MP": 3,
            "mult-STR": 1,
            "mult-AGL": 1,
            "mult-MAG": 3
        }
    },
    "job-classes": ["Squire", "Mage"],
    "item-template": {
        "_id": "",
        "name": "",
        "type": "",
        "equip-type": [],
        "job-class": [],
        "quality": "",
        "material": "",
        "stats": [],
        "elemental-FX": [],
        "status-FX": [],
        "bonuses": []
    },
    "item-types": {
        "Sword": {
            "equip-type": ["right-hand", "two-hand"],
            "job-class": ["Squire", "Knight"],
            "materials": ["Iron", "Gold"],
            "qualities": ["Broken", "Wellmade"],
            "base-PWR": 5,
            "bonus-chance": 0.1
        },
        "Shield": {
            "equip-type": ["left-hand"],
            "job-class": ["Squire", "Knight"],
            "materials": ["Iron", "Gold"],
            "qualities": ["Broken", "Wellmade"],
            "base-DEF": 5,
            "bonus-chance": 0.1
        },
        "Hat": {
            "equip-type": ["head"],
            "job-class": ["Squire", "Mage"],
            "materials": ["Cloth", "Leather"],
            "qualities": ["Broken", "Wellmade"],
            "base-DEF": 1,
            "bonus-chance": 0.0
        },
        "Robe": {
            "equip-type": ["body"],
            "job-class": ["Mage"],
            "materials": ["Cloth", "Silk"],
            "qualities": ["Broken", "Wellmade"],
            "base-DEF": 1,
            "bonus-chance": 0.1
        },
        "Ring": {
            "equip-type": ["accessory"],
            "job-class": ["Squire", "Knight", "Mage"],
            "materials": ["Iron", "Gold"],
            "qualities": ["Broken", "Wellmade"],
            "base-DEF": 1,
            "bonus-chance": 1.0
        }
    },
    "item-types-list": ["Sword", "Shield", "Hat", "Robe", "Ring"],
    "qualities": {
        "Wellmade": { "mult-PWR": 2, "mult-DEF": 2 }
    },
    "qualities-list": ["Broken", "Wellmade"],
    "materials": {
        "Iron": { "mult-PWR": 1, "mult-DEF": 1 },
        "Gold": { "mult-PWR": 1, "mult-DEF": 1 },
    },
    "materials-list": ["Iron", "Gold"],
    "elements": {
        "Fire": {
            "strong": ["Fire"],
            "weak": ["Water", "Ice"]
        },
        "Ice": {
            "strong": ["Water", "Ice"],
            "weak": ["Fire"]
        }
    },
    "elements-list": ["Fire"],
    "status-types": {
        "Blind": {
            "stat": {
                "mult-ACC": 0.5,
                "mult-EVA": 0.5
            }
        }
    },
    "status-types-list": ["Blind"],
    "ElementalFX": {
        "Quarter": {
            "mult": 0.25
        },
        "Half": {
            "mult": 0.5
        },
        "Double": {
            "mult": 2
        },
        "Triple": {
            "mult": 3
        },
        "Absorb": {
            "mult": -1
        },
        "Nullify": {
            "mult": 0
        }
    },
    "elemental-fx-types": ["Quarter", "Half", "Double", "Triple", "Absorb", "Nullify"],
    "status-FX-template": {
        "name": "",
        "add": {
            "chance": 0
        },
        "prevent": {
            "chance": 0
        }
    },
    "bonus-template": {
        "stat": "",
        "add": "",
        "sub": "",
        "mult": ""
    }
}

Array.prototype.chooseRandom = function() {
    return this[Math.floor(Math.random() * this.length)];
};

function createUnitFromTemplate(race, jobClass) {
    let unit = JSON.parse(JSON.stringify(templates["unit-template"]));
    unit["_id"] = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
    unit["name"] = "Unit " + unit["_id"];
    unit["job-class"] = jobClass;
    return unit;
};

function createItemFromTemplate(itemType, quality, material) {
    let item = JSON.parse(JSON.stringify(templates["item-template"]));
    item["_id"] = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
    item["name"] = itemType + " " + item["_id"];
    item["type"] = itemType;
    
    let itemTemplate = templates["item-types"][itemType];
    for (let key in itemTemplate)
        item[key] = itemTemplate[key];
    
    return item;
}

function getDefaultItem(jobClass, equipType) {
    let newItem = "";
    let itemTypeList, itemType, qualityList, quality, materialList, material;
    
    try {
        //get list of item types of job-appropriate and equip-appropriate items
        itemTypeList = templates["item-types-list"].filter(function(itemType) {
            let itemTemplate = templates["item-types"][itemType];
            if (!itemTemplate) throw "Error: Missing template for " + itemType;
            return itemTemplate["job-class"].indexOf(jobClass) >= 0 &&
            templates["item-types"][itemType]["equip-type"].indexOf(equipType) >= 0;
        });
        
        if (itemTypeList.length == 0)
            throw "Error: No items found for " + jobClass + " and " + equipType;
        
        itemType = itemTypeList.chooseRandom();
        
        //get list of qualities that are in quality-list and the item type's possible qualities
        qualityList = templates["qualities-list"].filter(function(quality) {
            return templates["item-types"][itemType]["qualities"].indexOf(quality) >= 0;
        });
        
        if (qualityList.length == 0)
            throw "Error: No qualities found for " + itemType;

        quality = qualityList.chooseRandom();
        
        //get list of materials that are in material-list and the item type's possible materials
        materialList = templates["materials-list"].filter(function(material) {
            return templates["item-types"][itemType]["materials"].indexOf(material) >= 0;
        });
        
        if (materialList.length == 0)
            throw "Error: No materials found for " + itemType;
     
        material = materialList.chooseRandom();
        
        newItem = createItemFromTemplate(itemType, quality, material);
        items.push(newItem);
        console.log("Created new item: ", newItem);
    }
    catch(err) {
        console.log(err);
    }
    finally {
        //console.log("moving on to next item");
    }
    
    return newItem;
}

function generateParty(count) {
    party.units = [];
    for (let i=0; i<count; i++) {
        let race = templates["races"].chooseRandom();
        let jobClass = templates["job-classes"].chooseRandom();
        let unit = createUnitFromTemplate(race, jobClass);

        party.units.push(unit);
        
        for (let equipType in unit.equip) {
            let newItem = getDefaultItem(jobClass, equipType);
            unit.equip[equipType] = newItem;
        }
    }
}

let party = {};
let items = [];

generateParty(5);
