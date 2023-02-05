const bgColor = "#33060f";

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bgColor);
}

function windowResized() {
  print("resize to", windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
}