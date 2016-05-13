function getDistance(x1:number,y1:number,x2:number,y2:number) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx*dx + dy*dy);
}

function getAngle(x1:number,y1:number,x2:number,y2:number) {
    return Math.atan2(y2-y1, x2-x1);   
}