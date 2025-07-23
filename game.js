// Benji Bananas Web Clone - REFACTORED: Clean Single-File Architecture
// Organized by modules but kept in single file for dependency safety

// ==================== CANVAS AND GAME STATE ====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let gameRunning = true;
let lastTime = 0;
let deltaTime = 0;
let score = 0;
let bananas = 0;

// Canvas dimensions
let canvasWidth = 800;
let canvasHeight = 600;

// ==================== PLAYER PHYSICS MODULE ====================
// Player (Benji) object
const player = {
  x: 100,
  y: 0, // Will be set in initPlayer
  vx: 3, // Horizontal velocity (reduced for better control)
  vy: -2, // Start with slight upward velocity
  radius: 20, // Simple circle for now
  isSwinging: false,
  swingAnchor: { x: 0, y: 0 },
  swingLength: 0,
  swingAngle: 0,
  swingAngularVelocity: 0,
  isOnGround: false
};

// ==================== WORLD MANAGEMENT MODULE ====================
// Vines array for swinging
let vines = [];

// ==================== PARALLAX BACKGROUND ====================
const backgroundLayers = [
  { image: null, speed: 0.2, x: 0, color: '#b0e0e6' }, // Farthest, light blue
  { image: null, speed: 0.5, x: 0, color: '#87ceeb' }, // Middle, sky blue
  { image: null, speed: 1.0, x: 0, color: '#2e8b57' }  // Closest, sea green (like trees)
];

function updateBackground() {
  backgroundLayers.forEach(layer => {
    // The background moves opposite to the player's perceived direction
    layer.x -= player.vx * layer.speed;
    // Reset the position when an image scrolls completely off-screen to create a seamless loop
    if (layer.x < -canvasWidth) {
      layer.x = 0;
    }
  });
}

function drawBackground() {
  // Draw solid base color first
  ctx.fillStyle = '#87ceeb'; // Base sky color
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw each parallax layer
  backgroundLayers.forEach(layer => {
    ctx.fillStyle = layer.color;
    // We draw two images for each layer to create a seamless loop
    ctx.fillRect(layer.x, 0, canvasWidth, canvasHeight);
    ctx.fillRect(layer.x + canvasWidth, 0, canvasWidth, canvasHeight);
  });
}

// Input state
let isMouseDown = false;
let isKeyDown = false;

// ==================== UTILITY FUNCTIONS ====================
// Distance calculation helper
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// ==================== CANVAS MANAGEMENT ====================
// Initialize canvas size
function initCanvas() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const aspectRatio = 4/3; // Target aspect ratio
  
  if (windowWidth / windowHeight > aspectRatio) {
    canvasHeight = windowHeight;
    canvasWidth = windowHeight * aspectRatio;
  } else {
    canvasWidth = windowWidth;
    canvasHeight = windowWidth / aspectRatio;
  }
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Initialize player position
  player.y = canvasHeight / 2;
  
  console.log(`Canvas initialized: ${canvasWidth}x${canvasHeight}`);
}

// Resize event listener for responsive design
function handleResize() {
  const oldCanvasHeight = canvasHeight;
  initCanvas();
  
  // Update player position proportionally
  if (oldCanvasHeight > 0) {
    const heightRatio = canvasHeight / oldCanvasHeight;
    player.y *= heightRatio;
  }
  
  console.log('Canvas resized for responsive design');
}

