// Branch class represents each branch of the tree
// Each branch is a life choice / decision growing into the future
class Branch {
  // Constructor sets up initial properties when a new branch is created
  constructor(startX, startY, endX, endY, level) {
    // This is storing the starting position of the branch
    this.startX = startX;
    this.startY = startY;
    
    // This is storng the ending position where branch should grow to
    this.endX = endX;
    this.endY = endY;
    
    // The current position starts at the beginning (for growth animation)
    this.currentEndX = startX;
    this.currentEndY = startY;
    // The level tracks how many generations deep this branch is (trunk = 0, first split = 1, etc.)
    this.level = level;
    
    // These are the control variables for branch behavior
    this.canSplit = true;    // Whether this branch can split into new branches
    this.isGrowing = true;   // Whether branch is currently growing
    this.isDead = false;     // Whether branch should be removed
    
    // This is the branch lifetime in frames (branches fade away over time to save performance)
    this.life = 1000;
    
    // This is the branch thickness decreases as level increases (trunk is thick, tips are thin)
    // map() maps level 0-9 to thickness 16-2
    this.thickness = map(level, 0, 9, 16, 2);
  }

  // Update function called every frame to animate branch growth and handle aging
  update() {
    // Only grow if the branch is still in growing state
    if (this.isGrowing == true) {
      // lerp() creates smooth animation by moving current position toward target
      // lerp(start, end, amount), use 0.015 for slow, organic growth
      this.currentEndX = lerp(this.currentEndX, this.endX, 0.015);
      this.currentEndY = lerp(this.currentEndY, this.endY, 0.015);

      // This is check distance between current position and target
      let d = dist(this.currentEndX, this.currentEndY, this.endX, this.endY);

      // This is if close enough to target, stop growing
      if (d < 3) {
        this.isGrowing = false;
      }
    }

    // This is decrease life every frame (branches fade and die over time)
    this.life--;

    // This is how mark branch as dead when life reaches zero
    if (this.life < 0) {
      this.isDead = true;
    }
  }

  // This is display function draws the branch on screen
  display() {
    // Calculate alpha (transparency) based on remaining life
    // map() converts life value to opacity: full life = opaque, zero life = transparent
    let a = map(this.life, 0, 1000, 0, 255);

    // Draw branch as a line
    stroke(70, 40, 20, a);  // Brown color with calculated transparency
    strokeWeight(this.thickness);
    line(this.startX, this.startY, this.currentEndX, this.currentEndY);

    // Draw leaves on higher level branches that have finished growing
    // Only branches beyond level 3 get leaves for visual variety
    if (this.level > 3) {
      if (this.isGrowing == false) {
        noStroke();
        fill(40, 120, 55, a);  // Green color with transparency
        // random() creates variation in leaf sizes
        circle(this.currentEndX, this.currentEndY, random(8, 14));
      }
    }
  }

  // This is split() creates two new child branches from this branch
  // This is called for automatic/random tree growth
  split() {
    // This is only split if allowed and tree hasn't grown too large
    if (this.canSplit == true) {
      if (branches.length < 90) {
        // This is prevent this branch from splitting again
        this.canSplit = false;

        // Calculate current branch direction
        let dx = this.endX - this.startX;
        let dy = this.endY - this.startY;

        // Try to create new branches with proper spacing
        // Try multiple times to find good positions
        for (let attempt = 0; attempt < 10; attempt++) {
          // Create first new branch with variation
          // Multiply by 0.7 to make child branches shorter than parent
          // Add random() for organic, natural-looking variation
          let newDX1 = dx * 0.7 + random(-60, 60);
          let newDY1 = dy * 0.7 - random(20, 50);  // Negative to grow upward

          // Calculate end position for first new branch
          let x1 = this.endX + newDX1;
          let y1 = this.endY + newDY1;

          // Check if this position has enough space for branches
          // Minimum distance is 80 pixels from other branches
          let hasSpace1 = true;
          for (let i = 0; i < branches.length; i++) {
            let d = dist(x1, y1, branches[i].endX, branches[i].endY);
            if (d < 80) {
              hasSpace1 = false;
            }
          }

          // If space is clear, create the first branch
          if (hasSpace1 == true) {
            branches.push(new Branch(this.endX, this.endY, x1, y1, this.level + 1));
          }

          // Create second new branch with variation
          let newDX2 = dx * 0.7 + random(-60, 60);
          let newDY2 = dy * 0.7 - random(20, 50);

          // Calculate end position for second new branch
          let x2 = this.endX + newDX2;
          let y2 = this.endY + newDY2;

          // Check if this position has enough space
          let hasSpace2 = true;
          for (let i = 0; i < branches.length; i++) {
            let d = dist(x2, y2, branches[i].endX, branches[i].endY);
            if (d < 80) {
              hasSpace2 = false;
            }
          }

          // If space is clear, create the second branch
          if (hasSpace2 == true) {
            branches.push(new Branch(this.endX, this.endY, x2, y2, this.level + 1));
          }
        }

        // Provide audio and visual feedback
        playNote();  // Play a musical note
        releaseLetters(this.endX, this.endY, 2);  // Release letter particles
      }
    }
  }

