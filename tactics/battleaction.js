class BattleAction_Attack {
    constructor(actor) {
        this.name = "Attack";
        this.actor = actor;
        this.spread = [[-1,0],[0,-1],[0,0],[1,0],[0,1]];
    }

    invoke(target) {
        console.log("invoked attack");
    }
}