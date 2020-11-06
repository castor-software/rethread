// Get p5 autocompletions
/// <reference path="node_modules/@types/p5/global.d.ts" />

// Performance - Disables FES
// p5.disableFriendlyErrors = true;

/// There is stuttering some light stuttering every few seconds, probably because of GC

let particles = new Map();
let particlePosX = 0;
let particlePosY = 0;
let positionSeed = Math.random() * 748236.0;
positionSeed = 1;
var clearScreen = false;
let positionMode = 0; // 0 = linear position, 1 = sine curved position
let averageLen = 0;
let step = 1;
let pixelSize = 1;

let droplets = [];

function addDroplet(len, baseHue, out) {
  let hue = baseHue + Math.min(len/50000, 10);
  droplets.push({
    x: Math.random() * canvasX,
    y: Math.random() * canvasY,
    size: 2,
    maxSize: Math.min(len/2000, 200.0),
    saturation: Math.random() * 50 + 40 + hue,
    lightness: 50 + (hue * 2),
    hue: hue,
    out: out
  })
  // if(len < 50000) {
  //   droplets[droplets.length-1].hue = 5;
  // }
}

let num = 0;
new WebSocketClient().onmessage = (data) => {
  if(num < 10) {
    console.log(data)
    console.log(JSON.parse(data.data));
  }
  let internalData = JSON.parse(data.data);
  let continent;
  if(internalData.remote_location.country != "Sweden"
  && internalData.remote_location.country != undefined) {
    lastCountry = internalData.remote_location.country;
    continent = internalData.remote_location.continent;
  } else if(internalData.local_location.country != "Sweden"
  && internalData.local_location.country != undefined) {
    lastCountry = internalData.local_location.country;
    continent = internalData.local_location.continent;
  }
  if(internalData.len > 0 && internalData.out == doOutPackets) {
    addDroplet(internalData.len, baseHueColor, internalData.out);
  }
  
  num++;
};
///////////////////////// GUI Element Global Variables///////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////// Global Variables///////////////////////////////////////

let windows = [];
windows.push({ x: 2, y: 0, w: 36, h: 35 });
windows.push({ x: 86, y: 0, w: 36, h: 35 });
windows.push({ x: 170, y: 0, w: 36, h: 35 });

windows.push({ x: 2, y: 66, w: 36, h: 49 });
windows.push({ x: 86, y: 66, w: 36, h: 49 });
windows.push({ x: 170, y: 66, w: 36, h: 49 });

windows.push({ x: 2, y: 150, w: 36, h: 49 });
windows.push({ x: 86, y: 150, w: 36, h: 49 });
windows.push({ x: 170, y: 150, w: 36, h: 49 });

windows.push({ x: 2, y: 234, w: 36, h: 49 });
windows.push({ x: 86, y: 234, w: 36, h: 49 });
windows.push({ x: 170, y: 234, w: 36, h: 49 });

windows.push({ x: 2, y: 316, w: 36, h: 44 });
windows.push({ x: 86, y: 316, w: 36, h: 44 });
windows.push({ x: 170, y: 316, w: 36, h: 44 });

let centerWindow = windows[7];

let columns = [];
columns.push({x: 38, y: 0, w: 48, h: 360});
columns.push({x: 122, y: 0, w: 48, h: 360});

const MAX_PARTICLE_COUNT = 250;

var canvasX = 208;
var canvasY = 360;
var numPixels = canvasX * canvasY;

var inc = 0.15;
var scl = 10;
var cols, rows;

var zoff = 0;

var fr;

var flowfield;

let lastChange = Date.now();
let lastNow = 0;

let lastCountry = "";

let displayText = "";
let displayTextSize = 24;
let displayTextSizeGrowth = 8;

let myFont;

let doOutPackets = true;
let baseHueColor = 50;

function switchPacketDirection() {
  console.log("Switching direction");
  clearScreen = true;
  displayTextSize = 24;
  droplets = [];
    if(doOutPackets) {
      doOutPackets = false;
      displayText = "INCOMING";
      baseHueColor = 0;
    } else {
      doOutPackets = true;
      displayText = "OUTGOING";
      baseHueColor = 0;
    }
    setTimeout(()=>{displayText = ""}, 2000);
    setTimeout(switchPacketDirection, 10000);
}

switchPacketDirection();

