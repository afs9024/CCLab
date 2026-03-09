/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

// Template
let cx, cy; // creature position
let vx, vy; // speed

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  colorMode(HSB, 100);

  cx = random(80, width - 80);
  cy = random(80, height - 80);

  vx = random(2, 5);
  vy = random(2, 5);
}

function draw() {
  background(0);

  // Nucleus Drift Movement
  cx += vx;
  cy += vy;

  // bounce off edges
  if (cx > width - 40 || cx < 40) {
    vx = -vx;
  }
  if (cy > height - 40 || cy < 40) {
    vy = -vy;
  }

  // Lerp movement when mouse pressed
  if (mouseIsPressed == true) {
    cx = lerp(cx, mouseX, 0.05);
    cy = lerp(cy, mouseY, 0.05);
  }

  drawCreature(cx, cy);
}

function drawCreature(x, y) {
  push();
  translate(x, y);

  rotate(map(sin(frameCount * 0.03), -1, 1, -PI / 8, PI / 8));

  // Nucleus body
  let h = map(sin(frameCount * 0.02), -1, 1, 0, 100);

  noStroke();
  fill(h, 90, 100);
  circle(0, 0, 50);

  fill(h, 40, 100);
  circle(0, 0, 18);

  // Nucleus halo
  drawHalo(25);

  // Nucleus limbs
  for (let i = 0; i < 8; i++) {
    let a = (TWO_PI / 8) * i;
    drawTentacle(a, 70);
  }

  // Orbit sparks
  drawOrbitSparks(8, 30);

  pop();
}

// My other functions

function drawHalo(r) {
  noStroke();
  for (let a = 0; a < TWO_PI; a += PI / 6) {
    push();
    rotate(a + frameCount * 0.01);
    fill(0, 0, 100);
    circle(r, 0, 16);
    pop();
  }
}

//This is the tentacle
function drawTentacle(angle, len) {
  push();
  rotate(angle);

  rotate(map(sin(frameCount * 0.05 + angle * 3), -1, 1, -PI / 10, PI / 10));

  noFill();
  strokeWeight(6);
  stroke(60, 80, 100);

  beginShape();
  for (let i = 0; i <= len; i += len / 10) {
    let v = 10 * sin(frameCount * 0.1 - i * 0.08);
    vertex(i, v);
  }
  endShape();

  noStroke();
  fill(80, 80, 100);
  circle(len, 0, 10);

  pop();
}

//This is the Orbit Sparks
function drawOrbitSparks(count, r) {
  noStroke();
  for (let i = 0; i < count; i++) {
    let a = (TWO_PI / count) * i + frameCount * 0.04;
    let ox = cos(a) * r;
    let oy = sin(a) * r;
    fill(95, 60, 100);
    circle(ox, oy, 6);
  }
}
