const bgColor = "#33060f";

let cameraOffset;
let cameraZoom;
let bgImage;

// squares at X, Y of length N
let scene = [
  [187, 591, 10],
  [414, 218, 5],
  [737, 520, 2]
];

function preload() {
  bgImage = loadImage('human3m_full_8m.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cameraOffset = {x: 500, y: 500}
  cameraZoom = 0;
}

let isDragging = false
let lastDrag = { x: 0, y: 0 }
let dragScale = 0;

function touchStarted(event) {
  isDragging = true;
  lastDrag = {x:event.x, y: event.y};
  console.log("TS", lastDrag);
}

function dragAdjust(event) {
  let cx = event.x;
  let cy = event.y;
  let diffX = lastDrag.x - cx;
  let diffY = lastDrag.y - cy;
  if (diffX == 0 && diffY == 0) {
    return;
  }
  cameraOffset.x += diffX * stepsPerPixelX;
  cameraOffset.y += diffY * stepsPerPixelY;
  lastDrag = {x:cx, y: cy};  
}

function touchMoved(event) {
  dragAdjust(event);
}

function touchEnded(event) {
  dragAdjust(event);
  isDragging = false;
}

function mouseWheel(event) {
  cameraZoom = cameraZoom + (event.deltaY * 0.01);
  if (cameraZoom < 0) {
    cameraZoom = 0;
  }
  if (cameraZoom > 4.5) {
    cameraZoom = 4.5;
  }
  // cameraZoom = (cameraZoom + 1) * (event.deltaY * 0.1);
  print(cameraZoom);
  // console.log("Wheel", event);
}

let stepsPerPixelX, stepsPerPixelY;

function draw() {
  background(bgColor);

  let cur_zoom = cameraZoom;
  let zoom_divisor = pow(2, cur_zoom);

  let source_locy = bgImage.height * cameraOffset.y/1000;
  let source_height = bgImage.height / zoom_divisor;
  let source_starty = source_locy - (source_height / 2);

  let source_locx = bgImage.width * cameraOffset.x/1000;
  let source_width = source_height * (width/height);
  let source_startx = source_locx - (source_width / 2)

  let dx = 0;
  let dy = 0;
  let dWidth = width;
  let dHeight = height;

  image(bgImage, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height);

  stepsPerPixelX = source_width / (4 * dWidth);
  stepsPerPixelY = source_height / (4 * dHeight);

  fill(0);
}

function windowResized() {
  print("resize to", windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
  cameraOffset = {x: 500, y: 500}
}