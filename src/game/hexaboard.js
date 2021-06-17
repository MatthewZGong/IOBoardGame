
class Hex{
    static directions =[ new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)]
    constructor(q,r,s){
        this.vector = [q,r,s];
    }
    constructor(q,r){
        this.vector = [q,r,-q-r];
    }
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
        return this.add(direction[d])
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
}
class Point{
    constructor(x,y){
        this.x = x; 
        this.y = y
    }s
}

class Map{ 
    constructor(){
        this.m = new Set() 
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
            var r1 = Math.max(-radius, -q - adius);
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