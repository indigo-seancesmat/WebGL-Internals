var utils = new WebGLUtils();
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = utils.getGLContext(canvas);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

var kernels = {
  edgeEnhancement: [-1, -1, -1, -1, 5, -1, -1, -1, -1],
};

//Step1:
var vertexShader = `#version 300 es
precision mediump float;
in vec2 position;//vertices : WebGL vertex coordinates
in vec2 texCoords;// Texture coordinates
out vec2 textureCoords; //Take input from vertex shader and serve to fragment shader
void main () {
    gl_Position = vec4(position.x, position.y * -1.0, 0.0, 1.0);
    textureCoords = texCoords;
}
`;

var fragmentShader = `#version 300 es
precision mediump float;
in vec2 textureCoords;
uniform sampler2D uImage;
uniform float activeIndex, uKernel[9], kernelWeight;
out vec4 color;
uniform bool isGrayscale, isInverse, isKernel;
uniform vec2 pixelJumpFactor;
vec4 applyKernel () {
    ivec2 dims = textureSize(uImage, 0);
    vec2 pixelJumpFactor = 1.0/vec2(dims);
    vec4 values = 
    texture(uImage, textureCoords + pixelJumpFactor * vec2(-1,-1)) * uKernel[0] +
    texture(uImage, textureCoords + pixelJumpFactor * vec2(0,-1)) * uKernel[1] +
    texture(uImage, textureCoords + pixelJumpFactor * vec2(1,-1)) * uKernel[2] +
    texture(uImage, textureCoords + pixelJumpFactor * vec2(-1,0)) * uKernel[3] +
    texture(uImage, textureCoords + pixelJumpFactor * vec2(0,0)) * uKernel[4] +
    texture(uImage, textureCoords + pixelJumpFactor * vec2(1,0)) * uKernel[5] +
    texture(uImage, textureCoords + pixelJumpFactor * vec2(-1,1)) * uKernel[6] +
    texture(uImage, textureCoords + pixelJumpFactor * vec2(0,1)) * uKernel[7] +
    texture(uImage, textureCoords + pixelJumpFactor * vec2(1,1)) * uKernel[8];
    vec4 updatePixels = vec4(vec3((values/kernelWeight).rgb), 1.0);
    return updatePixels;
}
void main() {
    vec4 tex1 = texture(uImage, textureCoords);
    if(isGrayscale) {
        float newPixelVal = tex1.r * 0.59 + tex1.g* 0.3 + tex1.b * 0.11;
        tex1 = vec4(vec3(newPixelVal), 1.0);
    } else if(isInverse) {
        tex1 = vec4(vec3(1.0 - tex1.rgb), 1.0);
    } else if(isKernel) {
        tex1 = applyKernel();
    }
    color = tex1;
}
`;

//Step2
var program = utils.getProgram(gl, vertexShader, fragmentShader);
//Step3
var currSX = -1.0,
  currSY = -1.0,
  currEX = 1.0,
  currEY = 1.0;
var lastSX = -1.0,
  lastSY = -1.0,
  lastEX = 1.0,
  lastEY = 1.0;
var vertices = utils.prepareRectVec2(currSX, currSY, currEX, currEY);
var textureCoordinates = utils.prepareRectVec2(0.0, 0.0, 1.0, 1.0);

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

gl.useProgram(program);

var getCoords = () => {
  var obj = {
    startX: AR.x1,
    startY: AR.y1,
    endX: AR.x2,
    endY: AR.y2,
  };
  return utils.getGPUCoords(obj); //-1 to +1
};

var texture;
var image = new Image();
var AR = null;
image.src = "../4kBeach.jpg";
image.onload = () => {
  AR = utils.getAspectRatio(gl, image);
  var v = getCoords();
  vertices = utils.prepareRectVec2(v.startX, v.startY, v.endX, v.endY);
  buffer = utils.createAndBindBuffer(
    gl,
    gl.ARRAY_BUFFER,
    gl.STATIC_DRAW,
    new Float32Array(vertices)
  );
  texture = utils.createAndBindTexture(gl, image);
  render();
};
var uImage = gl.getUniformLocation(program, "uImage");
gl.uniform1i(uImage, 0);

