# Benji Bananas Web Clone - Design Document

**Source video**: https://www.youtube.com/watch?v=OMpwHEUgllE 

## 1. Game Overview

- **Title**: Benji Bananas Web Edition (a clone inspired by the original mobile game as shown in the gameplay video).
- **Genre**: Physics-based endless runner/adventure platformer.
- **Target Platform**: Any modern web browser (Chrome, Firefox, Safari, etc.), using HTML5 Canvas for rendering. No external dependencies required beyond vanilla JavaScript, but optional use of simple physics simulation via custom code.
- **Objective**: Guide Benji the monkey through the jungle by swinging from vine to vine, collecting as many bananas as possible while avoiding obstacles. Achieve high scores by traveling far and collecting items.
- **Core Theme**: Jungle adventure with a cute monkey protagonist. Vibrant, colorful graphics with physics-driven swinging mechanics.
- **Inspiration**: Based on the Android gameplay video (https://www.youtube.com/watch?v=OMpwHEUgllE), which demonstrates swinging mechanics, banana collection, power-ups, and jungle hazards.
- **Monetization/Features**: Free-to-play. Includes score tracking, upgrades purchasable with in-game bananas (e.g., power-ups like magnets or shields). No real-money purchases in this clone.
- **Estimated Playtime**: Endless mode – sessions last 1-5 minutes per run; high replayability for score chasing.
- **Audience**: Casual gamers, all ages (family-friendly).

## 2. Gameplay Mechanics

### Player Controls
- Mouse/Touch: Click/tap to grab a vine (Benji attaches and starts swinging). Release to jump/release from the vine.
- Keyboard (optional for desktop): Spacebar to grab/release.
- The game is one-button simple but requires timing for momentum and jumps.

### Core Loop
- Benji auto-runs forward when not swinging.
- Swing on vines to gain height/momentum and propel forward.
- Collect bananas scattered in the air or on platforms.
- Avoid obstacles like bees, snakes, thorns, or falling to the ground (which ends the run).
- Power-ups: Temporary boosts like double bananas, invincibility, or rocket propulsion.

### Physics
- Gravity pulls Benji down.
- Swinging uses pendulum-like physics: velocity builds based on swing arc.
- Collision detection for vines, obstacles, and collectibles.

### Progression
- Endless procedural jungle generation: Vines, platforms, and items spawn randomly but with increasing difficulty (faster speed, more obstacles).
- Score based on distance traveled + bananas collected.
- Upgrades: Use collected bananas to buy permanent improvements (e.g., longer vines, better jump height).

### Win/Lose Conditions
- Lose: Touch the ground, hit an obstacle without shield.
- Win: No true "win"; aim for high scores. Leaderboard integration optional via local storage.

### Levels/Worlds
- Single endless level with biomes (jungle, waterfall, hills) that transition for variety.

### Audio
- Background jungle music (looping).
- SFX: Swing whoosh, banana collect ping, collision thud.
- (Implement via HTML5 Audio API; assume free assets or placeholders.)

## 3. Art and Assets

### Style
2D cartoonish, bright colors (greens for jungle, yellow for bananas).

### Key Assets
- Benji sprite sheet (idle, swinging, jumping, death animations).
- Vines (static or slightly animated).
- Bananas (collectible, rotating).
- Obstacles: Bees (flying), snakes (static), thorns.
- Background: Parallax scrolling layers (trees, sky, ground).
- UI: Score display, banana counter, upgrade shop menu.

### Resolution
Scalable to browser window (e.g., 800x600 base, responsive).

### Sources
Use free assets from OpenGameArt or similar; in code, placeholders can be drawn via Canvas (e.g., circles for bananas).

## 4. Technical Specifications

- **Engine/Framework**: Vanilla JavaScript with HTML5 Canvas for rendering and game loop.
- **Performance**: 60 FPS target. Use requestAnimationFrame for smooth updates.
- **Input Handling**: Mouse/touch events for mobile/desktop compatibility.
- **Storage**: LocalStorage for high scores and unlocked upgrades.
- **Accessibility**: Keyboard controls, color-blind friendly palettes.
- **Potential Enhancements**: Add Web3 integration if desired (e.g., NFT bananas), but keep core simple.

## 5. User Interface and Experience

- **Main Menu**: Start game, view high scores, upgrade shop.
- **In-Game HUD**: Score, bananas collected, distance meter.
- **Pause/End Screen**: Pause button, game over with restart option.
- **Tutorial**: Brief on-screen prompts at start (e.g., "Tap to swing!").

## 6. Development Roadmap

### Milestones
1. Basic canvas setup and player movement.
2. Physics and swinging mechanics.
3. Procedural generation and collisions.
4. UI and scoring.
5. Polish (audio, animations).

### Risks
Physics accuracy – custom implementation may need tuning for fun feel.

### Testing
Browser compatibility, mobile touch responsiveness.

---

# Step-by-Step Implementation Guide

This guide is structured for an agentic programmatic partner like Cursor (an AI-assisted code editor). Each step includes pseudocode/code snippets in JavaScript. Copy-paste into a new project: Create an `index.html` with a `<canvas>` element, link to `game.js`. Run via a local server (e.g., Live Server in VS Code).

## Step 1: Set Up HTML Structure and Basic Canvas

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Benji Bananas Web</title>
  <style> body { margin: 0; } canvas { display: block; } </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script src="game.js"></script>
</body>
</html>
```

In `game.js`, initialize canvas and game loop:
```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameRunning = true;
let score = 0;
let bananas = 0;

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Update and draw logic here
  requestAnimationFrame(gameLoop);
}

