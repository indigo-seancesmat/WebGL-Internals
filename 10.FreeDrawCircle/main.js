var utils = new WebGLUtils();
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = utils.getGLContext(canvas);

// Step1: Writing Shaders
var vertexShader = `#version 300 es
precision mediump float;
in vec2 position;
uniform float flipY;
void main () {
    gl_Position = vec4(position.x, position.y * flipY, 0.0, 1.0);
    gl_PointSize = 10.0;
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

var getCircleCoordinates = (centerX, centerY, radiusX) => {
  var numOfPoints = 300;
  var circleCoords = [];
  var radiusY = (radiusX / gl.canvas.height) * gl.canvas.width;
  for (var i = 0; i < numOfPoints; i++) {
    // 2*Math.PI*r
    var circumference = 2 * Math.PI * (i / numOfPoints);
    var x = centerX + radiusX * Math.cos(circumference);
    var y = centerY + radiusY * Math.sin(circumference);
    circleCoords.push(x, y);
  }
  return circleCoords;
};

initializeEvents(gl, (startX, startY, endX, endY) => {
  // Step3: Creating Buffers
  var coordsObj = {
    startX,
    startY,
    endX,
    endY,
  };
  var v = utils.getGPUCoords(coordsObj);
  // -1.0 -> 1.0 --> 0.0 -> 2.0 -- to get the center point
  var v0to2 = utils.getGPUCoords0To2(v);
  var centerX = v.startX + (v0to2.endX - v0to2.startX) / 2;
  var centerY = v.startY + (v0to2.endY - v0to2.startY) / 2;
  var radiusX = (v0to2.endX - v0to2.startX) / 2;
  var vertices = getCircleCoordinates(centerX, centerY, radiusX);
  console.log(vertices);
  var data = new Float32Array(vertices);
  var buffer = utils.createAndBindBuffer(
    gl,
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW,
    data
  );

  // Step4: Linking CPU & GPU
  gl.useProgram(program);
  utils.linkGPUAndCPU(gl, {
    program: program,
    gpuVariable: "position",
    buffer: buffer,
    dims: 2,
  });
  var flipY = gl.getUniformLocation(program, "flipY");
  gl.uniform1f(flipY, -1.0);

  var inputColor = gl.getUniformLocation(program, "inputColor");
  gl.uniform3fv(inputColor, [0.1, 0.2, 0.3]);

  // Step5: Render the rectangle
  gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
});