class Queue {
    constructor() {
        this.list = [];
    }

    add(item) {
        this.list.push(item);
    }

    tick() {
        //filter out tasks to be removed
        this.list = this.list.filter(function(item) {
            return !item.remove;
        });

        //sort tasks from highest to lowest CT
        this.list.sort(function(a, b) {
            return b.CT - a.CT;
        });

        //get task with highest CT over 100
        var activeItem = this.list.find(function(item) {
            return item.CT >= 100;
        });

        //if task found, return it
        if (activeItem) {
            return activeItem;
        }

        //all queued items increase CT
        this.list.forEach(function(item) {
            item.tick();
        });

        //sort tasks from highest to lowest CT
        this.list.sort(function(a, b) {
            return b.CT - a.CT;
        });

        //return next active item or null
        return this.list.find(function(item) {
            return item.CT >= 100;
        });
    }

    draw(ctx) {
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font = "16px Arial";
        this.list.forEach(function(item, i) {
            ctx.fillText(item.toString(), 480, i * 16);
        });
    }

}