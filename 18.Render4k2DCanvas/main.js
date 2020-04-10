var utils = new WebGLUtils();
var canvas = document.getElementById("canvas");
var imageData, ctx;
var ctx;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// var gl = utils.getGLContext(canvas);
// gl.clearColor(0.0, 0.0, 0.0, 1.0);
// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// // Step1: Writing Shaders
// var vertexShader = `#version 300 es
// precision mediump float;
// in vec2 position; // vertices: WebGl vertex coords
// in vec2 texCoords; // Texture coordinates;
// out vec2 textureCoords; // Take input from vertex shader and serve to fragment shader
// void main () {
//     gl_Position = vec4(position.x, position.y * -1.0, 0.0, 1.0);
//     textureCoords = texCoords;
// }`;
// var fragmentShader = `#version 300 es
// precision mediump float;
// in vec2 textureCoords;
// uniform sampler2D uImage, uElephant;
// uniform float activeIndex;
// out vec4 color;
// void main () {
//     vec4 tex1 = texture(uImage, textureCoords);
//     color = tex1;
// }`;

// // Step2: Create Program
// var program = utils.getProgram(gl, vertexShader, fragmentShader);

var image = new Image();
image.src = "../4kBeach.jpg";
image.onload = () => {
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.style.height = window.innerHeight * 0.75 + "px";

  ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

var grayscale = document.getElementById("grayscale");
var inverse = document.getElementById("inverse");
var reset = document.getElementById("reset");

grayscale.onclick = () => {
  var v1 = performance.now();
  var data = imageData.data;
  for (var i = 0; i < data.byteLength; i = i + 4) {
    var newPixelVal = data[i] * 0.59 + data[i + 1] * 0.3 + data[i + 2] * 0.11;
    data[i] = data[i + 1] = data[i + 2] = newPixelVal;
    data[i + 3] = 255;
  }
  var v2 = performance.now();
  ctx.putImageData(imageData, 0, 0);
  console.log("grayscale: ", v2 - v1);
};
inverse.onclick = () => {
  var v1 = performance.now();
  var data = imageData.data;
  for (var i = 0; i < data.byteLength; i = i + 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
    data[i + 3] = 255;
  }
  var v2 = performance.now();
  ctx.putImageData(imageData, 0, 0);
  console.log("inverse: ", v2 - v1);
};
reset.onclick = () => {
  ctx.drawImage(image, 0, 0);
};
