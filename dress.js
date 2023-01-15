const bgcolor = "#e0d1bc";
let bgImage = null;
let lastX = null, lastY = null;
let labels = null;
let table = null;
let points = [];
let test_table = null;
let test_points = [];

function preload() {
  bgImage = loadImage('human3m_example1.jpg');
  labels = loadStrings('all_change_create_human_train_filtered.tsv');
  table = loadTable('create_change_human_train2_1_train2_patch2_points_train.csv', 'csv');
  test_labels = loadStrings('all_change_create_human_artai_filtered.tsv');
  test_table = loadTable('create_change_human_train2_1_train3_patch1_points_test.csv', 'csv');
}

function setup() {
  let canvas = createCanvas(960, 674);
  canvas.parent('canvasContainer');
  frameRate(60);

  let min_x = -3.4;
  let max_x = 12.97;
  let min_y = -5.7;
  let max_y = 12.9;

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

  num_rows = test_table.getRowCount();
  for(let i=0; i<num_rows; i++) {
    let x = float(test_table.getString(i, 0));
    let y = float(test_table.getString(i, 1));
    // map to screen space
    let scaled_x = map(x, min_x, max_x, 0, 1);
    let scaled_y = map(y, min_y, max_y, 0, 1);
    let cx = map(scaled_x, 0, 1, 0.116*width, (1.0-0.116)*width)
    let cy = map(scaled_y, 1, 0, 0.14*height, (1.0-0.14)*height)
    test_points.push([cx, cy]);
  }
}

function draw() {
  background(bgcolor);
  image(bgImage, 0, 0, width, height);

  let closest_ix = null;
  let closest_dist = null;
  noStroke();
  // fill(220, 240, 50);
  fill(232, 0, 50);

  let cur_labels = test_labels;
  let cur_points = test_points;
  let big_dot = true;

  if (mouseIsPressed) {
    cur_labels = labels;
    cur_points = points;
    big_dot = false;
  }

  let begin_index = 0;
  let end_index = cur_points.length;
  for(let ix=begin_index; ix<end_index; ix++) {
    const p = cur_points[ix];
    // ellipse(p[0], p[1], 1);
    let d = dist(mouseX, mouseY, p[0], p[1]);
    if (closest_dist == null || d < closest_dist) {
      closest_dist = d;
      closest_ix = ix;
    }
    if(big_dot) {
      ellipse(p[0], p[1], 6);
    }
    else {
      ellipse(p[0], p[1], 2);
    }
  }

  fill(232, 0, 50);
  const p = cur_points[closest_ix];
  ellipse(p[0], p[1], 15);

  fill(255, 255, 255, 150);
  rect(width/2+80, 10, width/2-100, 160)

  fill(0, 0, 0);
  textSize(16);
  text(cur_labels[closest_ix], width/2+90, 30, width/2-110, height-50);
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