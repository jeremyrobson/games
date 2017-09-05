class Layer {
    constructor() {
        this.objects = [];
    }

    add(obj) {
        this.objects.push(obj);
    }

    update() {
        this.objects = this.objects.filter(function(obj) {
            obj.update();
            return !obj.remove;
        });
    }

    draw(ctx) {
        this.objects.forEach(function(obj) {
            obj.draw(ctx, 0, 0);
        });
    }
}