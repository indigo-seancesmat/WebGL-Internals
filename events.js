var initializeEvents = (gl, methodName, method2) => {
  var canvas = gl.canvas;
  var isDown = false;
  var startX, startY, endX, endY;
  canvas.addEventListener("mouseup", (e) => {
    isDown = false;
    endX = e.offsetX;
    endY = e.offsetY;
    method2(startX, startY, endX, endY);
  });
  canvas.addEventListener("mousedown", (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isDown = true;
  });
  canvas.addEventListener("mousemove", (e) => {
    if (isDown) {
      // dragging
      endX = e.offsetX;
      endY = e.offsetY;
      methodName(startX, startY, endX, endY);
    }
  });
};
