let bgImage = null;
const bgColor = "#33362f";
let cur_zoom = 0;
let birthday = 0;
let millis_per_step = 15000;
let test_labels = null;
let test_table = null;

function preload() {
  bgImage = loadImage('human3m_full_8m.jpg');
  font = loadFont('Avenir_Book.ttf');
  train_labels = loadStrings('all_change_create_human_train_filtered.tsv');
  train_table = loadTable('create_change_human_train2_1_train2_patch2_points_train.csv', 'csv');
  test_labels = loadStrings('all_change_create_human_artai_filtered.tsv');
  test_table = loadTable('create_change_human_train2_1_train3_patch1_points_test.csv', 'csv');
}

let tour = [
  [500, 500, 0],
  [500, 500, 1],
  [187, 591, 1.5],
  [414, 218, 1.5],
  [737, 620, 1.5]
];

let main_words = {
  "HUMAN": [187, 591],
  "CREATE": [414, 218],
  "CHANGE": [737, 520]
};

let test_words = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  birthday = millis();

  let min_x = -5.8;
  let max_x = 15.67;
  let min_y = -9.7;
  let max_y = 16.7;

  let num_rows = test_table.getRowCount();
  for(let i=0; i<num_rows; i++) {
    let x = float(test_table.getString(i, 0));
    let y = float(test_table.getString(i, 1));
    let city_string = test_labels[i];
    // map to screen space
    let scaled_x = map(x, min_x, max_x, 0, 1000);
    let scaled_y = map(y, min_y, max_y, 1000, 0);
    test_words[city_string] = [scaled_x, scaled_y];

    if(i==0 || i==20) {
      tour.push([scaled_x, scaled_y, 2.0]);
      tour.push([scaled_x, scaled_y, 3.0]);
      tour.push([scaled_x, scaled_y, 2.0]);
    }
  }
}

// acuSerpf copied almost verbatium from acu :-)
function acuSerpf(t, a, b) {
  let factor;
  if(t<0.5) factor = 2.0 * t * t;
  else factor = 1 - 2.0 * (1.0 - t) * (1.0 - t);
  return (a + factor * (b - a));
}

let zoom_1_words = {
  "human rights": [330, 560],
  "human trafficing": [162, 415],
  "biological": [75, 540],
  "to be": [151, 819],
  "human being": [217, 700],
  "create an artwork": [347, 298],
  "create a problem": [478, 150],
  "create a named place": [510, 385],
  "change the subject": [655, 460],
  "change clothes": [652, 545],
  "don't change a thing": [751, 366],
  "climate change": [903, 650],
  '"this change"': [657, 743],
  "name change": [650, 820],
};

let zoom_2_words = {
  "human services": [231, 420],
  "human resources": [225, 482],
  "human trait": [203, 620],
  "human biology": [135, 652],
  "human form": [87, 676],
  "a human": [124, 758],
  "create an element": [345, 200],
  "a change from": [822, 820],
  "change a name": [786, 545],
};

function get_tour_location() {
  let age = millis() - birthday;
  let steps = age / millis_per_step;
  let num_tour_steps = tour.length;
  let cur_step = int(steps % num_tour_steps);
  let next_step = int((steps + 1) % num_tour_steps);

  let cur_tour_point = tour[cur_step];
  let next_tour_point = tour[next_step];
  let tour_step_frac = steps - int(steps);
  let eased_steps = acuSerpf(tour_step_frac, 0, 1);

  let cur_location = [0, 0, 0];
  for(let i=0; i<3; i++) {
    cur_location[i] = lerp(cur_tour_point[i], next_tour_point[i], eased_steps);
  }
  return cur_location;
}

function render_words(words, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height) {
  textAlign(CENTER);
  for (const key in words) {
    let coords = words[key];
    let im_x = map(coords[0], 0, 1000, 0, bgImage.width);
    let im_y = map(coords[1], 0, 1000, 0, bgImage.height);
    if (im_x+100 > source_startx && im_x-100 < source_startx + source_width &&
        im_y+100 > source_starty && im_y-100 < source_starty + source_height) {
      let hx = map(im_x, source_startx, source_startx + source_width, dx, dx+dWidth);
      let hy = map(im_y, source_starty, source_starty + source_height, dy, dy+dHeight);
      text(key, hx, hy);
    }
  }  
}

function render_words_paragraph(words, word_size, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height) {
  textWrap(WORD);
  textAlign(LEFT);
  for (const key in words) {
    let coords = words[key];
    let im_x = map(coords[0], 0, 1000, 0, bgImage.width);
    let im_y = map(coords[1], 0, 1000, 0, bgImage.height);
    if (im_x+100 > source_startx && im_x-100 < source_startx + source_width &&
        im_y+100 > source_starty && im_y-100 < source_starty + source_height) {
      let hx = map(im_x, source_startx, source_startx + source_width, dx, dx+dWidth);
      let hy = map(im_y, source_starty, source_starty + source_height, dy, dy+dHeight);
      fill(0,0,0,100);
      rect(hx-100, hy-100, 1000, word_size*13);
      fill(255);
      text(key, hx, hy, 800);
    }
  }  
}

