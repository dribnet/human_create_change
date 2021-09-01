// note: this file is poorly named - it can generally be ignored.

// helper functions below for supporting blocks/purview

function saveImage() {
  // generate 960x500 preview.jpg of entire canvas
  // TODO: should this be recycled?
  var offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = 960;
  offscreenCanvas.height = 960;
  var context = offscreenCanvas.getContext('2d');
  // background is flat white
  context.fillStyle="#FFFFFF";
  context.fillRect(0, 0, 960, 960);
  context.drawImage(this.canvas, 0, 0, 960, 960);
  // save to browser
  var downloadMime = 'image/octet-stream';
  var imageData = offscreenCanvas.toDataURL('image/jpeg');
  imageData = imageData.replace('image/jpeg', downloadMime);
  p5.prototype.downloadFile(imageData, 'dress.jpg', 'jpg');
}