  // splitToward() creates branches that lean toward a target (hand or sound)
  // This makes the tree interactive and responsive
  splitToward(targetX, targetY) {
    if (this.canSplit == true) {
      if (branches.length < 90) {
        this.canSplit = false;

        // Get current branch direction
        let dx = this.endX - this.startX;
        let dy = this.endY - this.startY;

        // Calculate direction toward the target (hand position)
        let handDX = targetX - this.endX;
        let handDY = targetY - this.endY;

        // lerp() blends branch direction with hand direction
        // 0.5 means equal influence from both (50% branch direction, 50% hand direction)
        let newDX = lerp(dx, handDX, 0.5);
        let newDY = lerp(dy, handDY, 0.5);

        // Try multiple times to find positions with enough spacing
        for (let attempt = 0; attempt < 10; attempt++) {
          // Add random variation for natural look
          let x1 = this.endX + newDX + random(-50, 50);
          let y1 = this.endY + newDY + random(-50, 50);

          // Check if first position has enough space
          let hasSpace1 = true;
          for (let i = 0; i < branches.length; i++) {
            let d = dist(x1, y1, branches[i].endX, branches[i].endY);
            if (d < 80) {
              hasSpace1 = false;
            }
          }

          // If space is clear, create the first branch
          if (hasSpace1 == true) {
            branches.push(new Branch(this.endX, this.endY, x1, y1, this.level + 1));
          }

          // Calculate second position
          let x2 = this.endX + newDX + random(-50, 50);
          let y2 = this.endY + newDY + random(-50, 50);

          // Check if second position has enough space
          let hasSpace2 = true;
          for (let i = 0; i < branches.length; i++) {
            let d = dist(x2, y2, branches[i].endX, branches[i].endY);
            if (d < 80) {
              hasSpace2 = false;
            }
          }

          // If space is clear, create the second branch
          if (hasSpace2 == true) {
            branches.push(new Branch(this.endX, this.endY, x2, y2, this.level + 1));
          }
        }

        // More feedback for hand interaction
        playNote();
        releaseLetters(this.endX, this.endY, 4);
      }
    }
  }
}

// LetterParticle class represents floating letters from the message
// Shows the concept of sending a message to the future
class LetterParticle {
  // Constructor initializes a letter particle at a position
  constructor(x, y, letter) {
    this.x = x;
    this.y = y;
    this.letter = letter;  // The character to display
    
    // Random movement speeds create organic, varied motion
    this.speedX = random(-1.5, 1.5);  // Horizontal drift
    this.speedY = random(-2.5, -0.5); // Upward movement (negative y = up)
    
    // Random size for visual variety
    this.size = random(14, 28);
    
    // Lifetime in frames before particle disappears
    this.life = 170;
    this.isDead = false;
  }

  // Update particle position and lifetime each frame
  update() {
    // Move particle based on speed
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Slow down over time (multiply by 0.98 each frame)
    // This creates a natural deceleration effect
    this.speedX = this.speedX * 0.98;
    this.speedY = this.speedY * 0.98;
    
    // Decrease life (particle fades over time)
    this.life--;

    // Mark as dead when life expires
    if (this.life < 0) {
      this.isDead = true;
    }
  }

  // Draw the letter particle
  display() {
    // Calculate transparency based on remaining life
    // Particles fade out as they age
    let a = map(this.life, 0, 170, 0, 255);

    // Draw the letter
    fill(255, 240, 180, a);  // Warm yellow/white color
    noStroke();
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.letter, this.x, this.y);
  }
}

