let tiletemplates = {
    "water": {
        "color": "rgb(0,0,255)"
    },
    "grass": {
        "color": "rgb(0,255,0)"
    },
    "tree": {
        "color": "rgb(0,155,0)"
    },
    "road": {
        "color": "rgb(200,155,55)"
    },
    "stone": {
        "color": "rgb(155,155,155)"
    },
    "path": {
        "color": "rgb(200,200,200)"
    },
    "wall": {
        "color": "rgb(50,100,0)"
    },
    "floor": {
        "color": "rgb(100,155,50)"
    }
}

let maptypes = ["world", "town", "dungeon"];

let maptemplates = {
    "world": {
        "tiles": ["water", "grass"],
        //"doors": ["town", "dungeon"],
        "objects": ["tree"],
        "maptypes": ["house"],
    },
    "town": {
        "tiles": ["tree", "grass", "road"],
        //"doors": ["exit"],
        "objects": ["house"],
        "maptypes": ["house"],
    },
    "dungeon": {
        "tiles": ["stone", "path"],
        //"doors": ["exit", "dungeon"],
        "objects": ["treasure"],
        "maptypes": ["dungeon"]
    },
    "house": {
        "tiles": ["wall", "floor"],
        "objects": ["treasure"],
        "maptypes": ["house"]
    }
};

class GameMap {
    constructor(maptype, parentmap, doorcount) { //todo: pass exit as well?
        this.type = maptype;
        this.maptypes = maptemplates[maptype]["maptypes"];
        this.objects = generate_objects(maptemplates[maptype]["objects"])
        this.doors = generate_doors(maptemplates[maptype]["maptypes"], this, parentmap, doorcount);
        this.tiles = generate_tiles(maptemplates[maptype]["tiles"], this.doors);
    }
    
    loop() {
      
    }

    mouseDown(mx, my) {
        var tx = Math.floor(mx / 16);
        var ty = Math.floor(my / 16);
        var door = this.tiles[tx][ty].door;
        if (door) {
            return door.destmap;
        }
        return this;
    }
    
    draw(ctx) {
        for (var x=0;x<16;x++) {
            for (var y=0;y<16;y++) {
                var color = this.tiles[x][y].color;
                ctx.fillStyle = color;
                ctx.fillRect(x*16,y*16,16,16);
            }
        }
        
        this.doors.forEach(function(door) {
            ctx.fillStyle = "rgb(255,255,0)";
            ctx.fillRect(door.x*16,door.y*16,16,16);
        });
    }
}

class Door {
    constructor(doortype, destmap) {
        this.destmap = destmap;
        this.x = randint(0,16);
        this.y = randint(0,16);
    }
}

class MapObject {
    construtor(objecttype) {
        this.type = objecttype;
        this.color = "rgb(255,0,255)";
        this.x = randint(0,16);
        this.y = randint(0,16);
    }
}

function generate_doors(arr, map, parentmap, doorcount = 3) {
    var doors = [];
    
    if (parentmap) {
        doors.push(new Door("exit", parentmap));
        console.log(parentmap);
    }

    
    for (var i=0; i<doorcount; i++) {
        var doortype = arr.random();
        var maptype = map.maptypes.random();
        var newmap = new GameMap(maptype, map, doorcount - 1);
        doors.push(new Door(doortype, newmap));
    }
    return doors;
}

function generate_tiles(arr, doors) {
    var tiles = [];
    var tiletype = arr[0];
    
    for (var x = 0; x < 16; x++) {
        tiles[x] = [];
        for (var y=0; y<16;y++) {
            tiles[x][y] = clone(tiletemplates[tiletype]);
        }
    }
    
    doors.forEach(function(door, i) {
        tiles[door.x][door.y].door = door;
        generate_path(tiles, arr[1], door, doors[i-1]);
    });
    
    return tiles;
}

function generate_path(tiles, pathtile, srcdoor, destdoor) {
    if (!destdoor) return;
  
    var sx = srcdoor.x;
    var sy = srcdoor.y;
  
    while (sx != destdoor.x && sy != destdoor.y) {
        var dx = destdoor.x - sx;
        var dy = destdoor.y - sy;
        var angle = Math.atan2(dy, dx);
        var ax = Math.round(Math.cos(angle));
        var ay = Math.round(Math.sin(angle));
        
        if (Math.random() > 0.5)
            sx = sx + ax;
        else
            sy = sy + ay;
          
        if (!tiles[sx][sy].door)
            tiles[sx][sy] = tiletemplates[pathtile];
    }
}

function generate_objects(arr) {
    var objects = [];
    
    for (var i=0; i<5; i++) {
        objects.push(new MapObject());
    }
    
    return objects;
}