// ==================== PLAYER PHYSICS FUNCTIONS ====================
// Update player physics and movement
function updatePlayer() {
  if (player.isSwinging) {
    // When swinging, the player's horizontal velocity contributes to the world scrolling,
    // but the player themselves pivots around a fixed point.
    updateBackground();
    updateVines();

    // Pendulum physics
    player.swingAngularVelocity += (Math.sin(player.swingAngle) * -0.005); // Gravity effect
    player.swingAngle += player.swingAngularVelocity;
    player.x = player.swingAnchor.x + Math.sin(player.swingAngle) * player.swingLength;
    player.y = player.swingAnchor.y + Math.cos(player.swingAngle) * player.swingLength;
  } else {
    // Freefall physics
    player.vy += 0.5; // Gravity
    player.x += player.vx;
    player.y += player.vy;

    // Ground collision detection
    const groundLevel = canvasHeight - 50; // Leave space at bottom for ground
    if (player.y + player.radius > groundLevel) {
      player.y = groundLevel - player.radius;
      player.vy = 0;
      player.isOnGround = true;
      gameRunning = false;
      console.log('Game Over: Benji hit the ground!');
    } else {
      player.isOnGround = false;
    }

    // Keep player on screen horizontally
    if (player.x < player.radius) {
      player.x = player.radius;
      player.vx = Math.abs(player.vx); // Bounce off left edge
    }
  }

  // Log player position for debugging
  if (Math.random() < 0.01) { // Log occasionally to avoid spam
    console.log(`Player position: (${Math.round(player.x)}, ${Math.round(player.y)}), velocity: (${Math.round(player.vx)}, ${Math.round(player.vy)}), state: ${player.isSwinging ? 'swinging' : (player.isOnGround ? 'ground' : 'falling')}`);
  }
}

// ==================== WORLD GENERATION FUNCTIONS ====================
// Generate vines procedurally
function generateVines() {
  // VINE GENERATION 3.0: Guaranteed first vine and "vine corridors" for smoother gameplay.
  if (vines.length === 0) {
    // Place the first vine directly in Benji's path for an easy start.
    vines.push({
      x: player.x + 150,
      y: player.y,
      length: 200
    });
  }

  // Ensure there are always enough vines ahead of the player in "corridors"
  while (vines.length < 12) { // Increased vine density
    let lastVine = vines[vines.length - 1];
    const newVine = {
      x: lastVine.x + 200 + (Math.random() * 100 - 50),
      y: lastVine.y + (Math.random() * 200 - 100), // Create vertical variation
      length: 150 + Math.random() * 100
    };

    // Clamp the vine's y-position to keep it on screen
    if (newVine.y < 50) newVine.y = 50;
    if (newVine.y > canvasHeight * 0.5) newVine.y = canvasHeight * 0.5;
    
    vines.push(newVine);
  }
}

// Update vines (scroll them left)
function updateVines() {
  vines.forEach(vine => {
    // Only scroll vines if the player is not swinging
    if (!player.isSwinging) {
      vine.x -= player.vx;
    }
  });

  const vinesBefore = vines.length;
  vines = vines.filter(vine => vine.x > -100);

  if (vines.length < vinesBefore) {
    console.log(`Removed ${vinesBefore - vines.length} off-screen vines`);
  }

  // Regenerate vines only if needed
  if (vines.length < 8) {
    generateVines();
  }
}

// Find nearest vine within grab range
function findNearestVine(px, py) {
  let nearest = null;
  let minDistance = Infinity;
  
  vines.forEach(vine => {
    const dist = distance({x: px, y: py}, vine);
    if (dist < 150 && dist < minDistance) { // 150px grab range (increased)
      nearest = vine;
      minDistance = dist;
    }
  });
  
  return nearest;
}

// ==================== INPUT HANDLING FUNCTIONS ====================
// Handle vine grabbing input
function handleGrabVine(nearestVine) {
  if (!player.isSwinging && !player.isOnGround && nearestVine) {
    player.isSwinging = true;
    player.swingAnchor = { x: nearestVine.x, y: nearestVine.y };
    player.swingLength = distance(player, nearestVine);
    player.swingAngle = Math.atan2(player.x - nearestVine.x, player.y - nearestVine.y);
    player.swingAngularVelocity = player.vx / player.swingLength;
    
    // Increment score for each new vine grabbed
    score++;
    console.log(`Benji grabbed a vine! Score: ${score}`);
    return true;
  }
  return false;
}

