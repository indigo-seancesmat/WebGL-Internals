var utils = new WebGLUtils();
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = utils.getGLContext(canvas);

initializeEvents(gl);

// Step1: Writing Shaders
var vertexShader = `#version 300 es
precision mediump float;
in vec2 position;
uniform float flipY;
void main () {
    gl_Position = vec4(position.x, position.y * flipY, 0.0, 1.0);
}`;
var fragmentShader = `#version 300 es
precision mediump float;
out vec4 color;
void main () {
    color = vec4(0.2, 0.8, 0.5, 1.0);
}`;

// Step2: Create Program
var program = utils.getProgram(gl, vertexShader, fragmentShader);

// -1.0 -> 1.0 -> 0.0->1.0
// 0.0->1.0 -> 0.0->2.0
getGPUCoords = (obj) => {
  return {
    startX: -1.0 + (obj.startX / gl.canvas.width) * 2,
    startY: -1.0 + (obj.startY / gl.canvas.height) * 2,
    endX: -1.0 + (obj.endX / gl.canvas.width) * 2,
    endY: -1.0 + (obj.endY / gl.canvas.height) * 2,
  };
};

updateRectangle = () => {
  // Step3: Creating Buffers
  var v = getGPUCoords({ startX, startY, endX, endY });

  var vertices = [
    v.startX,
    v.startY,
    v.endX,
    v.startY,
    v.startX,
    v.endY,
    v.startX,
    v.endY,
    v.endX,
    v.endY,
    v.endX,
    v.startY,
  ];
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
  var position = utils.linkGPUAndCPU(gl, {
    program: program,
    gpuVariable: "position",
    buffer: buffer,
    dims: 2,
  });
  var location = gl.getUniformLocation(program, "flipY");
  gl.uniform1f(location, -1.0);

  // Step5: Render the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
};
