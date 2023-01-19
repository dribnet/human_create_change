let bgImage = null;
const bgColor = "#33362f";
let cur_zoom = 0;
let birthday = 0;
let millis_per_step = 10000;

function preload() {
  bgImage = loadImage('human3m_full_8m.jpg');
  font = loadFont('Avenir_Book.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  birthday = millis();
}

// acuSerpf copied almost verbatium from acu :-)
function acuSerpf(t, a, b) {
  let factor;
  if(t<0.5) factor = 2.0 * t * t;
  else factor = 1 - 2.0 * (1.0 - t) * (1.0 - t);
  return (a + factor * (b - a));
}

let main_words = {
  "HUMAN": [187, 591],
  "CREATE": [414, 218],
  "CHANGE": [737, 520]
};

let tour = [
  [500, 500, 0],
  [500, 500, 1],
  [187, 591, 2],
  [414, 218, 2],
  [737, 620, 2]
];

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
  textSize(26);

  for (const key in main_words) {
    let coords = main_words[key];
    let im_x = map(coords[0], 0, 1000, 0, bgImage.width);
    let im_y = map(coords[1], 0, 1000, 0, bgImage.height);
    if (im_x > source_startx && im_x < source_startx + source_width &&
        im_y > source_starty && im_y < source_starty + source_height) {
      let hx = map(im_x, source_startx, source_startx + source_width, dx, dx+dWidth);
      let hy = map(im_y, source_starty, source_starty + source_height, dy, dy+dHeight);
      text(key, hx, hy);
    }
    // let hx = bg_start_x + int(coords[0]/1000 * pixel_width);
    // let hy = int(coords[1]/1000 * pixel_height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}