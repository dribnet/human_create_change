let bgImage = null;
const bgColor = "#33362f"

function preload() {
  bgImage = loadImage('human3m_example1.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bgColor);

  // height of image is height of screen, natural aspect is 0.7
  let pixel_height = height;
  let pixel_width = int((bgImage.width/bgImage.height) * height);
  let bg_start_x = int((width-pixel_width)/2)
  image(bgImage, bg_start_x, 0, pixel_width, pixel_height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}