gameLoop();
```

**Cursor Tip**: Ask Cursor to "Add resize event listener to canvas for responsive design."

## Step 2: Implement Player (Benji) and Basic Movement

Define player object with position, velocity, state (swinging or freefall).
```javascript
const player = {
  x: 100,
  y: canvas.height / 2,
  vx: 5, // Horizontal velocity
  vy: 0, // Vertical velocity
  radius: 20, // Simple circle for now
  isSwinging: false,
  swingAnchor: { x: 0, y: 0 },
  swingLength: 0,
  swingAngle: 0,
  swingAngularVelocity: 0
};

function updatePlayer() {
  if (player.isSwinging) {
    // Pendulum physics
    player.swingAngularVelocity += (Math.sin(player.swingAngle) * -0.005); // Gravity effect
    player.swingAngle += player.swingAngularVelocity;
    player.x = player.swingAnchor.x + Math.sin(player.swingAngle) * player.swingLength;
    player.y = player.swingAnchor.y + Math.cos(player.swingAngle) * player.swingLength;
  } else {
    // Freefall
    player.vy += 0.5; // Gravity
    player.x += player.vx;
    player.y += player.vy;
    if (player.y > canvas.height) gameRunning = false; // Ground hit
  }
}

function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'brown';
  ctx.fill();
}

// Add to gameLoop: updatePlayer(); drawPlayer();
```

**Cursor Tip**: "Implement sprite animation for Benji using an image sprite sheet instead of circle."

## Step 3: Add Input Handling for Swinging

Detect clicks/taps to attach to nearest vine.
```javascript
let vines = []; // Array of vine objects {x, y, length}

canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('touchstart', handleInput);
canvas.addEventListener('mouseup', releaseSwing);
canvas.addEventListener('touchend', releaseSwing);

function handleInput(e) {
  // Find nearest vine (procedural gen in next step)
  let nearestVine = findNearestVine(player.x, player.y);
  if (nearestVine) {
    player.isSwinging = true;
    player.swingAnchor = { x: nearestVine.x, y: nearestVine.y };
    player.swingLength = distance(player, nearestVine);
    player.swingAngle = Math.atan2(player.x - nearestVine.x, player.y - nearestVine.y);
    player.swingAngularVelocity = player.vx / player.swingLength; // Initial momentum
  }
}

function releaseSwing() {
  if (player.isSwinging) {
    player.isSwinging = false;
    player.vx = Math.sin(player.swingAngle) * player.swingLength * player.swingAngularVelocity;
    player.vy = Math.cos(player.swingAngle) * player.swingLength * player.swingAngularVelocity;
  }
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
}

function findNearestVine(px, py) {
  // Logic to find vine within grab range, e.g., 100px
  return vines.find(v => distance({x: px, y: py}, v) < 100) || null;
}
```

**Cursor Tip**: "Add keyboard support using spacebar for grab/release."

## Step 4: Procedural Jungle Generation and Vines/Obstacles/Bananas

Generate elements as player progresses.
```javascript
let worldOffset = 0; // Scroll world left as player moves right

function generateVines() {
  if (vines.length < 10) {
    vines.push({ 
      x: canvas.width + Math.random() * 200 + worldOffset, 
      y: Math.random() * (canvas.height / 2), 
      length: 100 + Math.random() * 200 
    });
  }
}

function updateWorld() {
  worldOffset += player.vx; // Scroll
  vines.forEach(v => v.x -= player.vx); // Move vines left
  vines = vines.filter(v => v.x > -100); // Remove off-screen
  generateVines();

  // Similar for bananas and obstacles
  // Bananas: array of {x, y}, check collision to collect: bananas += 1; score += 10;
  // Obstacles: if collision and no shield, gameRunning = false;
}

function drawVines() {
  vines.forEach(v => {
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    ctx.lineTo(v.x, v.y + v.length);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 5;
    ctx.stroke();
  });
}

// Add to gameLoop: updateWorld(); drawVines();
// Generate similar arrays/functions for bananas (yellow circles) and obstacles (red spikes).
```

**Cursor Tip**: "Implement parallax background scrolling with multiple layers for jungle depth."

## Step 5: Collisions, Scoring, and Upgrades

Basic collision: Use distance checks for circles.
```javascript
function checkCollisions() {
  // For bananas
  bananasArray.forEach((b, i) => {
    if (distance(player, b) < player.radius + 10) {
      bananas += 1;
      score += 10;
      bananasArray.splice(i, 1);
    }
  });
  // Similar for obstacles
}

// Upgrade shop: In main menu, use bananas to increase e.g., player.vx += 1;
```

Draw HUD:
```javascript
function drawHUD() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Bananas: ${bananas}`, 10, 60);
}
```

**Cursor Tip**: "Add localStorage to save high scores and upgrades between sessions."

## Step 6: Add Audio, Menus, and Polish

Audio:
```javascript
const bgMusic = new Audio('jungle_music.mp3'); // Placeholder URL
bgMusic.loop = true;
bgMusic.play();

const collectSound = new Audio('collect.mp3');
// Play on banana collect
```

Menus: Use game states (menu, playing, gameover).
```javascript
let gameState = 'menu';

// In gameLoop: if (gameState === 'playing') { updates... }
// Draw menu buttons as rectangles, check clicks.
```

**Cursor Tip**: "Implement game over screen with restart button and score display."

## Step 7: Testing and Optimization

- Test in browser: Ensure swinging feels responsive, no lag.
- Optimize: Limit object counts, use object pooling for vines/bananas.
- Mobile: Test touch events; add full-screen mode.

---

This step-by-step guide should allow Cursor to iteratively build and refine the game. Start with Step 1 and build up, testing after each. For assets, search free resources or use placeholders. 