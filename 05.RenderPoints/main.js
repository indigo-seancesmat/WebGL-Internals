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
    gl_PointSize = 10.0;
}`;
var fragmentShader = `#version 300 es
precision mediump float;
out vec4 color;
void main () {
    color = vec4(0.2, 0.8, 0.5, 1.0);
}`;

// Step2: Create Program
var program = utils.getProgram(gl, vertexShader, fragmentShader);

// Step3: Creating Buffers
var vertices = [-0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5];
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
  buffer: buffer,
  dims: 2,
});

// Step5: Render the rectangle
gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
