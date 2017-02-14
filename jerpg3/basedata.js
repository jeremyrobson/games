var materialmultipliers = {
	"cloth": 1,
	"leather": 2,
	"wood": 2,
	"iron": 3,
	"bronze": 4,
	"silver": 5,
	"gold": 6,
	"diamond": 7,
	"platinum": 8,
	"titanium": 9,
	"adamantium": 10
};

var qualitymultipliers = {
	
};

var elements = {
	
};

var itemtemplates = {
	"knife": {
		"base-att": 5,
		"base-dex": 5,
		"range": 1,
		"materials": ["wood", "bronze", "silver", "gold"]
	},
	"sword": {
		"base-att": 10,
		"base-dex": 3,
		"range": 1,
		"materials": ["wood", "bronze", "silver", "gold"]
	},
	"mace": {
		"base-att": 15,
		"base-dex": 2,
		"range": 1,
		"materials": ["wood", "bronze", "silver", "gold"]
	},
	"axe": {
		"base-att": 20,
		"base-dex": 1,
		"range": 1,
		"materials": ["wood", "bronze", "silver", "gold"]
	},
	"bow": {
		"base-att": 5,
		"base-dex": 5,
		"range": 10,
		"materials": ["wood", "bronze", "silver", "gold"]
	},
	"crossbow": {
		"base-att": 3,
		"base-dex": 10,
		"range": 5,
		"materials": ["wood", "bronze", "silver", "gold"]
	},
	"staff": {
		"base-att": 1,
		"base-dex": 5,
		"range": 1,
		"materials": ["wood", "bronze", "silver", "gold"]
	},
	"shield": {
		"base-def": 5,
		"materials": ["wood", "bronze", "silver", "gold"]
	},
	"hat": {
		"base-def": 1,
		"materials": ["cloth", "leather"]
	},
	"helmet": {
		"base-def": 5,
		"materials": ["leather", "iron", "bronze", "silver", "gold"]
	},
	"clothes": {
		"base-def": 2,
		"materials": ["cloth", "leather"]
	},
	"armor": {
		"base-def": 10,
		"materials": ["leather", "iron", "bronze", "silver", "gold"]
	},
	"ring": {
		"base-type": "accessory",
		"base-def": 0,
		"materials": ["iron", "bronze", "silver", "gold"]
	},
};

var racetemplates = {
	"Human": {
		"base-hp": 30,
		"base-str": 5,
		"base-agl": 5,
		"base-mag": 5
	},
	"Elf": {
		"base-hp": 30,
		"base-str": 5,
		"base-agl": 10,
		"base-mag": 10
	},
	"Dwarf": {
		"base-hp": 50,
		"base-str": 10,
		"base-agl": 5,
		"base-mag": 5
	},
	"Giant": {
		"base-hp": 100,
		"base-str": 15,
		"base-agl": 3,
		"base-mag": 3
	},
	"Hobbit": {
		"base-hp": 20,
		"base-str": 3,
		"base-agl": 15,
		"base-mag": 10
	},
	"Robot": {
		"base-hp": 75,
		"base-str": 10,
		"base-agl": 5,
		"base-mag": 0
	},
	"Zombie": {
		"base-hp": 66,
		"base-str": 6,
		"base-agl": 6,
		"base-mag": 6
	}
};

var jobclasses = {
	"Squire": {
		"base-hp": 30,
		"base-str": 5,
		"base-agl": 5,
		"base-mag": 5,
		"equip": {
			"right-hand": ["knife", "sword", "mace"],
			"left-hand": ["sword", "mace", "shield"],
			"both-hands": ["sword", "axe"],
			"head": ["hat", "helmet"],
			"body": ["clothes", "armor", "robe"],
			"accessory": ["*"]
		}
	},
	"Knight": {
		"base-hp": 50,
		"base-str": 10,
		"base-agl": 3,
		"base-mag": 3,
		"equip": {
			"right-hand": ["sword", "mace"],
			"left-hand": ["shield"],
			"both-hands": ["sword", "mace", "axe"],
			"head": ["helmet"],
			"body": ["armor", "robe"],
			"accessory": ["*"]
		}
	},
	"Archer": {
		"base-hp": 25,
		"base-str": 3,
		"base-agl": 10,
		"base-mag": 3,
		"equip": {
			"right-hand": ["bow", "crossbow"],
			"left-hand": [],
			"both-hands": [],
			"head": ["hat"],
			"body": ["clothes"],
			"accessory": ["*"]
		}
	},
	"Black Mage": {
		"base-hp": 25,
		"base-str": 3,
		"base-agl": 3,
		"base-mag": 10,
		"equip": {
			"right-hand": ["staff"],
			"left-hand": [],
			"both-hands": [],
			"head": ["hat"],
			"body": ["clothes", "robe"],
			"accessory": ["*"]
		}
	},
	"White Mage": {
		"base-hp": 25,
		"base-str": 3,
		"base-agl": 3,
		"base-mag": 10,
		"equip": {
			"right-hand": ["staff"],
			"left-hand": [],
			"both-hands": [],
			"head": ["hat"],
			"body": ["clothes"],
			"accessory": ["*"]
		}
	}
};
