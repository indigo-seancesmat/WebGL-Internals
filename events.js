var initializeEvents = (gl, methodName) => {
  var canvas = gl.canvas;
  var isDown = false;
  var startX, startY, endX, endY;
  canvas.addEventListener("mouseup", () => {
    isDown = false;
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
