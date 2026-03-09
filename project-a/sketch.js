/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let cx, cy;
let vx, vy;

let bodyHue;
let tentacleLen;
let bodySize;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  colorMode(HSB, 100);

  cx = random(100, width - 100);
  cy = random(100, height - 100);

  vx = random(2, 4);
  vy = random(2, 4);

  bodyHue = random(50, 90);
  tentacleLen = random(55, 80);
  bodySize = random(45, 60);
}

function draw() {
  background(0);

  drawStars();

  // drifting movement
  cx = cx + vx;
  cy = cy + vy;

  // make movement feel more random
  if (frameCount % 30 == 0) {
    vx = vx + random(-1, 1);
    vy = vy + random(-1, 1);

    vx = constrain(vx, -5, 5);
    vy = constrain(vy, -5, 5);
  }

  // bounce off edges
  if (cx > width - 60 || cx < 60) {
    vx = -vx;
  }
  if (cy > height - 60 || cy < 60) {
    vy = -vy;
  }

  // mouse interaction: follow mouse when pressed
  if (mouseIsPressed == true) {
    cx = lerp(cx, mouseX, 0.05);
    cy = lerp(cy, mouseY, 0.05);
  }

  drawCreature(cx, cy);
}

function drawCreature(x, y) {
  let d = dist(mouseX, mouseY, x, y);

  let nearMouse = false;
  if (d < 120) {
    nearMouse = true;
  }

  push();
  translate(x, y);

  let wobble = map(sin(frameCount * 0.03), -1, 1, -PI / 10, PI / 10);
  rotate(wobble);

  // floating motion
  let floatY = 8 * sin(frameCount * 0.05);
  translate(0, floatY);

  // tentacles
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    drawTentacle(angle, tentacleLen, i, nearMouse);
  }

  // halo behind body
  drawHalo(bodySize * 0.65, nearMouse);

  // orbit sparks
  drawOrbitSparks(10, bodySize * 0.9, nearMouse);

  // body color changes when mouse is near
  noStroke();
  if (nearMouse == true) {
    fill(bodyHue + 20, 90, 100);
  } else {
    fill(bodyHue, 80, 100);
  }
  circle(0, 0, bodySize);

  // inner body glow
  if (nearMouse == true) {
    fill(bodyHue + 10, 40, 100);
  } else {
    fill(bodyHue, 30, 100);
  }
  circle(0, 0, bodySize * 0.45);

  // eyes
  fill(0, 0, 100);
  circle(-bodySize * 0.18, -bodySize * 0.08, bodySize * 0.18);
  circle(bodySize * 0.18, -bodySize * 0.08, bodySize * 0.18);

  // pupils track mouse a little
  let px = map(mouseX, 0, width, -2, 2);
  let py = map(mouseY, 0, height, -2, 2);

  fill(0, 0, 0);
  if (nearMouse == true) {
    circle(-bodySize * 0.18 + px, -bodySize * 0.08 + py, bodySize * 0.08);
    circle(bodySize * 0.18 + px, -bodySize * 0.08 + py, bodySize * 0.08);
  } else {
    circle(-bodySize * 0.18, -bodySize * 0.08, bodySize * 0.08);
    circle(bodySize * 0.18, -bodySize * 0.08, bodySize * 0.08);
  }

  // mouth
  noFill();
  stroke(0, 0, 100);
  strokeWeight(2);
  arc(0, bodySize * 0.08, bodySize * 0.22, bodySize * 0.18, 0, PI);

  pop();
}

function drawTentacle(angle, len, num, nearMouse) {
  push();
  rotate(angle);

  let swing = map(sin(frameCount * 0.06 + num * 0.8), -1, 1, -PI / 12, PI / 12);

  if (nearMouse == true) {
    swing = map(sin(frameCount * 0.12 + num * 0.8), -1, 1, -PI / 8, PI / 8);
  }

  rotate(swing);

  noFill();
  strokeWeight(5);

  if (nearMouse == true) {
    stroke(bodyHue + 15, 80, 100);
  } else {
    stroke(bodyHue, 70, 100);
  }

  beginShape();
  for (let i = 0; i <= len; i += len / 10) {
    let v;

    if (nearMouse == true) {
      v = 12 * sin(frameCount * 0.18 - i * 0.08 + num);
    } else {
      v = 8 * sin(frameCount * 0.10 - i * 0.08 + num);
    }

    vertex(i, v);
  }
  endShape();

  noStroke();
  if (nearMouse == true) {
    fill(bodyHue + 20, 60, 100);
  } else {
    fill(bodyHue + 10, 50, 100);
  }
  circle(len, 0, 8);

  pop();
}

function drawHalo(r, nearMouse) {
  noStroke();

  for (let a = 0; a < TWO_PI; a += PI / 5) {
    push();
    rotate(a + frameCount * 0.01);

    if (nearMouse == true) {
      fill(bodyHue + 25, 30, 100);
      circle(r + 8, 0, 18);
    } else {
      fill(bodyHue, 20, 100);
      circle(r, 0, 14);
    }

    pop();
  }
}

function drawOrbitSparks(count, r, nearMouse) {
  noStroke();

  for (let i = 0; i < count; i++) {
    let a = map(i, 0, count, 0, TWO_PI) + frameCount * 0.04;
    let ox = cos(a) * r;
    let oy = sin(a) * r;

    if (nearMouse == true) {
      fill(95, 40, 100);
      circle(ox, oy, 8);
    } else {
      fill(90, 20, 100);
      circle(ox, oy, 5);
    }
  }
}

function drawStars() {
  noStroke();

  for (let i = 0; i < 60; i++) {
    let sx = width * noise(i * 10) + map(cx, 0, width, -10, 10);
    let sy = height * noise(i * 20) + map(cy, 0, height, -10, 10);

    let starSize = map(sin(frameCount * 0.05 + i), -1, 1, 1, 4);

    fill(0, 0, 100);
    circle(sx, sy, starSize);
  }

  // a few larger glowing stars
  for (let i = 0; i < 12; i++) {
    let sx = width * noise(i * 50 + 200) + map(cx, 0, width, -15, 15);
    let sy = height * noise(i * 60 + 300) + map(cy, 0, height, -15, 15);

    let glow = map(sin(frameCount * 0.03 + i), -1, 1, 3, 8);

    fill(70, 20, 100);
    circle(sx, sy, glow);
  }
}

function mousePressed() {
  bodyHue = random(40, 95);
  tentacleLen = random(55, 85);
  bodySize = random(45, 60);

  vx = random(-4, 4);
  vy = random(-4, 4);
}
