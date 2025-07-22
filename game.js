// Benji Bananas Web Clone - Game Engine
// Step 1: Basic Canvas Setup and Game Loop

// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let gameRunning = true;
let score = 0;
let bananas = 0;
let lastTime = 0;
let deltaTime = 0;

// Canvas dimensions
let canvasWidth = 800;
let canvasHeight = 600;

// Player (Benji) object
const player = {
  x: 100,
  y: canvasHeight / 2,
  vx: 5, // Horizontal velocity
  vy: 0, // Vertical velocity
  radius: 20, // Simple circle for now
  isSwinging: false,
  swingAnchor: { x: 0, y: 0 },
  swingLength: 0,
  swingAngle: 0,
  swingAngularVelocity: 0,
  isOnGround: false
};

// Vines array for swinging
let vines = [];

// Input state
let isMouseDown = false;
let isKeyDown = false;

// Initialize canvas size
function initCanvas() {
  // Set canvas size based on window size while maintaining aspect ratio
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const aspectRatio = 4/3; // Target aspect ratio
  
  if (windowWidth / windowHeight > aspectRatio) {
    // Window is wider than our aspect ratio
    canvasHeight = windowHeight;
    canvasWidth = windowHeight * aspectRatio;
  } else {
    // Window is taller than our aspect ratio
    canvasWidth = windowWidth;
    canvasHeight = windowWidth / aspectRatio;
  }
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Update player position relative to new canvas size
  player.y = canvasHeight / 2;
  
  console.log(`Canvas initialized: ${canvasWidth}x${canvasHeight}`);
}

// Resize event listener for responsive design
function handleResize() {
  const oldCanvasHeight = canvasHeight;
  initCanvas();
  
  // Adjust player position proportionally
  if (oldCanvasHeight > 0) {
    const heightRatio = canvasHeight / oldCanvasHeight;
    player.y *= heightRatio;
  }
  
  console.log('Canvas resized for responsive design');
}

// Generate vines procedurally
function generateVines() {
  // Keep 5-8 vines on screen at all times
  while (vines.length < 8) {
    const vine = {
      x: canvasWidth + Math.random() * 300 + (vines.length * 150),
      y: Math.random() * (canvasHeight * 0.6) + 50, // Upper portion of screen
      length: 100 + Math.random() * 150
    };
    vines.push(vine);
  }
}

// Update vines (scroll them left)
function updateVines() {
  // Move vines left
  vines.forEach(vine => {
    vine.x -= player.vx;
  });
  
  // Remove off-screen vines
  vines = vines.filter(vine => vine.x > -100);
  
  // Generate new vines
  generateVines();
}

