var utils = new WebGLUtils();
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = utils.getGLContext(canvas);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Step1: Writing Shaders
var vertexShader = `#version 300 es
precision mediump float;
in vec2 position;
void main () {
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 2.0;
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
var circleVertices = utils.getCircleCoordinates(0.0, 0.0, 0.3, 3000);
var buffer = utils.createAndBindBuffer(
  gl,
  gl.ARRAY_BUFFER,
  gl.STATIC_DRAW,
  new Float32Array(circleVertices)
);

var secondsVertices = utils.getCircleCoordinates(0.0, 0.0, 0.27, 60);
var pointsBuffer = utils.createAndBindBuffer(
  gl,
  gl.ARRAY_BUFFER,
  gl.STATIC_DRAW,
  new Float32Array(secondsVertices)
);

var secondsBuffer = utils.createAndBindBuffer(
  gl,
  gl.ARRAY_BUFFER,
  gl.STATIC_DRAW,
  new Float32Array(utils.getCircleCoordinates(0.0, 0.0, 0.27, 60, true))
);

var minutesBuffer = utils.createAndBindBuffer(
  gl,
  gl.ARRAY_BUFFER,
  gl.STATIC_DRAW,
  new Float32Array(utils.getCircleCoordinates(0.0, 0.0, 0.24, 60, true))
);

var hoursBuffer = utils.createAndBindBuffer(
  gl,
  gl.ARRAY_BUFFER,
  gl.STATIC_DRAW,
  new Float32Array(utils.getCircleCoordinates(0.0, 0.0, 0.18, 60, true))
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
gl.uniform3fv(inputColor, [0.2, 0.8, 0.5]);

// Step5: Render the rectangle
gl.drawArrays(gl.POINTS, 0, circleVertices.length / 2);

utils.linkGPUAndCPU(gl, {
  program: program,
  buffer: pointsBuffer,
  dims: 2,
  gpuVariable: "position",
});
gl.drawArrays(gl.POINTS, 0, secondsVertices.length / 2);

utils.linkGPUAndCPU(gl, {
  program: program,
  buffer: secondsBuffer,
  dims: 2,
  gpuVariable: "position",
});
utils.linkGPUAndCPU(gl, {
  program: program,
  buffer: minutesBuffer,
  dims: 2,
  gpuVariable: "position",
});
utils.linkGPUAndCPU(gl, {
  program: program,
  buffer: hoursBuffer,
  dims: 2,
  gpuVariable: "position",
});
gl.drawArrays(gl.LINES, 0, 120);
