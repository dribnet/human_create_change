const bgcolor = "#e0d1bc";

function setup() {
  let canvas = createCanvas(960, 960);
  canvas.parent('canvasContainer');
}

function draw() {
  background(bgcolor);
  ellipse(mouseX,mouseY,80,80);
}