class WebGLUtils {
  getGLContext = (canvas) => {
    var gl = canvas.getContext("webgl2");

    // 0.0 -> 1.0 for color values r,g,b,a
    gl.clearColor(0.1, 0.2, 0.3, 1.0);
    // gl.DEPTH_BUFFERBIT = 1 -> 256 (8bit) & gl.COLOR_BUFFER_BIT = 1 -> 16384 (16bit)
    gl.clear(gl.DEPTH_BUFFERBIT | gl.COLOR_BUFFER_BIT);

    return gl;
  };
  getShader = (gl, shaderSource, shaderType) => {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource); // shader, source
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
  };
  getProgram = (gl, vertexShaderSource, fragmentShaderSource) => {
    var vs = this.getShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    var fs = this.getShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.COMPILE_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }
    return program;
  };
  createAndBindBuffer = (gl, bufferType, typeOfDrawing, data) => {
    var buffer = gl.createBuffer();
    gl.bindBuffer(bufferType, buffer); // target, buffer
    gl.bufferData(bufferType, data, typeOfDrawing); // target, size, srcData Optional, usage, srcOffset, length Optional
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // good practice to include this binding to null
    return buffer;
  };
  linkGPUAndCPU = (gl, obj) => {
    var position = gl.getAttribLocation(obj.program, obj.gpuVariable);
    gl.enableVertexAttribArray(position);
    gl.bindBuffer(obj.channel, obj.buffer); // need to bind again since we bound to null above
    gl.vertexAttribPointer(
      position,
      obj.dims,
      obj.dataType,
      obj.normalize,
      obj.stride,
      obj.offset
    ); // 2 because vec 2 above
    return position;
  };
}