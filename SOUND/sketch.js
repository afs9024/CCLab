let backsound;
function preload() {
  backsound = loadSound("assets/my-sounds/00.mp3");
};

function setup() {
  createCanvas(400, 400);
  backsound.loop();
}

function draw() {
  background(220);
}



