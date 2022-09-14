const bgcolor = "#e0d1bc";
let bgImage = null;
let lastX = null, lastY = null;
let labels = null;
let table = null;
let points = []

function preload() {
  bgImage = loadImage('human_complete9_3_test1_render7_preview_960.jpg');
  labels = loadStrings('human_complete_filtered_fixed_train.txt');
  table = loadTable('human_complete9_3_train1_points.csv', 'csv');
}

function setup() {
  let canvas = createCanvas(960, 674);
  canvas.parent('canvasContainer');
  frameRate(60);

  let min_x = 0.0;
  let max_x = 14.1;
  let min_y = -8.6;
  let max_y = 9.4;

  let num_rows = table.getRowCount();
  for(let i=0; i<num_rows; i++) {
    let x = float(table.getString(i, 0));
    let y = float(table.getString(i, 1));
    // map to screen space
    let scaled_x = map(x, min_x, max_x, 0, 1);
    let scaled_y = map(y, min_y, max_y, 0, 1);
    let cx = map(scaled_x, 0, 1, 0.116*width, (1.0-0.116)*width)
    let cy = map(scaled_y, 1, 0, 0.14*height, (1.0-0.14)*height)
    points.push([cx, cy]);
  }
}

function draw() {
  background(bgcolor);
  image(bgImage, 0, 0, width, height);

  let closest_ix = null;
  let closest_dist = null;
  noStroke();
  fill(0, 255, 0);
  for(let ix=0; ix<points.length; ix++) {
    const p = points[ix];
    // ellipse(p[0], p[1], 1);
    let d = dist(mouseX, mouseY, p[0], p[1]);
    if (closest_dist == null || d < closest_dist) {
      closest_dist = d;
      closest_ix = ix;
    }
    // ellipse(p[0], p[1], 2);
  }

  fill(255, 200, 0);
  const p = points[closest_ix];
  ellipse(p[0], p[1], 15);

  fill(0, 0, 0);
  textSize(20);
  text(labels[closest_ix], 50, 50, 3*width/4, height-50);
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