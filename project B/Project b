let msg;

function setup() {
  createCanvas(800, 500);
  msg = new Message();
  textAlign(CENTER, CENTER);
}

function draw() {
  background(240);
  msg.update();
  msg.display();
}

function mousePressed() {
  msg.changeMessage();
}

class Message {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.newX = width / 2;
    this.newY = height / 2;
    this.words = "Dear Future Me";
  }

  display() {
    fill(0);
    textSize(32);
    text(this.words, this.x, this.y);
  }

  update() {
    this.x = lerp(this.x, this.newX, 0.1);
    this.y = lerp(this.y, this.newY, 0.1);
  }

  changeMessage() {
    if (this.words == "Dear Future Me") {
      this.words = "Dear Future Me...";
    } else if (this.words == "Dear Future Me...") {
      this.words = "Future Me";
    } else if (this.words == "Future Me") {
      this.words = "Me";
    } else if (this.words == "Me") {
      this.words = "?";
    } else {
      this.words = "Dear Future Me";
    }

    this.newX = random(100, width - 100);
    this.newY = random(100, height - 100);
  }
}