var utils = new WebGLUtils();
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = utils.getGLContext(canvas);

// Step1: Writing Shaders
var vertexShader = `#version 300 es
precision mediump float;
in vec2 position;
void main () {
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize - 1.0;
}`;
var fragmentShader = `#version 300 es
precision mediump float;
out vec4 color;
uniform vec3 inputColor;
void main () {
    color = vec4(inputColor, 1.0);
}`;

// Step2: Create Program
var program = utils.getProgram(gl, vertexShader, fragmentShader);

// Step3: Creating Buffers
var drawShape = (coords, color, drawingMode) => {
  var data = new Float32Array(coords);
  var buffer = utils.createAndBindBuffer(
    gl,
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW,
    data
  );

  // Step 4
  gl.useProgram(program);
  utils.linkGPUAndCPU(gl, {
    program: program,
    buffer: buffer,
    dims: 2,
    gpuVariable: "position",
  });
  var inputColor = gl.getUniformLocation(program, "inputColor");
  gl.uniform3fv(inputColor, color);

  // Step5: Render the rectangle
  gl.drawArrays(drawingMode, 0, coords.length / 2);
};

var getCircleCoordinates = (centerX, centerY, radiusX) => {
  var numOfPoints = 240;
  var numOfSpikes = 24;
  var factor = numOfPoints / numOfSpikes;
  var circleCoords = [];
  var spikesCoords = [];
  var radiusY = (radiusX / gl.canvas.height) * gl.canvas.width;
  for (var i = 0; i < numOfPoints; i++) {
    // 2*Math.PI*r
    var circumference = 2 * Math.PI * (i / numOfPoints);
    var x = centerX + radiusX * Math.cos(circumference);
    var y = centerY + radiusY * Math.sin(circumference);
    circleCoords.push(x, y);
    if ((i + 1) % factor === 0) {
      spikesCoords.push(centerX, centerY);
      spikesCoords.push(x, y);
    }
  }
  return {
    circleCoords,
    spikesCoords,
  };
};

var orangeColor = [1.0, 0.6, 0.2],
  whiteColor = [1.0, 1.0, 1.0],
  greenColor = [0.07, 0.6, 0.02],
  circleColor = [0.0, 0.0, 0.6];

var lineCoords = [-0.3, 0.7, -0.3, -0.9];
var lineColor = [0.0, 0.0, 0.0];

var orangeRectCoords = [
  -0.3,
  0.7,
  -0.3,
  0.4,
  0.4,
  0.7,
  -0.3,
  0.4,
  0.4,
  0.7,
  0.4,
  0.4,
];
var orangeRectColor = orangeColor;

var whiteRectCoords = [
  -0.3,
  0.4,
  -0.3,
  0.1,
  0.4,
  0.4,
  -0.3,
  0.1,
  0.4,
  0.1,
  0.4,
  0.4,
];
var whiteRectColor = whiteColor;

var greenRectCoords = [
  -0.3,
  0.1,
  -0.3,
  -0.2,
  0.4,
  0.1,
  -0.3,
  -0.2,
  0.4,
  -0.2,
  0.4,
  0.1,
];
var greenRectColor = greenColor;

var circleVertices = getCircleCoordinates(0.06, 0.25, 0.07);

drawShape(lineCoords, lineColor, gl.LINES);
drawShape(orangeRectCoords, orangeRectColor, gl.TRIANGLES);
drawShape(whiteRectCoords, whiteRectColor, gl.TRIANGLES);
drawShape(greenRectCoords, greenRectColor, gl.TRIANGLES);
drawShape(circleVertices.circleCoords, circleColor, gl.POINTS);
drawShape(circleVertices.spikesCoords, circleColor, gl.LINES);
