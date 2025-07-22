// Benji Bananas Web Clone - Main Game Coordinator
// Refactored: Modular Architecture

// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let gameRunning = true;
let lastTime = 0;
let deltaTime = 0;

// Canvas dimensions
let canvasWidth = 800;
let canvasHeight = 600;

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
  
  // Initialize player position
  initPlayer(canvasHeight);
  
  console.log(`Canvas initialized: ${canvasWidth}x${canvasHeight}`);
}

// Resize event listener for responsive design
function handleResize() {
  const oldCanvasHeight = canvasHeight;
  initCanvas();
  
  // Update player position proportionally
  updatePlayerPosition(canvasHeight, oldCanvasHeight);
  
  console.log('Canvas resized for responsive design');
}

// Main game logic coordinator

// Main game loop - coordinates all modules
function gameLoop(currentTime) {
  if (!gameRunning) {
    // Game over screen (from UI module)
    drawGameOverScreen(ctx, canvasWidth, canvasHeight);
    return;
  }
  
  // Calculate delta time for consistent physics
  deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  // Draw background (from world module)
  drawBackground(ctx, canvasWidth, canvasHeight);
  
  // Update game objects
  const playerStatus = updatePlayer(canvasHeight);
  if (playerStatus === 'gameOver') {
    gameRunning = false;
    console.log('Game Over: Benji hit the ground!');
    return;
  }
  
  updateVines();
  generateVines(canvasWidth, canvasHeight);
  
  // Draw game objects (coordinate all modules)
  drawGround(ctx, canvasWidth, canvasHeight);
  drawVines(ctx, player.x, player.y, player.isSwinging);
  drawPlayer(ctx);
  drawSwingRope(ctx);
  drawHUD(ctx, canvasHeight);
  
  // Performance monitoring
  const fps = Math.round(1000 / deltaTime);
  if (fps < 50) {
    console.warn(`Low FPS detected: ${fps}`);
  }
  
  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// Initialize game - coordinates all modules
function initGame() {
  console.log('Benji Bananas Web Clone - REFACTORED VERSION Starting...');
  
  // Initialize canvas and player
  initCanvas();
  
  // Generate initial world
  generateVines(canvasWidth, canvasHeight);
  
  // Setup input handlers (from UI module)
  setupInputHandlers(canvas);
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
  
  // Start game loop
  requestAnimationFrame(gameLoop);
  
  console.log('Game loop started - Target: 60 FPS');
  console.log('Modular architecture: physics.js + world.js + ui.js + game.js');
  console.log('Controls: Click/Tap or SPACEBAR to grab vines, release to let go!');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);