/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  dancer = new Pufferfish(width / 2, height / 2);
}

function draw() {
  background(0);
  drawFloor();

  dancer.update();
  dancer.display();
}

class Pufferfish {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
  }

  update() {
    this.x += sin(frameCount * 0.05) * 1;
    this.y += cos(frameCount * 0.05) * 1;
}

  display() {
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️

    fill(240, 200, 60);
    noStroke();

    // body
    ellipse(0, 0, 120, 120);

    // spikes
    triangle(-40, -40, -30, -70, -10, -40);
    triangle(10, -40, 30, -70, 40, -40);
    triangle(-40, 40, -30, 70, -10, 40);
    triangle(10, 40, 30, 70, 40, 40);

    triangle(-60, 0, -80, -15, -60, -20);
    triangle(-60, 0, -80, 15, -60, 20);
    triangle(60, 0, 80, -15, 60, -20);
    triangle(60, 0, 80, 15, 60, 20);

    // eyes
    fill(255);
    ellipse(-20, -10, 15, 15);
    ellipse(20, -10, 15, 15);

    fill(0);
    ellipse(-20, -10, 6, 6);
    ellipse(20, -10, 6, 6);

    // mouth
    noFill();
    stroke(0);
    arc(0, 15, 20, 10, 0, PI);

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    this.drawReferenceShapes()

    pop();
  }

  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}