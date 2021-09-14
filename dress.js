const bgcolor = "#e0d1bc";
let bgImage = null;
let lastX = null, lastY = null;

function preload() {
  bgImage = loadImage('hips.png');
}

function setup() {
  let canvas = createCanvas(960, 960);
  canvas.parent('canvasContainer');
  frameRate(60);
  do_clear();
}

function do_clear() {
  background(bgcolor);
  image(bgImage, 0, 0);
}

function mousePressed() {
  lastX = mouseX;
  lastY = mouseY;
  return false;
}

function draw() {
  if (mouseIsPressed) {
    let radius = 4 * (Math.abs(lastX - mouseX) + Math.abs(lastY - mouseY));
    ellipse(mouseX, mouseY, radius);
    ellipse((width-mouseX), mouseY, radius);
    lastX = mouseX;
    lastY = mouseY;
  }
}

function keyTyped() {
  if (key == ' ') {
    do_clear();
    return false;
  }
  if (key == 's') {
    saveImage();
    return false;
  }  
}