// Preload Function
function preload() {
  myFont = loadFont('assets/fonts/InconsolataSemiExpanded-Light.ttf');
} // End Preload

/////////////////////////////////////////////////////////////////////////////////////////////

// Setup Function
function setup() {
  // Create canvas
  canvas = createCanvas(canvasX, canvasY);

  // Send canvas to CSS class through HTML div
  canvas.parent("sketch-holder");

  // Set up flow field
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP("");

  flowfield = new Array(cols * rows);

  // Calculate window center points
  for (w of windows) {
    w.center = createVector(w.x + w.w / 2, w.y + w.h / 2);
    w.halfWidthSq = Math.pow(w.w / 2, 2);
    w.halfHeightSq = Math.pow(w.h / 2, 2);
  }

  for(let i = 0; i < windows.length-2; i++) {
    let center = (windows[i].center.y + windows[i+1].center.y)/2;
    console.log("center: " + ((center/height)-0.5));
  }

  background("#FFFFFF");

  textFont('sans');
  textSize(24);
  textAlign(CENTER, CENTER);
  textFont(myFont);

  // Set canvas framerate
  // frameRate(25);
} // End Setup

/////////////////////////////////////////////////////////////////////////////////////////////

// Draw Function
function draw() {

  let now = Date.now(); // current time in milliseconds
  if(lastNow == 0) {
    lastNow = now;
  }
  let dt = now - lastNow;

  // Clear if needed
  // clear();

  // Set canvas background
  if(clearScreen) {
    background("rgba(1.0,1.0,1.0,1.0)");
    clearScreen = false;
  }

  // background("rgba(1.0,1.0,1.0,0.00)");
  background(Math.random() * 15, 100, 80, 4);
  

  colorMode(HSL, 100);
  for(let drop of droplets) {
    
    stroke(drop.hue, drop.saturation, 25 + drop.lightness, (1.0 - drop.size/drop.maxSize) * 100);
    noFill();
    let dropSize = drop.size;
    if(drop.out == false) {
      dropSize = drop.maxSize - dropSize;
    }
    circle(drop.x, drop.y, dropSize);
    drop.size += 1.0;
    drop.lightness -= (10 -drop.hue) * 0.1;
    let size = drop.size;
    // while(size > 30) {
    //   size -= 30;
    //   circle(drop.x, drop.y, size);
    // }
  }

  droplets = droplets.filter((d) => d.size < d.maxSize);

  // Draw the windows
  fill(50, 100);
  noStroke();
  for (win of windows) {
    rect(win.x, win.y, win.w, win.h);
  }

  
  // positionSeed += 0.001;
  // Draw text
  colorMode(HSL, 100);
  fill(75, 100, 0, 100);
  textSize(displayTextSize);
  displayTextSize += displayTextSizeGrowth * (dt/1000.0);
  // lastCountry = "Hong Kong (China)";
  // if(lastCountry.length >= 13) {
  //   textSize(37 - lastCountry.length);
  // }
  text(displayText, width/2, 130);
  // textSize(24);
  // text('OCEANIA', width/2, 297);

  // fill(255, 100, 50, 50);
  // rect(centerWindow.x, centerWindow.y, centerWindow.w, centerWindow.h);
  // console.log("num packets: " + num + " elements in particles: " + particles.size);
  lastNow = now;
} // End Draw

/////////////////////////////////////////////////////////////////////////////////////////////

// Helper functions

function getFlowfieldForce(pos, vectors) {
  var x = floor(pos.x / scl);
  var y = floor(pos.y / scl);
  var index = x + y * cols;
  var force = vectors[index];
  return force;
}

function windowContains(win, pos) {
  if (
    pos.x >= win.x &&
    pos.x <= win.x + win.w &&
    pos.y >= win.y &&
    pos.y <= win.y + win.h
  ) {
    return true;
  } else {
    return false;
  }
}

const FORCE = 10;
function windowForce(win, pos) {
  let distX = win.center.x - pos.x;
  let distY = win.center.y - pos.y;
  let vel = createVector(0, 0);
  if (Math.abs(distX) < win.w / 2 && Math.abs(distY) < win.h / 2) {
    if (distX < 0) {
      vel.x = FORCE;
    } else {
      vel.x = -FORCE;
    }
    if (distY < 0) {
      vel.y = FORCE;
    } else {
      vel.y = -FORCE;
    }
  }
  return vel;
}