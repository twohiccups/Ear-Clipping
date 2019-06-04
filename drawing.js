var ns = 'http://www.w3.org/2000/svg';
var canvas = document.getElementById('triangulation');
var button = document.getElementById('button');
var labels = [];
var pt = canvas.createSVGPoint();
var boundingBox = canvas.getBoundingClientRect();


function resizing() {
    pt = canvas.createSVGPoint();
    boundingBox = canvas.getBoundingClientRect();
}

window.onresize = resizing;



// Get point in global SVG space
function cursorPoint(evt) {
  pt.x = evt.clientX - boundingBox.left;
  pt.y = evt.clientY - boundingBox.top;
  return pt.matrixTransform(canvas.getScreenCTM().inverse());
}

canvas.addEventListener('click',function(evt){
  var loc = cursorPoint(evt);
  // Use loc.x and loc.y here
},false);

canvas.addEventListener('click', function(e) {
    points.push(createPoint(pt.x, pt.y));
    if (points.length > 1) {
        connectPoints(points[points.length-1], points[points.length-2]);
    }
});

button.addEventListener('click', function() {
    if (points.length > 2) {
        connectPoints(points[points.length-1], points[0]);
        triangulate(points);
    }
    else {
        alert('Needs at least three points');
    }
});


function labelPoints(points) {
        for(var i = 0; i < points.length; i++) {
            var textNode = document.createElementNS(ns, 'text');
            textNode.setAttributeNS(null, 'x', points[i].x + 10);
            textNode.setAttributeNS(null, 'y', points[i].y + 10);
            textNode.setAttributeNS(null, 'fill', 'red');
            textNode.setAttributeNS(null, 'family', 'sans-serif');
            textNode.setAttributeNS(null, 'font-size', '20px');
            var text = document.createTextNode(i);
            textNode.appendChild(text);
            canvas.appendChild(textNode);
            labels.push(textNode);
            points[i].id = i;
        }
}

function toggleLables() {
    if (labels == []) return;
    var fill;
    if (labels[0].getAttribute('fill') == 'red') {
        fill = 'transparent';
    }
    else {
        fill = 'red';
    }
    for (var i = 0; i < labels.length; i++) {
        labels[i].setAttributeNS(null, 'fill', fill); 
    }
}

function connectPoints(a, b) {
    var line = document.createElementNS(ns, 'line');
    line.setAttributeNS(null, 'x1', a.x);
    line.setAttributeNS(null, 'y1', a.y);
    line.setAttributeNS(null, 'x2', b.x);
    line.setAttributeNS(null, 'y2', b.y);
    line.setAttributeNS(null, 'stroke', 'black'); 
    canvas.appendChild(line);
    return line;
}

function drawTriangle(triangle) {
    var polygon = document.createElementNS(ns, 'polygon');
    polygon.setAttributeNS(null, 'points', triangle.a.x + ','+ triangle.a.y + ' ' +
                                           triangle.b.x +',' + triangle.b.y + ' ' +
                                           triangle.c.x +',' + triangle.c.y);
    polygon.setAttributeNS(null, 'fill', getRandomColor()); 
    polygon.setAttributeNS(null, 'stroke', 'black'); 
    canvas.insertBefore(polygon, canvas.childNodes[0]);
    return polygon;
}

function getRandomColor() {
  var letters = 'BCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 5)];
  }
  return color;
}

function drawTriangles(triangles) {
    function setDelay(i) {
        setTimeout(function(){
            drawTriangle(triangles[i]);
        }, i * 1000);
    }   
    for (var i = 0; i < triangles.length; i++) {
        setDelay(i); 
    } 
}

function clearCanvas() {
     canvas.innerHTML = '';
}
