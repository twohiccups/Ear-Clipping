
var points = [];
const interval = 750;


// point with lowest y coordinate
// given collision, pick the one with smallest x
// in svg, coordinates are reversed

function Point(x, y, c) {
    this.x = x;
    this.y = y;
    this.c = c;
}


function distanceSq(a, b) {
    return (a.x-b.x) * (a.x-b.x) + (a.y-b.y) * (a.y-b.y); 
}

function angle(a, b, c) {
    var temp =  Math.atan2((c.y-b.y), (c.x-b.x)) - Math.atan2((a.y-b.y), (a.x-b.x));
    return temp < 0 ? Math.PI*2 + temp: temp;
}

function Triangle(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.area = function() {
        return (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y))/2;
    }
}




function measureAngles(points) {
    for (var i = 0; i < points.length+1; i++) {
        points[(i+1) % points.length].angle = angle(points[i% points.length],
                                  points[(i+1) % points.length],
                                  points[(i+2) % points.length]) * 180 / Math.PI;
    }
    
}

function isInsideTriangle(triangle, point) {
    var areaA, areaB, areaC;
    areaA = (new Triangle(triangle.a, triangle.b, point)).area();
    areaB = (new Triangle(triangle.b, triangle.c, point)).area();
    areaC = (new Triangle(triangle.c, triangle.a, point)).area();
    return  (Math.sign(areaA) == Math.sign(areaB) &&
             Math.sign(areaA) == Math.sign(areaC));
}


function triangulate(points) {

    if (points < 3) return;
    
     if (angle(points[0], points[1], points[2]) > Math.PI) {
          points.reverse();
      }
    
    var i = 1;
    var a,b,c;
    var triangles = [];
    
    labelPoints(points);
    measureAngles(points);
    while(points.length > 3) {
        a = points[i % points.length];
        b = points[(i+1) % points.length];
        c = points[(i+2) % points.length];
        
        if (angle(a,b,c) < Math.PI) {
            var tempTriangle = new Triangle(a, b, c);
            var isEar = true;
            for(var j = i+3; j < points.length + i + 3; j++) {
                if (isInsideTriangle(tempTriangle,points[j % points.length]))
                    isEar = false;
            }
            if (isEar) {
                points.splice((i+1) % points.length,1); // erase middle point
                triangles.push(tempTriangle);
            }
        }
        i++; 
        if (i > points.length * points.length * points.length) break;
    } 
    triangles.push(new Triangle(points[0], points[1], points[2]));
    setTimeout(function () {drawTriangles(triangles);}, interval);

}

function reset() {
    points = [];
    clearCanvas();
}