// Draw vines
function drawVines() {
  vines.forEach(vine => {
    // Draw vine rope
    ctx.beginPath();
    ctx.moveTo(vine.x, vine.y);
    ctx.lineTo(vine.x, vine.y + vine.length);
    ctx.strokeStyle = '#228B22'; // Forest green
    ctx.lineWidth = 8;
    ctx.stroke();
    
    // Draw vine attachment point
    ctx.beginPath();
    ctx.arc(vine.x, vine.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fill();
    
    // Highlight nearby vines
    const distance = Math.sqrt((player.x - vine.x) ** 2 + (player.y - vine.y) ** 2);
    if (distance < 100 && !player.isSwinging) {
      ctx.beginPath();
      ctx.arc(vine.x, vine.y, 30, 0, Math.PI * 2);
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });
}

// Distance calculation helper
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Find nearest vine within grab range
function findNearestVine(px, py) {
  let nearest = null;
  let minDistance = Infinity;
  
  vines.forEach(vine => {
    const dist = distance({x: px, y: py}, vine);
    if (dist < 100 && dist < minDistance) { // 100px grab range
      nearest = vine;
      minDistance = dist;
    }
  });
  
  return nearest;
}

// Handle input for vine grabbing
function handleGrabInput() {
  if (!player.isSwinging && !player.isOnGround) {
    const nearestVine = findNearestVine(player.x, player.y);
    if (nearestVine) {
      player.isSwinging = true;
      player.swingAnchor = { x: nearestVine.x, y: nearestVine.y };
      player.swingLength = distance(player, nearestVine);
      player.swingAngle = Math.atan2(player.x - nearestVine.x, player.y - nearestVine.y);
      player.swingAngularVelocity = player.vx / player.swingLength; // Convert horizontal momentum
      
      console.log('Benji grabbed a vine!');
    }
  }
}

// Handle input for vine releasing
function handleReleaseInput() {
  if (player.isSwinging) {
    player.isSwinging = false;
    // Convert swing momentum back to velocity
    player.vx = Math.sin(player.swingAngle) * player.swingLength * player.swingAngularVelocity * 0.8;
    player.vy = Math.cos(player.swingAngle) * player.swingLength * player.swingAngularVelocity * 0.8;
    
    console.log('Benji released the vine!');
  }
}

// Mouse/Touch event handlers
function handleMouseDown(e) {
  e.preventDefault();
  isMouseDown = true;
  handleGrabInput();
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

// Update player physics and movement
function updatePlayer() {
  if (player.isSwinging) {
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
      // Game over when touching ground
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
    console.log(`Player position: (${Math.round(player.x)}, ${Math.round(player.y)}), velocity: (${Math.round(player.vx)}, ${Math.round(player.vy)})`);
  }
}

// Draw player (Benji)
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  
  // Color based on state
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
  // Eyes
  ctx.beginPath();
  ctx.arc(player.x - 6, player.y - 5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(player.x + 6, player.y - 5, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Smile
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
    
    // Highlight the anchor point
    ctx.beginPath();
    ctx.arc(player.swingAnchor.x, player.swingAnchor.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
}

// Draw ground
function drawGround() {
  const groundLevel = canvasHeight - 50;
  ctx.fillStyle = '#8B4513'; // Brown ground
  ctx.fillRect(0, groundLevel, canvasWidth, 50);
  
  // Add grass texture
  ctx.fillStyle = '#228B22'; // Green grass
  ctx.fillRect(0, groundLevel, canvasWidth, 10);
}

// Main game loop
function gameLoop(currentTime) {
  if (!gameRunning) {
    // Game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvasWidth / 2, canvasHeight / 2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText('Benji hit the ground!', canvasWidth / 2, canvasHeight / 2);
    ctx.fillText('Refresh to play again', canvasWidth / 2, canvasHeight / 2 + 40);
    ctx.textAlign = 'left'; // Reset text alignment
    return;
  }
  
  // Calculate delta time for consistent physics
  deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  // Clear canvas with jungle-themed background
  ctx.fillStyle = '#90EE90'; // Light green for jungle
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.3);
  gradient.addColorStop(0, '#87CEEB'); // Sky blue
  gradient.addColorStop(1, '#90EE90'); // Light green
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.3);
  
  // Update game objects
  updatePlayer();
  updateVines();
  
  // Draw game objects
  drawGround();
  drawVines();
  drawPlayer();
  drawSwingRope(); // Draw rope if swinging
  drawHUD();
  
  // Performance monitoring
  const fps = Math.round(1000 / deltaTime);
  if (fps < 50) {
    console.warn(`Low FPS detected: ${fps}`);
  }
  
  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// Draw HUD (Head-Up Display)
function drawHUD() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  
  // Score display
  const scoreText = `Score: ${score}`;
  ctx.strokeText(scoreText, 10, 30);
  ctx.fillText(scoreText, 10, 30);
  
  // Banana counter
  const bananaText = `Bananas: ${bananas}`;
  ctx.strokeText(bananaText, 10, 60);
  ctx.fillText(bananaText, 10, 60);
  
  // Player state info
  const stateText = player.isSwinging ? 'Swinging' : (player.isOnGround ? 'On Ground' : 'Falling');
  ctx.strokeText(`State: ${stateText}`, 10, 90);
  ctx.fillText(`State: ${stateText}`, 10, 90);
  
  // Vine count
  const vineText = `Vines: ${vines.length}`;
  ctx.strokeText(vineText, 10, 120);
  ctx.fillText(vineText, 10, 120);
  
  // Controls hint
  ctx.font = '16px Arial';
  const controlText = 'Click/Tap or SPACEBAR to grab vines!';
  ctx.strokeText(controlText, 10, canvasHeight - 50);
  ctx.fillText(controlText, 10, canvasHeight - 50);
  
  // Game status
  ctx.font = '20px Arial';
  const statusText = 'Step 3: Vine Swinging Complete';
  ctx.strokeText(statusText, 10, canvasHeight - 20);
  ctx.fillText(statusText, 10, canvasHeight - 20);
}

// Initialize game
function initGame() {
  console.log('Benji Bananas Web Clone - Starting...');
  initCanvas();
  
  // Generate initial vines
  generateVines();
  
  // Add event listeners
  window.addEventListener('resize', handleResize);
  
  // Mouse/Touch controls
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchend', handleTouchEnd);
  
  // Keyboard controls
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // Start game loop
  requestAnimationFrame(gameLoop);
  
  console.log('Game loop started - Target: 60 FPS');
  console.log('Controls: Click/Tap or SPACEBAR to grab vines, release to let go!');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);