// Handle vine releasing input
function handleReleaseVine() {
  if (player.isSwinging) {
    player.isSwinging = false;
    
    // ARCADE PHYSICS 2.0: Add a dedicated upward lift for better trajectory control.
    const horizontalBoost = 1.2;
    const upwardLift = -10; // A strong upward push

    let releaseVx = Math.sin(player.swingAngle) * player.swingLength * player.swingAngularVelocity * horizontalBoost;
    let releaseVy = Math.cos(player.swingAngle) * player.swingLength * player.swingAngularVelocity + upwardLift;

    player.vx = releaseVx;
    player.vy = releaseVy;

    console.log(`Benji released with UPWARD LIFT! New velocity: (${player.vx.toFixed(2)}, ${player.vy.toFixed(2)})`);
    return true;
  }
  return false;
}

// Handle input for vine grabbing
function handleGrabInput() {
  const nearestVine = findNearestVine(player.x, player.y);
  handleGrabVine(nearestVine);
}

// Handle input for vine releasing
function handleReleaseInput() {
  handleReleaseVine();
}

// Mouse/Touch event handlers
function handleMouseDown(e) {
  e.preventDefault();
  if (gameRunning) {
    isMouseDown = true;
    handleGrabInput();
  } else {
    // Check if the restart button was clicked
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const buttonX = canvasWidth / 2 - 100;
    const buttonY = canvasHeight / 2 - 25;
    const buttonWidth = 200;
    const buttonHeight = 50;
    
    if (clickX >= buttonX && clickX <= buttonX + buttonWidth &&
        clickY >= buttonY && clickY <= buttonY + buttonHeight) {
      restartGame();
    }
  }
}

function handleMouseUp(e) {
  e.preventDefault();
  isMouseDown = false;
  handleReleaseInput();
}

function handleTouchStart(e) {
  e.preventDefault();
  isMouseDown = true;
  handleGrabInput();
}

function handleTouchEnd(e) {
  e.preventDefault();
  isMouseDown = false;
  handleReleaseInput();
}

// Keyboard event handlers
function handleKeyDown(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!isKeyDown) {
      isKeyDown = true;
      handleGrabInput();
    }
  }
}

function handleKeyUp(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    isKeyDown = false;
    handleReleaseInput();
  }
}

// ==================== DRAWING FUNCTIONS ====================
// Draw background with sky gradient
function drawBackground() {
  ctx.fillStyle = '#90EE90'; // Light green for jungle
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.3);
  gradient.addColorStop(0, '#87CEEB'); // Sky blue
  gradient.addColorStop(1, '#90EE90'); // Light green
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.3);
}

// Draw ground
function drawGround() {
  const groundLevel = canvasHeight - 50;
  ctx.fillStyle = '#8B4513'; // Brown ground
  ctx.fillRect(0, groundLevel, canvasWidth, 50);
  
  ctx.fillStyle = '#228B22'; // Green grass
  ctx.fillRect(0, groundLevel, canvasWidth, 10);
}