function render_ellipses(words, dot_size, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height) {
  for (const key in words) {
    let coords = words[key];
    let im_x = map(coords[0], 0, 1000, 0, bgImage.width);
    let im_y = map(coords[1], 0, 1000, 0, bgImage.height);
    if (im_x+100 > source_startx && im_x-100 < source_startx + source_width &&
        im_y+100 > source_starty && im_y-100 < source_starty + source_height) {
      let hx = map(im_x, source_startx, source_startx + source_width, dx, dx+dWidth);
      let hy = map(im_y, source_starty, source_starty + source_height, dy, dy+dHeight);
      ellipse(hx, hy, dot_size);
      // text(key, hx, hy);
    }
  }  
}

function draw() {
  let cur_location = get_tour_location();
  // print(cur_location);

  background(bgColor);

  // compute the size of the "source" rectangle based on the zoom
  let cur_zoom = cur_location[2];
  let zoom_divisor = pow(2, cur_zoom);

  let source_locy = int(bgImage.height * cur_location[1]/1000);
  let source_height = int(bgImage.height / zoom_divisor);
  let source_starty = int(source_locy - (source_height / 2));

  let source_locx = int(bgImage.width * cur_location[0]/1000);
  let source_width = int(source_height * (width/height));
  let source_startx = int(source_locx - (source_width / 2))

  let dx = 0;
  let dy = 0;
  let dWidth = width;
  let dHeight = height;

  // print(dy, dHeight, source_starty, source_width);

  /* DEBUG ME
  if (source_starty < 0) {
    print("Y<0");
    let clip_fraction = (0 - source_starty) / source_height;
    let remain_fraction = 1.0 - clip_fraction;
    source_starty = 0;
    source_height = map(remain_fraction, 0, 1, 0, source_height);
    dy = map(clip_fraction, 0, 1, dy, dy+dHeight);
    dHeight = map(remain_fraction, 0, 1, 0, source_height);
  }

  if ((source_starty+source_height) > bgImage.height) {
    print("Y+H>H");
    let clip_fraction = ((source_starty+source_height) - bgImage.height) / source_height;
    let remain_fraction = 1.0 - clip_fraction;
    source_height = bgImage.height - source_starty;
    dHeight = map(remain_fraction, 0, 1, 0, source_height);
  }
  */

  if (source_startx < 0) {
    let clip_fraction = (0 - source_startx) / source_width;
    let remain_fraction = 1.0 - clip_fraction;
    // print("X<0", clip_fraction, remain_fraction);
    source_startx = 0;
    source_width = map(remain_fraction, 0, 1, 0, source_width);
    dx = map(clip_fraction, 0, 1, dx, dx+dWidth);
    dWidth = map(remain_fraction, 0, 1, 0, dWidth);
  }

  if ((source_startx+source_width) > bgImage.width) {
    let clip_fraction = ((source_startx+source_width) - bgImage.width) / source_width;
    let remain_fraction = 1.0 - clip_fraction;
    // print("X+W>W", clip_fraction, remain_fraction);
    source_width = bgImage.width - source_startx;
    dWidth = map(remain_fraction, 0, 1, 0, dWidth);
  }

  // print(source_locx, source_locy, source_width, source_height)

  image(bgImage, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height);

  // print(dx, dy, dWidth, dHeight);

  let age = millis() - birthday;
  if(age < 10000) {
    fill(200, 0, 0);
    ellipse(dx, dy, 30);
    ellipse(dx+dWidth, dy, 30);
    ellipse(dx, dy+dHeight, 30);
    ellipse(dx+dWidth, dy+dHeight, 30);    
  }  

  // height of image is height of screen, natural aspect is 0.7
  // let pixel_height = height;
  // let pixel_width = int((bgImage.width/bgImage.height) * height);
  // let bg_start_x = int((width-pixel_width)/2);
  // image(bgImage, bg_start_x, 0, pixel_width, pixel_height);

  fill('#ffffff');
  textFont(font);
  textAlign(CENTER);
  textStyle(BOLD);

  let full_text_size = int(0.04 * dHeight);
  let smaller_text_size = int(0.8 * full_text_size);
  let smallest_text_size = int(0.7 * full_text_size);
  let city_text_size = int(0.5 * full_text_size);

  textSize(smaller_text_size);
  if (cur_zoom >= 0.7) {
    if (cur_zoom < 0.8) {
      let word_size = map(cur_zoom, 0.7, 0.8, 1, smaller_text_size);
      textSize(word_size);
    }
    render_words(zoom_1_words, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height);
  }
  textSize(smallest_text_size);
  if (cur_zoom >= 1.4) {
    if (cur_zoom < 1.5) {
      let word_size = map(cur_zoom, 1.4, 1.5, 1, smallest_text_size);
      textSize(word_size);
    }
    render_words(zoom_2_words, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height);
  }

  if (cur_zoom >= 1.0) {
    fill(232, 0, 50);
    noStroke();
    let city_dot_size = int(0.01 * dHeight);
    if (cur_zoom < 1.1) {
      city_dot_size = map(cur_zoom, 1.0, 1.1, 1, city_dot_size);
    }
    render_ellipses(test_words, city_dot_size, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height);
  }

  fill('#ffffff');
  textSize(full_text_size);
  render_words(main_words, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height);

  if (cur_zoom >= 2.2) {
    let word_size = city_text_size;
    if (cur_zoom < 2.3) {
      word_size = map(cur_zoom, 2.2, 2.3, 1, city_text_size);
    }
    textSize(word_size);
    render_words_paragraph(test_words, word_size, dx, dy, dWidth, dHeight, source_startx, source_starty, source_width, source_height);
  }
}

function windowResized() {
  print("resize to", windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
}