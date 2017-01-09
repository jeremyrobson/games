var actions = {
    "Melee": {
        "range": 1,
        "animation": null,
        "fn": function(actor, target) {
            console.log("melee");
        }
    }
}

class GameAction {
    constructor(target, actionkey) {
        this.target = target;
        
        var action = actions[actionkey];
                
        this.range = action["range"];
        this.animation = action["animation"];
    }
    
    invoke(distance) {
        if (distance < this.range) {
            this.fn.call(this, this.target);
        }
    }
    
    loop() {
        
    }
    
    draw(ctx) {
        
    }
}