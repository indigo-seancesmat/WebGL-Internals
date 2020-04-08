var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var gl = canvas.getContext("webgl2");
// 0.0 -> 1.0 for color values
gl.clearColor(0.1, 0.2, 0.3, 1.0);
// gl.DEPTH_BUFFERBIT = 1 -> 256 (8bit) & gl.COLOR_BUFFER_BIT = 1 -> 16384 (16bit)
gl.clear(gl.DEPTH_BUFFERBIT | gl.COLOR_BUFFER_BIT);
console.log(gl);