// The raindrop class represents nourishing rain
// The rain shows nature's healing cycle, when care for our environment,
// The rain comes to nourish the trees humans plant for our future selves
class Raindrop {
  // Constructor sets up a falling raindrop
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = random(4, 8);  // How fast it falls
    this.life = 200;
    this.isDead = false;
  }



  // Update raindrop position and check for ground collision
  update() {
    // This is rain falls down each frame
    this.y = this.y + this.speedY;

    // This is when raindrop reaches the ground, mark it as dead
    // Rain falling shows the world is healthy (visual storytelling)
    if (this.y > 410) {
      this.isDead = true;
    }
  }

  // Draw the raindrop
  display() {
    // map() life to transparency so raindrops fade naturally
    let a = map(this.life, 0, 200, 0, 220);
    stroke(100, 180, 230, a);  // Light blue color
    strokeWeight(3);
    line(this.x, this.y, this.x, this.y + 8);
  }
}

// The Global Variables
// Hand tracking variables (ml5.js hand pose detection)
let handPose;        // The hand pose model
let video;           // Webcam video
let hands = [];      // Array storing detected hands
let options = { maxHands: 1, flipped: true };  // Track 1 hand, flip for mirror effect

// Face tracking variables (ml5.js face mesh detection)
// Face presence shows the user is "watching over" their future world
// When the user is present and caring, the environment slowly heals
let faceMesh;
let faces = [];
let faceOptions = { maxFaces: 1, refineLandmarks: false, flipped: true };

// Tree and particle arrays
let branches = [];   // All branch objects
let letters = [];    // All letter particle objects
let raindrops = [];  // All raindrop objects (nourishing rain)

// This shows environmental health tracks the well-being of the future world
// This connects user actions to the world the future self will live in
// This establishes a quiet and caring presence represents a healthy enviornemnt. Loud noise represnets pollution and damaged
let environmentalHealth = 100;  // 0 = polluted, 100 = healthy

// Message that breaks apart into letters
let message = "DEAR FUTURE ME";

// Sound variables (p5.sound library)
let osc;             // Oscillator for creating tones
let envelope;        // Envelope for sound shaping
let notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];  // Musical scale

// Microphone input variables
let mic;             // Microphone object
let micLevel = 0;    // Current microphone volume
let oldMicLevel = 0; // Previous frame's volume (for detecting changes)

// P5.JS CORE FUNCTIONS
// preload() runs once before setup, loads the tracking models
function preload() {
  handPose = ml5.handPose(options);
  faceMesh = ml5.faceMesh(faceOptions);  // Load face mesh model
}

// This is the setup() runs once at start, initializes everything
function setup() {
  // Create canvas with fixed size
  createCanvas(1920, 1080);

  // This is to start webcam video
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();  // draw it ourselves)

  // This is to start hand detection on the video
  handPose.detectStart(video, gotHands);

  // This is to start face detection (caring presence)
  faceMesh.detectStart(video, gotFaces);

  // Initialize sound oscillator
  osc = new p5.TriOsc();  // Triangle wave oscillator
  osc.amp(0.5);           // Set volume to 50%

  // This is to initialize sound envelope (controls how sound fades in/out)
  envelope = new p5.Env();
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);  // Attack, Decay, Sustain, Release
  envelope.setRange(1, 0);

  // This is to initialize microphone
  mic = new p5.AudioIn();
  mic.start();

  // This is to create initial trunk branch at bottom center of screen
  // This is to start position: (320, 420), End position: (320, 290)
  branches.push(new Branch(320, 420, 320, 290, 0));
}

// This is to callback function that receives hand tracking results
function gotHands(results) {
  hands = results;  // Store detected hands
}

// Callback function for face tracking results
// Face presence means user is watching over their future world
function gotFaces(results) {
  faces = results;
}

