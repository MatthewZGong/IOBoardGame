
class Hex{
    static directions =[ new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)]
    constructor(q,r,s = -q-r){
        this.vector = [q,r,s];
        this.object = null; 
    }
    setCharacter(character){
        this.character = character
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
        const or = this.orientation
        const size = this.size
        const origin = this.origin
        const vec = hex.vector
        const x = (or.f0 * vec[0] + or.f1 * vec[1]) * size.x;
        const y = (or.f2 * vec[0] + or.f3 * vec[1]) * size.y;
        return new Point(x + origin.x ,y+ origin.y)
    }

    pixelToHex(p) {
        var or = this.orientation;
        var size = this.size;
        var origin = this.origin;
        var pt = new Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
        var q = or.b0 * pt.x + or.b1 * pt.y;
        var r = or.b2 * pt.x + or.b3 * pt.y;
        return new Hex(q, r, -q - r);
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

class MapClient{
    constructor(){
        this.m = new Set() 
        var or = new Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
        this.layout = new Layout(or, new Point(50, 50), new Point(400, 400));
    }
    parallelogram(width,length){

        for(var q = -(width>>1); q < width>>1; q++){
            for(let r = -(length>>1); r< length>>1; r++){
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
    rectangle(map_width, map_height){
        for (var r = -(map_height>>1); r < map_height>>1; r++) {
            var r_offset = r >> 1;  // or r>>1
            for (var q = -r_offset-(map_width>>1); q < (map_width>>1) - r_offset; q++) {
                this.m.add(new Hex(q, r, -q-r));
            }
        }
    }
    hexToPixel(hex){
        return this.layout.hexToPixel(hex); 
    }
    pixelToHex(point){
        return this.layout.pixelToHex(point);
    }
    *[Symbol.iterator]() {
        for(let hexa of this.m){
            yield hexa
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


function HexagonMap(radius) {
    let map = new MapClient();
    map.hexagon(radius);
    return map
}

function ParallelogramMap(width, length) {
    let map = new MapClient();
    map.parallelogram(width, length);
    return map;
}


export {MapClient, Layout, Orientation, Point, HexagonMap, ParallelogramMap}