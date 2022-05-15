var canvas;
let image;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  image = loadImage("https://picsum.photos/400/600");
  console.log(canvas);
}

function draw() {
  background(20);
}
