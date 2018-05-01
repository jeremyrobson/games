class MoveNode {
    constructor(x, y, parent, steps, occupied) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.steps = steps;
        this.occupied = occupied;
    }
}

class MoveTree {
    /**
     * Create a MoveTree
     * 
     * @param {number} width - The width of the map
     * @param {number} height - The height of the map
     * @param {array<Point>} objectList - An array of objects with x,y properties
     * @param {Point} startingPoint - The starting point of the tree
     * @param {number} stepLimit - The maximum number of steps allowed
     */
    constructor(width, height, objectList, startingPoint, stepLimit = 5) {
        this.width = width;
        this.height = height;
        this.list = [];
        this.blockedMap = this.getBlockedMap(objectList);
        
        this.addNode(new MoveNode(startingPoint.x, startingPoint.y, null, 0, startingPoint));
        
        var i=0;
        var xmove = [-1,0,1,0];
        var ymove = [0,-1,0,1];
        while (i < this.list.length) {
            var currentNode = this.list[i];
            
            if (currentNode.steps >= stepLimit) {
                i++;
                continue;
            }
            
            for (var j=0; j<4; j++) {
                var x = currentNode.x + xmove[j];
                var y = currentNode.y + ymove[j];
         
                if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                    continue;
                }
                
                var occupied = this.blockedMap[x][y];
         
                if (occupied && occupied.team !== startingPoint.team) {
                    continue;
                }
                
                this.addNode(new MoveNode(x, y, currentNode, currentNode.steps+1, occupied));
            }
            i++;
        }

    }
    
    addNode(moveNode) {
        this.list.push(moveNode);
        this.blockedMap[moveNode.x][moveNode.y] = 1;
    }
    
    getBlockedMap(objectList) {
        var blockedMap = [];
        for (var x=0; x<this.width; x++) {
            blockedMap[x] = [];
            for (var y=0; y<this.height; y++) {
                blockedMap[x][y] = 0;
            }
        }
        
        objectList.forEach(function(obj) {
            blockedMap[obj.x][obj.y] = obj;
        });
        
        return blockedMap;
    }
    
    getNodeMap() {
        var nodeMap = [];
        for (var x=0; x<this.width; x++) {
            nodeMap[x] = [];
            for (var y=0; y<this.height; y++) {
                nodeMap[x][y] = 0;
            }
        }
        this.list.forEach(function(node) {
            nodeMap[node.x][node.y] = node;
        });
        return nodeMap;
    }
    
    getNode(x, y) {
        var nodeMap = this.getNodeMap();
        if (nodeMap[x] && nodeMap[x][y]) {
            return nodeMap[x][y];
        }
        else {
            return null;
        }
    }
    
    getPath(x, y) {
        var path = [];
        var node = this.getNode(x, y);
        while (node && node.parent) {
            path.push(node);
            node = node.parent;
        }
        return path.reverse();
    }
}