var startX, startY, endX, endY;
var initializeEvents = (gl) => {
  var canvas = gl.canvas;
  var isDown = false;
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
      updateRectangle();
    }
  });
};
