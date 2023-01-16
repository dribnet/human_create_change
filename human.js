let bgImage = null;
const bgColor = "#33362f"

function preload() {
  bgImage = loadImage('human3m_full_8m.jpg');
  font = loadFont('Avenir_Book.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}


let main_words = {
  "HUMAN": [187, 591],
  "CREATE": [414, 218],
  "CHANGE": [737, 520]
}

function draw() {
  background(bgColor);

  // height of image is height of screen, natural aspect is 0.7
  let pixel_height = height;
  let pixel_width = int((bgImage.width/bgImage.height) * height);
  let bg_start_x = int((width-pixel_width)/2)
  image(bgImage, bg_start_x, 0, pixel_width, pixel_height);

  fill('#ffffff');
  textFont(font);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(26);

  for (const key in main_words) {
    let coords = main_words[key];
    let hx = bg_start_x + int(coords[0]/1000 * pixel_width);
    let hy = int(coords[1]/1000 * pixel_height);
    text(key, hx, hy);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}