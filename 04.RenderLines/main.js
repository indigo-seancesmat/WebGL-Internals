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
}`;
var fragmentShader = `#version 300 es
precision mediump float;
out vec4 color;
void main () {
    color = vec4(0.0, 1.0, 0.0, 1.0);
}`;

// Step2: Create Program
var program = utils.getProgram(gl, vertexShader, fragmentShader);

// Step3: Creating Buffers
var vertices = [-0.6, 0.6, 0.6, 0.6, -0.6, -0.6, 0.6, -0.6];
var data = new Float32Array(vertices);
var buffer = utils.createAndBindBuffer(
  gl,
  gl.ARRAY_BUFFER,
  gl.STATIC_DRAW,
  data
);

// Step4: Linking CPU & GPU
gl.useProgram(program);
var position = utils.linkGPUAndCPU(gl, {
  program: program,
  gpuVariable: "position",
  channel: gl.ARRAY_BUFFER,
  buffer: buffer,
  dims: 2,
  dataType: gl.FLOAT,
  normalize: gl.FALSE,
  stride: 0,
  offset: 0,
});

// Step5: Render the rectangle
gl.drawArrays(gl.LINES, 0, vertices.length / 2);