// This is to draw() runs 60 times per second (main animation loop)
function draw() {
  // Draw background first (sky, ground, sun, etc.)
  // Background colors react to environmentalHealth (visual storytelling)
  drawNatureBackground();

  // This is to get current microphone level
  micLevel = mic.getLevel();

  // HAND INTERACTION
  
  // This is to loop through all detected hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    // This is to get index finger tip position (keypoint 8 is finger tip)
    let handTip = hand.keypoints[8];

    // This is to draw hand position indicator
    fill(255, 230, 100, 90);  // Yellow, semi-transparent
    noStroke();
    circle(handTip.x, handTip.y, 70);  // Large circle (glow effect)

    fill(255, 230, 100);  // Yellow, opaque
    circle(handTip.x, handTip.y, 16);  // Small circle (fingertip dot)

    // This is to check every 100 frames if hand is near any branches
    // This prevents too-frequent branching for better control
    if (frameCount % 100 == 0) {
      // This is to check each branch
      for (let j = 0; j < branches.length; j++) {
        if (branches[j].canSplit == true) {
          // This is to calculate distance from hand to branch end
          let d = dist(handTip.x, handTip.y, branches[j].endX, branches[j].endY);

          // This is to show if hand is close enough (within 260 pixels), grow branch toward hand
          if (d < 260) {
            branches[j].splitToward(handTip.x, handTip.y);
          }
        }
      }
    }
  }

  // The face presence is used to show user "watching over" their future
  // When user is present and caring, environment slowly heals + rain falls
  if (faces.length > 0) {
    // Slowly increase environmental health (caring presence helps the world)
    if (environmentalHealth < 100) {
      environmentalHealth = environmentalHealth + 0.05;
    }

    // Get nose position to draw a soft glow showing user's "presence"
    let face = faces[0];
    let nose = face.keypoints[4];  // keypoint 4 is the nose tip
    fill(180, 230, 255, 50);  // Soft blue glow
    noStroke();
    circle(nose.x, nose.y, 100);  // Visual marker of caring presence

    // When environment is healthy and user is present, raindrops fall
    // This shows nature thrives when humans are mindful
    if (frameCount % 25 == 0) {
      if (environmentalHealth > 60) {
        if (random(1) < 0.6) {
          // Spawn raindrop at random x position at top of screen
          raindrops.push(new Raindrop(random(width), 0));
        }
      }
    }
  }

  // AUTOMATIC TREE GROWTH
  // Every 170 frames, randomly split some branches
  // This makes the tree grow even without interaction
  if (frameCount % 170 == 0) {
    for (let i = 0; i < branches.length; i++) {
      if (branches[i].canSplit == true) {
        // 12% chance to split (creates gradual growth)
        if (random(1) < 0.12) {
          branches[i].split();
        }
      }
    }
  }

  // MICROPHONE INTERACTION
  // This is to detect when sound crosses threshold (going from quiet to loud)
  // This responds to clapping, speaking, or any sudden sound
  if (micLevel > 0.07) {
    if (oldMicLevel < 0.07) {
      // Loud noise represents pollution - it damages the environment
      // The future world degrades when humans are too loud/destructive
      // (The sky color will visibly turn gray as health drops)
      environmentalHealth = environmentalHealth - 12;
      if (environmentalHealth < 0) {
        environmentalHealth = 0;
      }

      // Make several branches split in response to sound
      for (let i = 0; i < branches.length; i++) {
        if (branches[i].canSplit == true) {
          // 30% chance for each branch to split
          if (random(1) < 0.3) {
            branches[i].split();
          }
        }
      }

      // This is to release extra letters from the trunk when sound is detected
      releaseLetters(320, 400, 8);
    }
  }

  // This. is to remember current mic level for next frame comparison
  oldMicLevel = micLevel;

  // UPDATE AND DRAW ALL BRANCHES
  
  // This is to loop through all branches
  for (let i = 0; i < branches.length; i++) {
    branches[i].update();   // Update branch animation and lifetime
    branches[i].display();  // Draw the branch
  }
  
  // This is to remove dead branches to save memory and processing
  let aliveBranches = [];
  for (let i = 0; i < branches.length; i++) {
    if (branches[i].isDead == false) {
      aliveBranches.push(branches[i]);
    }
  }
  branches = aliveBranches;
  
  // UPDATE AND DRAW ALL LETTER PARTICLES
  // This is to loop through all letters
  for (let i = 0; i < letters.length; i++) {
    letters[i].update();   // Update position and lifetime
    letters[i].display();  // Draw the letter
  }
  
  // This is to remove dead particles
  let aliveLetters = [];
  for (let i = 0; i < letters.length; i++) {
    if (letters[i].isDead == false) {
      aliveLetters.push(letters[i]);
    }
  }
  letters = aliveLetters;

  // UPDATE AND DRAW ALL RAINDROPS
  // Rain nourishes the tree and represents environmental healing
  for (let i = 0; i < raindrops.length; i++) {
    raindrops[i].update();
    raindrops[i].display();
  }

  // This is to remove raindrops that have hit the ground
  let aliveRain = [];
  for (let i = 0; i < raindrops.length; i++) {
    if (raindrops[i].isDead == false) {
      aliveRain.push(raindrops[i]);
    }
  }
  raindrops = aliveRain;
  
  // This is how the Trees Regernerate
  // This is to show if all branches have died, create a new trunk
  // This ensures the tree can always regrow
  if (branches.length < 1) {
    branches.push(new Branch(320, 420, 320, 290, 0));
  }

  // This is to draw microphone level indicator
  drawMicCircle();
  // Draw environmental health indicator (visual feedback)
  drawHealthBar();
  // Draw instructions for user
  drawInstructions();
}

