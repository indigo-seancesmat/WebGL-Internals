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
    gl.bindBuffer(obj.channel || gl.ARRAY_BUFFER, obj.buffer); // need to bind again since we bound to null above
    gl.vertexAttribPointer(
      position,
      obj.dims,
      obj.dataType || gl.FLOAT,
      obj.normalize || gl.FALSE,
      obj.stride || 0,
      obj.offset || 0
    ); // 2 because vec 2 above
    return position;
  };
  getGPUCoords = (obj) => {
    // -1.0 -> 1.0 -> 0.0->1.0
    // 0.0->1.0 -> 0.0->2.0
    // 1.0 -> -1.0->1.0
    return {
      startX: -1.0 + (obj.startX / gl.canvas.width) * 2,
      startY: -1.0 + (obj.startY / gl.canvas.height) * 2,
      endX: -1.0 + (obj.endX / gl.canvas.width) * 2,
      endY: -1.0 + (obj.endY / gl.canvas.height) * 2,
    };
  };
  getTextureColor = (obj) => {
    return {
      red: obj.startX / gl.canvas.width,
      green: obj.startY / gl.canvas.height,
      blue: obj.endX / gl.canvas.width,
      alpha: obj.endY / gl.canvas.height,
    };
  };
}
