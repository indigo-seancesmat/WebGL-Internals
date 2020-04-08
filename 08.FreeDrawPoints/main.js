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
uniform vec4 inputColor;
void main () {
    color = inputColor;
}`;

// Step2: Create Program
var program = utils.getProgram(gl, vertexShader, fragmentShader);

var vertices = [];
initializeEvents(gl, (startX, startY, endX, endY) => {
  // Step3: Creating Buffers
  var coordsObj = {
    startX,
    startY,
    endX,
    endY,
  };
  var v = utils.getGPUCoords(coordsObj);
  //   var color = utils.getTextureColor(coordsObj);
  vertices.push(v.startX, v.startY, v.endX, v.endY);
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
  gl.uniform4fv(inputColor, [Math.random(), Math.random(), Math.random(), 1.0]);

  // Step5: Render the rectangle
  gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
});