// HELPER FUNCTIONS
// Draws the nature background (sky, sun, hills, ground)
// Sky and sun colors now shift based on environmentalHealth
// Healthy = bright blue sky and warm sun. Polluted = gray smoggy sky
function drawNatureBackground() {
  // map() the health value to sky color components
  // High health = bright blue (145, 200, 235), low health = gray (110, 105, 110)
  let skyR = map(environmentalHealth, 0, 100, 110, 145);
  let skyG = map(environmentalHealth, 0, 100, 105, 200);
  let skyB = map(environmentalHealth, 0, 100, 110, 235);
  background(skyR, skyG, skyB);
  noStroke();

  // Sun color also shifts, bright yellow when healthy, dim red when polluted
  let sunR = map(environmentalHealth, 0, 100, 200, 255);
  let sunG = map(environmentalHealth, 0, 100, 100, 235);
  let sunB = map(environmentalHealth, 0, 100, 80, 150);
  fill(sunR, sunG, sunB);
  circle(560, 70, 70);

  // Distant hills, green ellipses for depth (also shift slightly with health)
  let hillG = map(environmentalHealth, 0, 100, 110, 180);
  fill(120, hillG, 110);
  ellipse(150, 390, 500, 160);
  fill(90, hillG - 20, 85);
  ellipse(480, 400, 520, 150);

  // Ground = dark green rectangle at bottom
  fill(70, 130, 65);
  rect(0, 410, 640, 70);

  // Tree trunk base = brown rectangle
  fill(95, 60, 30);
  rect(300, 390, 40, 50);

  // Tree roots = brown triangles
  fill(60, 40, 25);
  triangle(300, 440, 265, 460, 310, 445);
  triangle(340, 440, 375, 460, 330, 445);
}

// Visual indicator showing microphone level
function drawMicCircle() {
  // Map microphone level to circle size
  // Quiet = small circle, loud = large circle
  let s = map(micLevel, 0, 0.2, 10, 90);

  // Draw pulsing circle in bottom right corner
  fill(255, 240, 180, 90);
  noStroke();
  circle(590, 430, s);
}

// Draws a small leaf shaped indicator showing environmental health
// Visual feedback so users see how their actions affect the future world
function drawHealthBar() {
  // Bar background
  fill(0, 0, 0, 100);
  noStroke();
  rect(540, 20, 80, 14, 7);

  // Health fill - green when healthy, red when polluted
  let barWidth = map(environmentalHealth, 0, 100, 0, 76);
  let barR = map(environmentalHealth, 0, 100, 200, 60);
  let barG = map(environmentalHealth, 0, 100, 80, 180);
  fill(barR, barG, 70);
  rect(542, 22, barWidth, 10, 5);
}

// Display instructions for the user
function drawInstructions() {
  // Semi-transparent black background for text readability
  fill(0, 0, 0, 150);
  noStroke();
  rect(10, 10, 280, 80, 10);
  
  // White text with instructions
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  text("WAVE HAND = PLANT", 20, 20);
  text("STAY QUIET = CLEAN AIR", 20, 45);
  text("LOUD NOISE = POLLUTION", 20, 67);
}

// This is creating and releasing letter particles from a position
function releaseLetters(x, y, amount) {
  // Create 'amount' number of letter particles
  for (let i = 0; i < amount; i++) {
    // Pick random letter from message
    let letterIndex = floor(random(message.length));
    
    // This is to create LetterParticle and add to letters array
    letters.push(new LetterParticle(x, y, message[letterIndex]));
  }
}

// This is to play a random musical note from the scale
function playNote() {
  osc.start();  // Start the oscillator
  // This is to pick random note from notes array
  let noteIndex = floor(random(notes.length));
  let freq = notes[noteIndex];
  osc.freq(freq);  // Set oscillator frequency
  envelope.play(osc, 0, 0.3);  // Play note with 0.3 second duration
}