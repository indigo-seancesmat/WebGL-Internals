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
in vec2 position; // vertices: WebGl vertex coords
in vec2 texCoords; // Texture coordinates;
out vec2 textureCoords; // Take input from vertex shader and serve to fragment shader
void main () {
    gl_Position = vec4(position, 0.0, 1.0);
    textureCoords = texCoords;
}`;
var fragmentShader = `#version 300 es
precision mediump float;
in vec2 textureCoords;
uniform sampler2D uImage, uElephant;
uniform float activeIndex;
out vec4 color;
void main () {
    if (activeIndex == 0.0) {
        color = texture(uImage, textureCoords);
    } else {
        color = texture(uElephant, textureCoords);
    }
}`;

// Step2: Create Program
var program = utils.getProgram(gl, vertexShader, fragmentShader);

// Step3
var vertices = utils.prepareRectVec2(-1.0, -1.0, 1.0, 1.0);
var textureCoordinates = utils.prepareRectVec2(0.0, 1.0, 1.0, 0.0);

var buffer = utils.createAndBindBuffer(
  gl,
  gl.ARRAY_BUFFER,
  gl.STATIC_DRAW,
  new Float32Array(vertices)
);
var texBuffer = utils.createAndBindBuffer(
  gl,
  gl.ARRAY_BUFFER,
  gl.STATIC_DRAW,
  new Float32Array(textureCoordinates)
);

var render1 = document.getElementById("render1");
var render2 = document.getElementById("render2");
gl.useProgram(program);
var activeIndex = gl.getUniformLocation(program, "activeIndex");

render1.onclick = () => {
  // course logo
  gl.uniform1f(activeIndex, 0.0);
  render(texture);
};

render2.onclick = () => {
  // elephant img
  gl.uniform1f(activeIndex, 1.0);
  render(elephantTexture);
};

var elephantTexture, texture;
var image = new Image();
var elephantImage = new Image();
elephantImage.src = "./elephant.jpeg";
elephantImage.onload = () => {
  elephantTexture = utils.createAndBindTexture(gl, elephantImage);
};
image.src = "./courselogo.jpeg";
image.onload = () => {
  texture = utils.createAndBindTexture(gl, image);
};

var render = (tex) => {
  //step4
  utils.linkGPUAndCPU(gl, {
    program: program,
    buffer: buffer,
    dims: 2,
    gpuVariable: "position",
  });
  utils.linkGPUAndCPU(gl, {
    program: program,
    buffer: texBuffer,
    dims: 2,
    gpuVariable: "texCoords",
  });

  gl.bindTexture(gl.TEXTURE_2D, tex);

  // Step5
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
};