// Draw vines
function drawVines() {
  vines.forEach(vine => {
    ctx.beginPath();
    ctx.moveTo(vine.x, vine.y);
    ctx.lineTo(vine.x, vine.y + vine.length);
    ctx.strokeStyle = '#228B22'; // Forest green
    ctx.lineWidth = 8;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(vine.x, vine.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fill();
    
    // Highlight nearby vines
    const vineDistance = Math.sqrt((player.x - vine.x) ** 2 + (player.y - vine.y) ** 2);
    if (vineDistance < 150 && !player.isSwinging) {
      ctx.beginPath();
      ctx.arc(vine.x, vine.y, 40, 0, Math.PI * 2);
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  });
}

// Draw player (Benji)
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  
  if (player.isSwinging) {
    ctx.fillStyle = '#8B4513'; // Dark brown when swinging
  } else if (player.isOnGround) {
    ctx.fillStyle = '#CD853F'; // Lighter brown when on ground
  } else {
    ctx.fillStyle = '#A0522D'; // Medium brown when falling
  }
  
  ctx.fill();
  
  // Add simple face
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(player.x - 6, player.y - 5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(player.x + 6, player.y - 5, 2, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(player.x, player.y + 3, 8, 0, Math.PI);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Draw swing rope when player is swinging
function drawSwingRope() {
  if (player.isSwinging) {
    ctx.beginPath();
    ctx.moveTo(player.swingAnchor.x, player.swingAnchor.y);
    ctx.lineTo(player.x, player.y);
    ctx.strokeStyle = '#8B4513'; // Brown rope
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(player.swingAnchor.x, player.swingAnchor.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

// Draw HUD (Head-Up Display)
function drawHUD() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  
  const scoreText = `Score: ${score}`;
  ctx.strokeText(scoreText, 10, 30);
  ctx.fillText(scoreText, 10, 30);
  
  const bananaText = `Bananas: ${bananas}`;
  ctx.strokeText(bananaText, 10, 60);
  ctx.fillText(bananaText, 10, 60);
  
  const stateText = player.isSwinging ? 'Swinging' : (player.isOnGround ? 'On Ground' : 'Falling');
  ctx.strokeText(`State: ${stateText}`, 10, 90);
  ctx.fillText(`State: ${stateText}`, 10, 90);
  
  const vineText = `Vines: ${vines.length}`;
  ctx.strokeText(vineText, 10, 120);
  ctx.fillText(vineText, 10, 120);
  
  ctx.font = '16px Arial';
  const controlText = 'Click/Tap or SPACEBAR to grab vines!';
  ctx.strokeText(controlText, 10, canvasHeight - 50);
  ctx.fillText(controlText, 10, canvasHeight - 50);
  
  ctx.font = '20px Arial';
  const statusText = 'REFACTORED: Clean Architecture';
  ctx.strokeText(statusText, 10, canvasHeight - 20);
  ctx.fillText(statusText, 10, canvasHeight - 20);
}

// Draw game over screen
function drawGameOverScreen() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  ctx.fillStyle = 'white';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvasWidth / 2, canvasHeight / 2 - 100);
  
  // Draw Restart Button
  const buttonX = canvasWidth / 2 - 100;
  const buttonY = canvasHeight / 2 - 25;
  const buttonWidth = 200;
  const buttonHeight = 50;
  
  ctx.fillStyle = '#4CAF50'; // Green button
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
  
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('Restart', canvasWidth / 2, canvasHeight / 2 + 10);
  
  ctx.textAlign = 'left';
}

function restartGame() {
  // Reset player state
  player.x = 100;
  player.y = canvasHeight / 2;
  player.vx = 3;
  player.vy = -2;
  player.isSwinging = false;
  player.isOnGround = false;
  
  // Reset game state
  score = 0;
  vines = [];
  gameRunning = true;
  
  // Regenerate the world
  generateVines();
  
  console.log('--- GAME RESTARTED ---');
}

// ==================== MAIN GAME LOOP ====================
function gameLoop(currentTime) {
  if (!gameRunning) {
    drawGameOverScreen();
    return;
  }
  
  deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  // Update game objects
  updatePlayer();
  updateVines();
  generateVines();
  updateBackground();

  // Draw everything
  drawBackground();
  drawGround();
  drawVines();
  drawPlayer();
  drawSwingRope();
  drawHUD();
  
  // Performance monitoring
  const fps = Math.round(1000 / deltaTime);
  if (fps < 50) {
    console.warn(`Low FPS detected: ${fps}`);
  }
  
  requestAnimationFrame(gameLoop);
}

// ==================== INITIALIZATION ====================
function initGame() {
  console.log('Benji Bananas Web Clone - REFACTORED: Clean Architecture Starting...');
  
  initCanvas();
  generateVines();
  
  // Setup input handlers
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchend', handleTouchEnd);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  window.addEventListener('resize', handleResize);
  
  requestAnimationFrame(gameLoop);
  
  console.log('Game loop started - Target: 60 FPS');
  console.log('Architecture: Single-file modular organization');
  console.log('Controls: Click/Tap or SPACEBAR to grab vines, release to let go!');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);