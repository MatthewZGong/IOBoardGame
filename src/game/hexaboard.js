
class Hex{
    static directions =[ new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)]
    constructor(q,r,s = -q-r){
        this.vector = [q,r,s];
    }
    // constructor(q,r){
    //     this.vector = [q,r,-q-r];
    // }
    equals(otherHex){
        return this.vector == otherHex.vector;
    }  
    add(otherhex){
        return new Hex(this.vector[0]+otherhex.vector[0], this.vector[1]+otherhex.vector[1],this.vector[2]+otherhex.vector[2] );
    }
    subtract(otherhex){
        return new Hex(this.vector[0]-otherhex.vector[0], this.vector[1]-otherhex.vector[1],this.vector[2]-otherhex.vector[2] );
    }
    multiply(factor){
        return new Hex(this.vector[0]*factor, this.vector[1]*factor,this.vector[2]*factor );
    }
    length(v){
        return ( Math.abs(this.vector[0]) + Math.abs(this.vector[1])+Math.abs(this.vector[2]) ) /2 ;
    }
    distance(otherhex){
        return this.subtract(otherhex).length()
    }
    neighbor(d){
        d = (6 + (d % 6)) % 6
        return this.add(this.direction[d])
    }
    toString(){
        return this.vector.toString()
    }
    round(){
        var qi = Math.round(this.vector[0]);
        var ri = Math.round(this.vector[1]);
        var si = Math.round(this.vector[2]);
        var q_diff = Math.abs(qi - this.vector[0]);
        var r_diff = Math.abs(ri - this.vector[1]);
        var s_diff = Math.abs(si - this.vector[2]);
        if (q_diff > r_diff && q_diff > s_diff) {
            qi = -ri - si;
        }
        else if (r_diff > s_diff) {
            ri = -qi - si;
        }
        else {
            si = -qi - ri;
        }
        return new Hex(qi, ri, si);
    }
}
class Layout{
    
    constructor(orientation, size, origin){
        this.size = size 
        this.origin = origin 
        this.orientation = orientation
    }

    hexToPixel(hex){
        var or = this.orientation 
        // console.log(or)
        var size = this.size
        // console.log(size)
        var origin = this.origin 
        // console.log(origin)
        var vec = hex.vector
        var x = (or.f0 * vec[0] + or.f1 * vec[1]) * size.x;
        var y = (or.f2 * vec[0] + or.f3 * vec[1]) * size.y;
        // console.log("done")
        return new Point(x + origin.x ,y+ origin.y)
    }
    hexCornerOffset(corner) {
        var or = this.orientation;
        var size = this.size;
        var angle = 2.0 * Math.PI * (or.start_angle - corner) / 6.0;
        return new Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
    }
    getPolygonCorners(hex){
        var corners = [] 
        var center = this.hexToPixel(hex)
        for (var i = 0; i < 6; i++) {
            var offset = this.hexCornerOffset(i);
            corners.push(new Point(center.x + offset.x, center.y + offset.y));
        }
        return corners;
        
    }
}
class Point{
    constructor(x,y){
        this.x = x; 
        this.y = y
    }
}

class Map{ 
    constructor(){
        this.m = new Set() 
        var or = new Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
        this.layout = new Layout(or, new Point(50,50), new Point(400,300));
    }
    parallelogram(width,length){
        for(var q = 0; q < width; q++){
            for(let r = 0; r< length; r++){
                this.m.add(new Hex(q,r))
            }
        }
    }
    hexagon(radius){
        for (var q = -radius; q <= radius; q++) {
            var r1 = Math.max(-radius, -q - radius);
            var r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                this.m.add(new Hex(q, r, -q-r));
            }
        }
    }
}

class Orientation {
    constructor(f0, f1, f2, f3, b0, b1, b2, b3, start_angle) {
        this.f0 = f0;
        this.f1 = f1;
        this.f2 = f2;
        this.f3 = f3;
        this.b0 = b0;
        this.b1 = b1;
        this.b2 = b2;
        this.b3 = b3;
        this.start_angle = start_angle;
    }
}

var flat_top = new Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);
var pointy_top = new Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
var test_map = new Map(); 
var test = new Layout(flat_top, new Point(50,50), new Point(400,300));
test_map.hexagon(5)
test_map.m.forEach((value) => { 
    console.log(test.hexToPixel(value) )
})

// var test_hex = new Hex(0,0);
// console.log(test_hex)
// console.log( test.getPolygonCorners(test_hex));
// console.log( test.hexToPixel(test_hex));s


export{Map as default}