var render = () => {
  //Step4
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
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  //Step5
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
};

var getDiff = (startX, startY, endX, endY) => {
  var obj = {
    startX: startX,
    startY: startY,
    endX: endX,
    endY,
  };
  var v = utils.getGPUCoords(obj); //-1 to +1
  v = utils.getGPUCoords0To2(v); //0 to 2
  var diffX = v.endX - v.startX;
  var diffY = v.endY - v.startY;
  return {
    x: diffX,
    y: diffY,
  };
};

initializeEvents(
  gl,
  (startX, startY, endX, endY) => {
    var diff = getDiff(startX, startY, endX, endY);
    currSX += diff.x;
    currSY += diff.y;
    currEX += diff.x;
    currEY += diff.y;
    vertices = utils.prepareRectVec2(currSX, currSY, currEX, currEY);
    buffer = utils.createAndBindBuffer(
      gl.ARRAY_BUFFER,
      gl.STATIC_DRAW,
      new Float32Array(vertices)
    );
    render();
    currSX = lastSX;
    currSY = lastSY;
    currEX = lastEX;
    currEY = lastEY;
  },
  (startX, startY, endX, endY) => {
    var diff = getDiff(startX, startY, endX, endY);
    lastSX += diff.x;
    lastSY += diff.y;
    lastEX += diff.x;
    lastEY += diff.y;
    currSX = lastSX;
    currSY = lastSY;
    currEX = lastEX;
    currEY = lastEY;
  },
  (deltaY) => {
    if (deltaY > 0) {
      //zoom out
      currSX -= currSX * 0.1;
      currEX -= currEX * 0.1;
      currSY -= currSY * 0.1;
      currEY -= currEY * 0.1;
    } else {
      //zoom in
      currSX += currSX * 0.1;
      currEX += currEX * 0.1;
      currSY += currSY * 0.1;
      currEY += currEY * 0.1;
    }
    vertices = utils.prepareRectVec2(currSX, currSY, currEX, currEY);
    buffer = utils.createAndBindBuffer(
      gl,
      gl.ARRAY_BUFFER,
      gl.STATIC_DRAW,
      new Float32Array(vertices)
    );
    render();
  }
);

var grayscale = document.getElementById("grayscale");
var inverse = document.getElementById("inverse");
var kernel = document.getElementById("kernel");
var reset = document.getElementById("reset");
var isGrayscale = gl.getUniformLocation(program, "isGrayscale");
var isInverse = gl.getUniformLocation(program, "isInverse");
var isKernel = gl.getUniformLocation(program, "isKernel");

grayscale.onclick = () => {
  var v1 = performance.now();
  gl.uniform1f(isInverse, 0.0);
  gl.uniform1f(isKernel, 0.0);
  gl.uniform1f(isGrayscale, 1.0);
  render();
  var v2 = performance.now();
  console.log("grayscale: ", v2 - v1);
};
inverse.onclick = () => {
  var v1 = performance.now();
  gl.uniform1f(isGrayscale, 0.0);
  gl.uniform1f(isKernel, 0.0);
  gl.uniform1f(isInverse, 1.0);
  render();
  var v2 = performance.now();
  console.log("inverse: ", v2 - v1);
};
kernel.onclick = () => {
  gl.uniform1f(isInverse, 0.0);
  gl.uniform1f(isGrayscale, 0.0);
  gl.uniform1f(isKernel, 1.0);
  var kernelWeight = gl.getUniformLocation(program, "kernelWeight");
  var ker = gl.getUniformLocation(program, "uKernel[0]");
  gl.uniform1f(
    kernelWeight,
    kernels.edgeEnhancement.reduce((a, b) => a + b)
  );
  gl.uniform1fv(ker, kernels.edgeEnhancement);
  render();
};
reset.onclick = () => {
  gl.uniform1f(isGrayscale, 0.0);
  gl.uniform1f(isInverse, 0.0);
  gl.uniform1f(isKernel, 0.0);
  render();
};
